/**
 * Regression test for the quiz category guard.
 *
 * Finding (22 Aug 2026 audit): the guard was `if (!quizData[category] ||
 * questions.length === 0)`. For `/quiz/constructor` that reads
 * Object.prototype.constructor — the Object function, which is truthy and whose
 * .length is 1, not 0. Both halves of the guard passed, so the component went
 * on to render `currentQ.text` on `undefined` and took the app down.
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn().mockResolvedValue({ data: [] }), post: vi.fn() },
  slowApi: { post: vi.fn() },
  setupApiAuth: vi.fn(),
}));

const { default: QuizSessionView } = await import('./QuizSessionView');
const { quizData } = await import('@/data/quizData');

function renderAt(category) {
  return render(
    <MemoryRouter initialEntries={[`/quiz/${category}`]}>
      <Routes>
        <Route path="/quiz/:category" element={<QuizSessionView />} />
      </Routes>
    </MemoryRouter>,
  );
}

// Inherited Object.prototype members. `constructor` and `hasOwnProperty` have
// arity 1, so they slipped past the old `.length === 0` half of the guard too.
const PROTOTYPE_KEYS = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  '__proto__',
];

describe('QuizSessionView category guard', () => {
  it.each(PROTOTYPE_KEYS)('does not crash on /quiz/%s', (key) => {
    expect(() => renderAt(key)).not.toThrow();
    expect(screen.getByText(/not found or empty/i)).toBeInTheDocument();
  });

  it('shows the not-found screen for an unknown category', () => {
    renderAt('astrology');
    expect(screen.getByText(/not found or empty/i)).toBeInTheDocument();
  });

  it('renders a real category', () => {
    const real = Object.keys(quizData).find((k) => quizData[k]?.length > 0);
    expect(real).toBeTruthy();
    renderAt(real);
    expect(screen.queryByText(/not found or empty/i)).not.toBeInTheDocument();
  });

  it('the guard uses own-property lookup, not truthiness', () => {
    // Locks the shape of the fix, not just its effect.
    expect(Object.hasOwn(quizData, 'constructor')).toBe(false);
    expect(quizData.constructor).toBeTruthy();
    expect(quizData.constructor.length).not.toBe(0);
  });
});
