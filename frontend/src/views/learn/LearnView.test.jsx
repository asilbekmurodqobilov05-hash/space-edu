/**
 * Second-pass finding, 22 Aug 2026.
 *
 * The /learn landing cards carried hand-written lesson counts, and every one
 * was wrong by a factor of three to six: physics advertised 24 lessons against
 * 144 real ones, astronomy 32 against 126. The page also claimed "229 lessons"
 * and "6 courses" over five sections.
 *
 * They were the fifth copy of content metadata in the project. ADR 0001 removed
 * three; this removes the last one that faces a student.
 */
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
  slowApi: { post: vi.fn() },
  setupApiAuth: vi.fn(),
}));

let api;
let LearnView;

beforeEach(async () => {
  ({ default: api } = await import('@/lib/api'));
  api.get.mockReset();
  ({ default: LearnView } = await import('./LearnView'));
});

const sphere = (slug, lessons) => ({
  id: slug, slug, order: 1, title: slug, title_en: slug, title_ru: slug,
  description: '', description_en: '', color: '#fff', icon: 'Atom',
  link: `/learn/${slug}`, lessons_count: lessons, is_active: true,
  topic_count: 1, problem_count: 0,
});

function renderPage() {
  return render(<MemoryRouter><LearnView /></MemoryRouter>);
}

describe('LearnView lesson counts', () => {
  it('shows the number the server computed, not a hand-written one', async () => {
    api.get.mockResolvedValue({
      data: [sphere('physics', 144), sphere('astronomy', 126)],
    });

    renderPage();
    await waitFor(async () => {
      expect(await screen.findAllByText('144')).not.toHaveLength(0);
    });
    expect(await screen.findAllByText('126')).not.toHaveLength(0);
  });

  it('reflects an edit made in the admin panel', async () => {
    // The whole point of ADR 0001: editing content changes what students see.
    api.get.mockResolvedValue({ data: [sphere('physics', 999)] });

    renderPage();
    expect(await screen.findAllByText('999')).not.toHaveLength(0);
  });

  it('accepts a paginated list as well as a bare one', async () => {
    api.get.mockResolvedValue({ data: { results: [sphere('physics', 144)], next: null } });

    renderPage();
    expect(await screen.findAllByText('144')).not.toHaveLength(0);
  });

  it('falls back to its own numbers when the API is unreachable', async () => {
    api.get.mockRejectedValue(new Error('offline'));

    const { container } = renderPage();
    await waitFor(() => expect(container.firstChild).toBeTruthy());
    // The fallbacks are seeded from the real content, so they are the true
    // counts too — the point is that the page still renders a number.
    expect(await screen.findAllByText('144')).not.toHaveLength(0);
  });

  it('counts the courses it actually renders', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderPage();
    // Five sections, not the "6" that was written down.
    expect(await screen.findAllByText('5')).not.toHaveLength(0);
  });

  it('totals the lessons rather than repeating a stale 229', async () => {
    api.get.mockResolvedValue({
      data: [sphere('physics', 100), sphere('astronomy', 100)],
    });
    renderPage();
    // 100 + 100 from the API, plus the fallbacks for the three the API did not
    // mention (problems 145, creativity 57, interviews 63).
    expect(await screen.findAllByText('465')).not.toHaveLength(0);
  });
});
