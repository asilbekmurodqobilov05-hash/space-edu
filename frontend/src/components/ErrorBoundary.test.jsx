/**
 * Regression tests for the crash screen.
 *
 * Finding (22 Aug 2026 audit): "Reset app data" removed 'auth-storage' and
 * 'uz-cosmos-storage', neither of which exists, and missed every key that does
 * — including 'uz-cosmos-auth'. So when a crash was caused by corrupt persisted
 * state, the only recovery button left that state in place and the loop
 * continued.
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorBoundary from './ErrorBoundary';

// Every zustand persist() name in src/store and src/game.
const PERSISTED_KEYS = [
  'uz-cosmos-auth',
  'gamification-storage',
  'uz-cosmos-learning-storage',
  'space-edu-likes-storage',
  'space-edu-problems',
  'star-collection-storage',
  'space-edu-arcade',
];

function Boom() {
  throw new Error('scene failed to load');
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // React logs the caught error; that is expected and noisy.
    vi.spyOn(console, 'error').mockImplementation(() => {});
    PERSISTED_KEYS.forEach((k) => localStorage.setItem(k, '{"state":{}}'));
  });

  it('shows the crash screen instead of a blank page', () => {
    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset app data/i })).toBeInTheDocument();
  });

  it('renders children normally when nothing throws', () => {
    render(<ErrorBoundary><p>all good</p></ErrorBoundary>);
    expect(screen.getByText('all good')).toBeInTheDocument();
  });

  it('reset clears every key a store actually persists', () => {
    const assign = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({ assign, reload: vi.fn() });

    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    fireEvent.click(screen.getByRole('button', { name: /reset app data/i }));

    const survivors = PERSISTED_KEYS.filter((k) => localStorage.getItem(k) !== null);
    expect(survivors).toEqual([]);
    expect(assign).toHaveBeenCalledWith('/');
  });

  it('clears the auth key in particular', () => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({ assign: vi.fn(), reload: vi.fn() });

    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    fireEvent.click(screen.getByRole('button', { name: /reset app data/i }));

    // This is the one the old list missed, under the wrong name.
    expect(localStorage.getItem('uz-cosmos-auth')).toBeNull();
  });

  it('survives localStorage throwing, as it does in private mode', () => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({ assign: vi.fn(), reload: vi.fn() });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('access denied');
    });

    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: /reset app data/i })),
    ).not.toThrow();
  });
});
