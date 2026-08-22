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
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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


/**
 * The learn screens, at the routes they are actually reached by.
 *
 * These carry a visual redesign merged from `main` on top of the move to the
 * API (ADR 0001), so both halves meet here for the first time. The shapes the
 * adapter emits differ per subject — a flat list for physics, `subLessons` for
 * astronomy and creativity, `sections` for interviews — and a screen that reads
 * the wrong one throws, or silently renders nothing.
 *
 * The API is answered with a real tree rather than an empty one on purpose. An
 * empty sphere makes the hook fall back to the static file, which means the
 * adapter is never exercised and the test passes no matter what the adapter
 * does. Each case asserts a name that can only have come through the adapter.
 */
const node = (slug, name, children = []) => ({
  id: slug, slug, order: 0, name, name_en: name, name_ru: '',
  video_url: '', content: '', xp_reward: 25, fuel_reward: 25,
  question_count: 0, children,
});

const tree = (slug, topicTitle, lessons) => ({
  slug, title: slug, title_en: slug, title_ru: slug, color: '#8b5cf6',
  topics: [{
    id: 1, slug: `${slug}-1`, order: 1,
    title: topicTitle, title_en: topicTitle, title_ru: topicTitle,
    color: '#8b5cf6', lessons,
  }],
});

/** One tree per subject, at the depth that subject really uses. */
const TREES = {
  physics: tree('physics', 'TOPIC-PHYSICS', [
    node('p-a', 'LESSON-FLAT-A'), node('p-b', 'LESSON-FLAT-B'),
  ]),
  astronomy: tree('astronomy', 'TOPIC-ASTRONOMY', [
    node('a-sun', 'LESSON-GROUP', [node('a-1', 'PART-ONE'), node('a-2', 'PART-TWO')]),
  ]),
  creativity: tree('creativity', 'TOPIC-CREATIVITY', [
    node('c-mod', 'LESSON-GROUP', [node('c-1', 'PART-ONE')]),
  ]),
  interviews: tree('interviews', 'TOPIC-INTERVIEWS', [
    node('i-sec', 'SECTION-NAME', [
      node('i-person', 'PERSON-NAME', [node('i-1', 'PART-ONE')]),
    ]),
  ]),
};

function answerWithTrees() {
  api.get.mockImplementation((url) => {
    const match = /\/courses\/spheres\/([a-z]+)\/tree\//.exec(String(url));
    if (match && TREES[match[1]]) return Promise.resolve({ data: TREES[match[1]] });
    return Promise.resolve({ data: [] });
  });
}

const LEARN_ROUTES = [
  {
    name: 'LearnView', path: '/learn', at: '/learn',
    load: () => import('./learn/LearnView'), expect: null,
  },
  {
    name: 'ProblemsView', path: '/learn/problems', at: '/learn/problems',
    load: () => import('./learn/ProblemsView'), expect: null,
  },
  {
    name: 'PhysicsView', path: '/learn/physics', at: '/learn/physics',
    load: () => import('./learn/PhysicsView'), expect: 'TOPIC-PHYSICS',
  },
  {
    name: 'AstronomyView', path: '/learn/astronomy', at: '/learn/astronomy',
    load: () => import('./learn/AstronomyView'), expect: 'TOPIC-ASTRONOMY',
  },
  {
    name: 'CreativityView', path: '/learn/creativity', at: '/learn/creativity',
    load: () => import('./learn/CreativityView'), expect: 'TOPIC-CREATIVITY',
  },
  {
    name: 'InterviewsView', path: '/learn/interviews', at: '/learn/interviews',
    load: () => import('./learn/InterviewsView'), expect: 'TOPIC-INTERVIEWS',
  },
  {
    name: 'PhysicsTopicView', path: '/learn/physics/:topicId', at: '/learn/physics/1',
    load: () => import('./learn/PhysicsTopicView'), expect: 'LESSON-FLAT-A',
  },
  {
    name: 'SubTopicView (astronomy, subLessons)', path: '/learn/:subject/:topicId/sub/:subIdx',
    at: '/learn/astronomy/1/sub/0', load: () => import('./learn/SubTopicView'),
    expect: 'PART-ONE',
  },
  {
    name: 'SubTopicView (interviews, sections)', path: '/learn/:subject/:topicId/sub/:subIdx',
    at: '/learn/interviews/1/sub/0', load: () => import('./learn/SubTopicView'),
    expect: 'PART-ONE',
  },
  {
    name: 'UniversalLessonView (physics, flat)', path: '/learn/:subject/:topicId/lesson/:lessonIdx',
    at: '/learn/physics/1/lesson/0', load: () => import('./learn/UniversalLessonView'),
    expect: 'LESSON-FLAT-A',
  },
  {
    name: 'UniversalLessonView (astronomy, one deep)',
    path: '/learn/:subject/:topicId/sub/:subIdx/lesson/:lessonIdx',
    at: '/learn/astronomy/1/sub/0/lesson/1', load: () => import('./learn/UniversalLessonView'),
    expect: 'PART-TWO',
  },
  {
    name: 'UniversalLessonView (interviews, two deep)',
    path: '/learn/:subject/:topicId/sub/:subIdx/lesson/:lessonIdx',
    at: '/learn/interviews/1/sub/0/lesson/0', load: () => import('./learn/UniversalLessonView'),
    expect: 'PART-ONE',
  },
];

function renderAt(Component, path, at) {
  return render(
    <MemoryRouter initialEntries={[at]}>
      <Routes>
        <Route path={path} element={<Component />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe.each(LEARN_ROUTES)('$name', ({ path, at, load, expect: expected }) => {
  it('renders what the API sent', async () => {
    answerWithTrees();
    const { default: Component } = await load();
    const { container } = renderAt(Component, path, at);

    if (expected) {
      // Proves the adapter output reached the DOM. Without this the hook's
      // static fallback would carry the test on its own.
      // findAll, not find: a card shows the same name as both title and
      // subtitle when a topic has no separate translation.
      const found = await screen.findAllByText(
        (_, element) => element?.textContent === expected, {}, { timeout: 3000 },
      );
      expect(found.length).toBeGreaterThan(0);
    } else {
      await waitFor(() => expect(container.firstChild).toBeTruthy());
    }
    expect(renderErrors()).toEqual([]);
  });

  it('renders the static fallback when the API is unreachable', async () => {
    // The hook hands back the static file first and swaps in the API answer
    // when it lands, so both shapes have to render.
    api.get.mockRejectedValue(new Error('offline'));

    const { default: Component } = await load();
    const { container } = renderAt(Component, path, at);
    await waitFor(() => expect(container.firstChild).toBeTruthy());
    expect(renderErrors()).toEqual([]);
  });
});
