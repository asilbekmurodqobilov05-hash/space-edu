/**
 * Second-pass finding, 22 Aug 2026.
 *
 * Every read in the admin panel discarded its error and every write was a bare
 * `.then()`. A failed save left the modal open with nothing said, a failed
 * delete looked like a no-op, and a 403 — which is exactly what a staff member
 * gets for touching a privilege flag, by design — reached them as silence.
 * The writes also raised unhandled promise rejections.
 */
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  slowApi: { post: vi.fn() },
  setupApiAuth: vi.fn(),
}));

let api;
let code;

/** The file with comments removed, so prose about `.catch` is not evidence. */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

beforeEach(async () => {
  ({ default: api } = await import('@/lib/api'));
  for (const method of ['get', 'post', 'patch', 'delete']) {
    api[method].mockReset();
    api[method].mockResolvedValue({ data: [] });
  }
  code = stripComments(await import('./AdminDashboard?raw').then((m) => m.default));
});

describe('failures reach the operator', () => {
  it('every request has a rejection handler', () => {
    // Each `api.<verb>(` starts a chain; look ahead far enough to cover the
    // whole statement and require a `.catch` in it.
    const calls = [...code.matchAll(/api\.(get|post|patch|delete)\(/g)];
    expect(calls.length).toBeGreaterThan(5);

    const uncaught = calls
      .map((match) => code.slice(match.index, match.index + 400))
      .filter((chain) => !/\.catch\(/.test(chain));
    expect(uncaught, 'these drop their failure on the floor').toEqual([]);
  });

  it('no handler is an empty one', () => {
    expect(code).not.toMatch(/\.catch\(\s*\(\s*\)\s*=>\s*\{\s*\}\s*\)/);
  });

  it('a failure is rendered, not just caught', () => {
    expect(code).toMatch(/function ErrorNote/);
    expect((code.match(/<ErrorNote/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });
});

describe('the dashboard itself', () => {
  async function renderAsStaff() {
    const { useAuthStore } = await import('@/store/useAuthStore');
    useAuthStore.setState({
      user: { id: 1, username: 'admin', is_staff: true },
      accessToken: 'a', refreshToken: 'r', isAuthenticated: true,
    });
    const { default: AdminDashboard } = await import('./AdminDashboard');
    return render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
  }

  it('mounts for a staff user', async () => {
    api.get.mockResolvedValue({ data: { users: 0, spheres: 0, topics: 0, lessons: 0 } });
    const { container } = await renderAsStaff();
    await waitFor(() => expect(container.firstChild).toBeTruthy());
  });

  it('renders nothing for someone who is not staff', async () => {
    const { useAuthStore } = await import('@/store/useAuthStore');
    useAuthStore.setState({
      user: { id: 2, username: 'student', is_staff: false }, isAuthenticated: true,
    });
    const { default: AdminDashboard } = await import('./AdminDashboard');
    const { container } = render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    expect(container.firstChild).toBeNull();
  });
});
