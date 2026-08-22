/**
 * Ticket F4: a first render for each of the four largest views.
 *
 * Size is the reason these four were picked — SpaceLabView 1283 lines,
 * ProfileView 1092, MarketView 742, LiveSpaceView 720. The audit's worst
 * frontend bug was a `t()` called outside the component that declared it, which
 * threw on the first render of a product card and, because the only
 * ErrorBoundary is at the root, took the whole site to the crash screen. A
 * mounting test is the cheapest thing that catches that class of mistake, and
 * these are the four files where it is most likely to hide.
 *
 * They are smoke tests. They assert the view mounts, survives an empty API and
 * a failing API, and unmounts without throwing — not what it looks like.
 */
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  slowApi: { post: vi.fn() },
  setupApiAuth: vi.fn(),
}));

// jsdom has no WebGL, so react-three-fiber's Canvas cannot mount. Everything
// inside it is scene graph rather than DOM, and it is not what these tests are
// looking at.
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="r3f-canvas">{children}</div>,
  useFrame: () => {},
  useLoader: () => [null, null, null],
  useThree: () => ({ camera: {}, gl: {}, scene: {}, size: { width: 800, height: 600 } }),
  extend: () => {},
}));
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Stars: () => null,
  Environment: () => null,
  Line: () => null,
  useTexture: () => ({}),
  Html: ({ children }) => <div>{children}</div>,
}));
vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }) => <>{children}</>,
  Bloom: () => null,
  Vignette: () => null,
  Noise: () => null,
  ChromaticAberration: () => null,
}));

const VIEWS = [
  { name: 'SpaceLabView', load: () => import('./explore/SpaceLabView') },
  { name: 'ProfileView', load: () => import('./profile/ProfileView') },
  { name: 'MarketView', load: () => import('./misc/MarketView') },
  { name: 'LiveSpaceView', load: () => import('./community/LiveSpaceView') },
];

let api;
let consoleError;

beforeEach(async () => {
  ({ default: api } = await import('@/lib/api'));
  for (const method of ['get', 'post', 'patch', 'delete']) {
    api[method].mockReset();
    api[method].mockResolvedValue({ data: [] });
  }
  // Several of these fetch third-party feeds (Celestrak, NASA APOD) on mount.
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => [],
    text: async () => '',
  }));
  // A view that throws during render logs through console.error before the
  // boundary sees it; failing on that is what makes these tests worth having.
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderView(Component) {
  return render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>,
  );
}

/** React logs the real error before rethrowing; prop-type noise is not that. */
function renderErrors() {
  return consoleError.mock.calls
    .map((args) => String(args[0]))
    .filter((message) => /Error|Uncaught|not a function|undefined is not/.test(message));
}

describe.each(VIEWS)('$name', ({ load }) => {
  it('mounts', async () => {
    const { default: Component } = await load();
    const { container } = renderView(Component);
    await waitFor(() => expect(container.firstChild).toBeTruthy());
    expect(renderErrors()).toEqual([]);
  });

  it('mounts when every API call fails', async () => {
    // A cold-starting backend answers 502 for the first few seconds. None of
    // these views should be a crash screen while that happens.
    for (const method of ['get', 'post', 'patch', 'delete']) {
      api[method].mockRejectedValue({ response: { status: 502 } });
    }
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const { default: Component } = await load();
    const { container } = renderView(Component);
    await waitFor(() => expect(container.firstChild).toBeTruthy());
    expect(renderErrors()).toEqual([]);
  });

  it('unmounts without throwing', async () => {
    const { default: Component } = await load();
    const { unmount } = renderView(Component);
    await waitFor(() => expect(true).toBe(true));
    expect(() => unmount()).not.toThrow();
  });
});
