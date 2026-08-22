/**
 * The adapter is the whole of ADR 0001 step 4 on this side: it has to hand the
 * screens the same shape the static files did, or eleven views break at once.
 *
 * The three shapes it has to reproduce, from the three the static files use:
 *   physics    lessons: ["name", ...]                       (no sub-lessons)
 *   astronomy  lessons: [{ name, subLessons: [...] }]
 *   interviews sections: [{ name, lessons: [{ subLessons }] }]
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { adaptTopic, adaptTree, findBySlug, slugAtPath } from './learnContent';

vi.mock('@/lib/api', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

const node = (slug, name, children = []) => ({
  slug, name, name_en: name, name_ru: '', order: 0, video_url: '', children,
});

const topic = (over = {}) => ({
  id: 1, slug: 'physics-kinematics', order: 3,
  title: 'Kinematika', title_en: 'Kinematics', title_ru: 'Кинематика',
  color: '#00e5ff', lessons: [], ...over,
});

describe('adaptTopic', () => {
  it('keeps a flat subject flat', () => {
    const adapted = adaptTopic(topic({ lessons: [node('a', 'One'), node('b', 'Two')] }));
    expect(adapted.sections).toBeUndefined();
    expect(adapted.lessons.map((l) => l.name)).toEqual(['One', 'Two']);
    expect(adapted.lessons[0].subLessons).toBeUndefined();
  });

  it('nests one level as subLessons', () => {
    const adapted = adaptTopic(topic({
      lessons: [node('sun', 'Sun', [node('sun-1', 'Structure'), node('sun-2', 'Fusion')])],
    }));
    expect(adapted.sections).toBeUndefined();
    expect(adapted.lessons[0].subLessons.map((l) => l.name)).toEqual(['Structure', 'Fusion']);
  });

  it('turns three levels into sections, which is the interviews shape', () => {
    const adapted = adaptTopic(topic({
      lessons: [
        node('astro', 'Astronomy', [
          node('tyson', 'Neil deGrasse Tyson', [node('tyson-early', 'Early Career')]),
        ]),
      ],
    }));
    expect(adapted.lessons).toBeUndefined();
    expect(adapted.sections[0].name).toBe('Astronomy');
    expect(adapted.sections[0].lessons[0].subLessons[0].name).toBe('Early Career');
  });

  it('reads the depth off the content, not off the subject', () => {
    // A physics topic that gains sub-lessons in the admin panel must start
    // rendering them without a code change.
    const adapted = adaptTopic(topic({ lessons: [node('a', 'One', [node('a1', 'Part')])] }));
    expect(adapted.lessons[0].subLessons).toHaveLength(1);
  });

  it('maps the numeric id the routes use off `order`, not off the row id', () => {
    expect(adaptTopic(topic({ id: 412, order: 3 })).id).toBe(3);
  });

  it('falls back to the Uzbek title when a translation is empty', () => {
    const adapted = adaptTopic(topic({ title_en: '', title_ru: '' }));
    expect(adapted.titleEn).toBe('Kinematika');
    expect(adapted.titleRu).toBe('Kinematika');
  });

  it('carries the video url through under the name the views read', () => {
    const lesson = node('a', 'One');
    lesson.video_url = 'https://example.invalid/embed/x';
    expect(adaptTopic(topic({ lessons: [lesson] })).lessons[0].videoUrl)
      .toBe('https://example.invalid/embed/x');
  });
});

describe('adaptTree', () => {
  it('keys by the route id so Object.values yields each topic once', () => {
    const tree = { topics: [topic({ order: 1 }), topic({ slug: 'b', order: 2 })] };
    const adapted = adaptTree(tree);
    expect(Object.keys(adapted)).toEqual(['1', '2']);
    expect(Object.values(adapted)).toHaveLength(2);
  });

  it('survives a sphere with no topics', () => {
    expect(adaptTree({})).toEqual({});
  });

  it('can still find a topic by slug', () => {
    const adapted = adaptTree({ topics: [topic({ slug: 'physics-optics', order: 13 })] });
    expect(findBySlug(adapted, 'physics-optics').id).toBe(13);
    expect(findBySlug(adapted, 'nope')).toBeNull();
  });
});

describe('slugAtPath', () => {
  const flat = adaptTopic(topic({ lessons: [node('a', 'One'), node('b', 'Two')] }));
  const nested = adaptTopic(topic({
    lessons: [node('sun', 'Sun', [node('sun-1', 'Structure'), node('sun-2', 'Fusion')])],
  }));
  const sectioned = adaptTopic(topic({
    lessons: [node('astro', 'Astronomy', [
      node('tyson', 'Tyson', [node('tyson-early', 'Early'), node('tyson-late', 'Late')]),
    ])],
  }));

  it('resolves a flat lesson by its index', () => {
    expect(slugAtPath(flat, { lessonIdx: '1' })).toBe('b');
  });

  it('resolves a sub-lesson under its parent', () => {
    expect(slugAtPath(nested, { subIdx: '0', lessonIdx: '1' })).toBe('sun-2');
  });

  it('resolves through a section, which is flattened the way the routes are', () => {
    expect(slugAtPath(sectioned, { subIdx: '0', lessonIdx: '1' })).toBe('tyson-late');
  });

  it('prefers partIdx when the route carries one', () => {
    expect(slugAtPath(nested, { lessonIdx: '0', partIdx: '1' })).toBe('sun-2');
  });

  it('returns null rather than throwing on an index past the end', () => {
    expect(slugAtPath(flat, { lessonIdx: '99' })).toBeNull();
    expect(slugAtPath(nested, { subIdx: '0', lessonIdx: '99' })).toBeNull();
  });

  it('returns null for a missing topic, so the caller can skip the award', () => {
    expect(slugAtPath(null, { lessonIdx: '0' })).toBeNull();
  });

  it('returns null for the static fallback, which carries no slugs', () => {
    // The shape the static files give: names only.
    const staticTopic = { lessons: [{ name: 'One' }, { name: 'Two' }] };
    expect(slugAtPath(staticTopic, { lessonIdx: '0' })).toBeNull();
  });
});

describe('useLearnTopics', () => {
  let api;

  beforeEach(async () => {
    vi.resetModules();
    api = (await import('@/lib/api')).default;
    api.get.mockReset();
  });

  it('renders from the static file before the request lands', async () => {
    const { renderHook } = await import('@testing-library/react');
    const { useLearnTopics } = await import('@/hooks/useLearnTopics');
    api.get.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useLearnTopics('physics'));
    expect(result.current.source).toBe('static');
    expect(Object.keys(result.current.topics).length).toBe(14);
  });

  it('keeps the static copy when the API is down', async () => {
    const { renderHook, waitFor } = await import('@testing-library/react');
    const { useLearnTopics } = await import('@/hooks/useLearnTopics');
    api.get.mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useLearnTopics('astronomy'));
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    expect(result.current.source).toBe('static');
    expect(Object.keys(result.current.topics).length).toBe(4);
  });

  it('keeps the static copy when the sphere is empty', async () => {
    const { renderHook, waitFor } = await import('@testing-library/react');
    const { useLearnTopics } = await import('@/hooks/useLearnTopics');
    api.get.mockResolvedValue({ data: { topics: [] } });

    const { result } = renderHook(() => useLearnTopics('physics'));
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    expect(result.current.source).toBe('static');
  });

  it('switches to the API answer when there is one', async () => {
    const { renderHook, waitFor } = await import('@testing-library/react');
    const { useLearnTopics } = await import('@/hooks/useLearnTopics');
    api.get.mockResolvedValue({
      data: { topics: [topic({ order: 1, title: 'Edited in the panel' })] },
    });

    const { result } = renderHook(() => useLearnTopics('physics'));
    await waitFor(() => expect(result.current.source).toBe('api'));
    expect(result.current.topics[1].title).toBe('Edited in the panel');
  });
});
