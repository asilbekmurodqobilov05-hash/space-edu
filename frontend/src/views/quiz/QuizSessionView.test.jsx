/**
 * The quiz runs on the server now.
 *
 * Two findings, one old and one from the second pass:
 *
 * - The category guard was `if (!quizData[category] || questions.length === 0)`.
 *   For `/quiz/constructor` that reads Object.prototype.constructor — truthy,
 *   with `.length` 1 rather than 0 — so both halves passed and the component
 *   went on to render `currentQ.text` on `undefined`. Fixed once with
 *   `Object.hasOwn`; the category is now checked against a fixed list on the
 *   server, which removes the object-lookup entirely.
 * - `quizData.js` carried the correct answer to all 24 questions into the
 *   browser bundle, and the score was computed here from that key. The XP it
 *   showed was never persisted: `addXp` is a local optimistic update, so the
 *   number went up and the next profile fetch wiped it.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
  slowApi: { post: vi.fn() },
  setupApiAuth: vi.fn(),
}));

let api;
let QuizSessionView;

const question = (id, text) => ({
  id, category: 'physics', difficulty: 'easy',
  question: text, question_en: text, question_ru: text,
  options: ['A', 'B', 'C', 'D'], time_seconds: 60,
});

beforeEach(async () => {
  ({ default: api } = await import('@/lib/api'));
  api.get.mockReset();
  api.post.mockReset();
  api.get.mockResolvedValue({ data: {} });
  ({ default: QuizSessionView } = await import('./QuizSessionView'));
});

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/quiz/:category" element={<QuizSessionView />} />
      </Routes>
    </MemoryRouter>,
  );
}

function startsWith(questions) {
  api.post.mockImplementation((url) => {
    if (url.includes('/quiz/start/')) {
      return Promise.resolve({
        data: { session_id: 7, category: 'physics', total: questions.length, questions },
      });
    }
    return Promise.resolve({ data: { score: 1, total: 1, percentage: 100, xp_earned: 70 } });
  });
}

describe('the answer key does not reach the browser', () => {
  it('the question payload carries no correct answer', async () => {
    startsWith([question(1, 'Tezlik nima?')]);
    renderAt('/quiz/physics');

    await waitFor(() => expect(api.post).toHaveBeenCalled());
    const [, body] = api.post.mock.calls[0];
    expect(body).not.toHaveProperty('answers');

    // Whatever the view renders, it never had an answer to render.
    const payload = await api.post.mock.results[0].value;
    for (const q of payload.data.questions) {
      expect(q).not.toHaveProperty('correct_answer');
      expect(q).not.toHaveProperty('correctAnswer');
    }
  });

  it('the static answer files are gone from the tree', () => {
    // Vite resolves imports at transform time, so importing a deleted module is
    // a build error rather than a rejected promise — check the filesystem.
    expect(existsSync(resolve(__dirname, '../../data/quizData.js'))).toBe(false);
    expect(existsSync(resolve(__dirname, '../../data/problemsData.js'))).toBe(false);
  });
});

describe('category handling', () => {
  // The old hole: these are Object.prototype members, so a lookup on a plain
  // object returns something truthy for every one of them.
  const PROTOTYPE_KEYS = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf',
    'propertyIsEnumerable', 'toString', 'valueOf', '__proto__',
  ];

  it.each(PROTOTYPE_KEYS)('does not crash on /quiz/%s', async (key) => {
    api.post.mockRejectedValue({ response: { status: 400 } });
    expect(() => renderAt(`/quiz/${key}`)).not.toThrow();
    expect(await screen.findByText(/not found or empty/i)).toBeInTheDocument();
  });

  it('an unknown category shows the empty screen rather than throwing', async () => {
    api.post.mockRejectedValue({ response: { status: 400 } });
    renderAt('/quiz/astrology');
    expect(await screen.findByText(/not found or empty/i)).toBeInTheDocument();
  });

  it('a category with no questions shows the empty screen', async () => {
    api.post.mockResolvedValue({ data: { session_id: 1, questions: [] } });
    renderAt('/quiz/physics');
    expect(await screen.findByText(/not found or empty/i)).toBeInTheDocument();
  });

  it('a real category renders its first question', async () => {
    startsWith([question(1, 'Tezlik nima?')]);
    renderAt('/quiz/physics');
    expect(await screen.findByText('Tezlik nima?')).toBeInTheDocument();
  });
});

describe('lesson quizzes', () => {
  it('a ?lesson= parameter asks for that lesson, not the category', async () => {
    startsWith([question(1, 'Tezlik nima?')]);
    renderAt('/quiz/physics?lesson=kin-one');

    await waitFor(() => expect(api.post).toHaveBeenCalled());
    expect(api.post).toHaveBeenCalledWith('/challenges/quiz/start/', { lesson: 'kin-one' });
  });

  it('without it, the category is what is asked for', async () => {
    startsWith([question(1, 'Tezlik nima?')]);
    renderAt('/quiz/physics');

    await waitFor(() => expect(api.post).toHaveBeenCalled());
    expect(api.post).toHaveBeenCalledWith(
      '/challenges/quiz/start/', { category: 'physics', count: 10 },
    );
  });
});
