/**
 * One source for the /learn tree.
 *
 * ADR 0001, step 4. The content used to live only in `src/data/*TopicsData.js`,
 * so editing a lesson meant a deploy and the admin panel's three content tabs
 * changed nothing anyone could see. The screens now read the API and fall back
 * to the static file when it is unreachable, which keeps the site up on a
 * backend outage and lets subjects move over one at a time.
 *
 * The API tree is reshaped into the exact shape the screens already consume, so
 * migrating a screen is a changed import rather than a rewrite:
 *
 *   depth 1  ->  { lessons: [{ name, slug }] }                      physics
 *   depth 2  ->  { lessons: [{ name, slug, subLessons: [...] }] }   astronomy, creativity
 *   depth 3  ->  { sections: [{ name, lessons: [...] }] }           interviews
 *
 * Depth is read off the content rather than configured per subject, so a topic
 * that gains sub-lessons in the admin panel starts rendering them.
 */
import api from '@/lib/api';

import { astronomyTopicsData } from '@/data/astronomyTopicsData';
import { creativityTopicsData } from '@/data/creativityTopicsData';
import { interviewsTopicsData } from '@/data/interviewsTopicsData';
import { physicsTopicsData } from '@/data/physicsTopicsData';

/** Used until a subject's content is authored in the panel rather than the repo. */
export const STATIC_TOPICS = {
  astronomy: astronomyTopicsData,
  creativity: creativityTopicsData,
  interviews: interviewsTopicsData,
  physics: physicsTopicsData,
};

export const SUBJECTS = Object.keys(STATIC_TOPICS);

const depthOf = (nodes) =>
  nodes?.length ? 1 + Math.max(...nodes.map((n) => depthOf(n.children))) : 0;

const toSubLesson = (node) => ({
  name: node.name,
  slug: node.slug,
  videoUrl: node.video_url || '',
});

const toLesson = (node) => {
  const lesson = toSubLesson(node);
  if (node.children?.length) lesson.subLessons = node.children.map(toSubLesson);
  return lesson;
};

/** One API topic -> the legacy object the screens read. */
export function adaptTopic(topic) {
  const base = {
    id: topic.order,
    slug: topic.slug,
    title: topic.title,
    titleEn: topic.title_en || topic.title,
    titleRu: topic.title_ru || topic.title,
    color: topic.color,
  };

  const roots = topic.lessons ?? [];
  if (depthOf(roots) >= 3) {
    return {
      ...base,
      sections: roots.map((section) => ({
        name: section.name,
        slug: section.slug,
        lessons: (section.children ?? []).map(toLesson),
      })),
    };
  }
  return { ...base, lessons: roots.map(toLesson) };
}

/**
 * Keyed by the numeric id the routes use, so `/learn/astronomy/2` keeps working
 * and `Object.values()` still yields each topic exactly once — both are what the
 * screens already do with the static files.
 */
export function adaptTree(tree) {
  const out = {};
  for (const topic of tree.topics ?? []) {
    const adapted = adaptTopic(topic);
    out[adapted.id] = adapted;
  }
  return out;
}

/** For links that want a slug rather than a position. */
export function findBySlug(topics, slug) {
  return Object.values(topics ?? {}).find((topic) => topic.slug === slug) ?? null;
}

export async function fetchSubjectTopics(subject) {
  const { data } = await api.get(`/courses/spheres/${subject}/tree/`);
  const adapted = adaptTree(data);
  // An empty sphere is not content, it is a sphere nobody has filled in yet.
  // Falling back beats rendering a blank subject page.
  if (!Object.keys(adapted).length) return null;
  return adapted;
}

/**
 * Walk a topic to the node at a route path, and return its slug.
 *
 * Completing a lesson has to name a row the server knows. The routes address
 * content by position (`/learn/:subject/:topicId/sub/:subIdx/lesson/:lessonIdx`),
 * which is what the static files offered; this is the bridge between the two
 * until the routes themselves are slug-based.
 */
export function slugAtPath(topic, { subIdx, lessonIdx, partIdx } = {}) {
  if (!topic) return null;
  const asIndex = (value) => (value === undefined || value === null ? null : parseInt(value, 10));

  const items = topic.sections
    ? topic.sections.flatMap((section) => section.lessons)
    : (topic.lessons ?? []);

  const parentIdx = asIndex(subIdx) ?? asIndex(lessonIdx);
  const parent = parentIdx === null ? null : items[parentIdx];
  if (!parent) return null;

  if (!parent.subLessons) return parent.slug ?? null;

  const childIdx = asIndex(partIdx) ?? (subIdx !== undefined ? asIndex(lessonIdx) : 0) ?? 0;
  return parent.subLessons[childIdx]?.slug ?? null;
}
