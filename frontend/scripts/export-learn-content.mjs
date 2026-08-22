/**
 * Turn `src/data/*TopicsData.js` into the fixture the backend seeds from.
 *
 * The content used to exist in three places — the static files the site reads,
 * a hand-written copy inside `seed_learn_data`, and an inline list in
 * PhysicsView. This script makes the static files the single source and the
 * fixture a build artefact, so the two cannot drift. CI regenerates it and
 * fails if the committed copy differs.
 *
 *   node scripts/export-learn-content.mjs           # write the fixture
 *   node scripts/export-learn-content.mjs --check   # fail if it is stale
 *
 * Once a subject is edited in the admin panel rather than in the repo, drop it
 * from SUBJECTS here and delete its data file — see ADR 0001, step 4.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { astronomyTopicsData } from '../src/data/astronomyTopicsData.js';
import { problemsData } from './content/problems.js';
import { creativityTopicsData } from '../src/data/creativityTopicsData.js';
import { interviewsTopicsData } from '../src/data/interviewsTopicsData.js';
import { physicsTopicsData } from '../src/data/physicsTopicsData.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../backend/apps/courses/fixtures/learn_content.json');

/** Sphere cards, from the list LearnView renders. */
const SUBJECTS = [
  {
    slug: 'physics', order: 1, data: physicsTopicsData,
    title: 'Fizika', title_en: 'Physics', title_ru: 'Физика',
    description: 'Kosmik mexanika, gravitatsiya va energiya asoslari',
    description_en: 'Cosmic mechanics, gravity and energy fundamentals',
    color: '#00e5ff', icon: 'Atom', link: '/learn/physics',
  },
  {
    slug: 'astronomy', order: 2, data: astronomyTopicsData,
    title: 'Astronomiya', title_en: 'Astronomy', title_ru: 'Астрономия',
    description: 'Yulduzlar, galaktikalar va koinot tuzilishi',
    description_en: 'Stars, galaxies and the structure of the universe',
    color: '#fbbf24', icon: 'Telescope', link: '/learn/astronomy',
  },
  {
    slug: 'creativity', order: 4, data: creativityTopicsData,
    title: 'Ijodkorlik', title_en: 'Creativity', title_ru: 'Творчество',
    description: "Kosmik san'at, yozish va dizayn loyihalari",
    description_en: 'Space art, writing and design projects',
    color: '#f472b6', icon: 'Palette', link: '/learn/creativity',
  },
  {
    slug: 'interviews', order: 5, data: interviewsTopicsData,
    title: 'Intervyular', title_en: 'Interviews', title_ru: 'Интервью',
    description: 'Olimlar, astronavtlar va muhandislar bilan suhbatlar',
    description_en: 'Conversations with scientists, astronauts and engineers',
    color: '#a78bfa', icon: 'Mic', link: '/learn/interviews',
  },
];

/**
 * Slugs are derived from names, not from (parent, order): re-ordering a topic
 * must not orphan every progress row under it. Duplicate names inside one
 * subject get a numeric suffix in walk order, which is stable for a given file.
 */
function slugify(text) {
  return String(text)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'item';
}

function makeSlugger() {
  const seen = new Map();
  return (...parts) => {
    const base = parts.filter(Boolean).map(slugify).join('-').slice(0, 180);
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };
}

/** The static files use three shapes; normalise them into one tree. */
function readLessonTree(topic, slugFor, prefix) {
  const walk = (items, parentPrefix) =>
    items.map((item, index) => {
      const name = typeof item === 'string' ? item : item.name;
      const slug = slugFor(parentPrefix, name);
      const children = typeof item === 'string'
        ? []
        : walk(item.subLessons ?? item.lessons ?? [], parentPrefix);
      return {
        slug,
        order: index,
        name,
        name_en: name,
        name_ru: '',
        video_url: typeof item === 'string' ? '' : (item.videoUrl ?? ''),
        children,
      };
    });

  // interviews nests topic -> section -> lesson -> sub-lesson; the other three
  // are topic -> lesson -> sub-lesson or a bare list of lesson names.
  const roots = topic.sections
    ? topic.sections.map((section, index) => ({
        slug: slugFor(prefix, section.name),
        order: index,
        name: section.name,
        name_en: section.name,
        name_ru: '',
        video_url: '',
        children: walk(section.lessons ?? [], prefix),
      }))
    : walk(topic.lessons ?? [], prefix);

  return roots;
}

/**
 * The Masalalar set, minus the filler.
 *
 * `problemsData` holds 145 entries, but 115 of them are generated placeholders
 * — "Masala #47: Bu yerda fizika masalasi matni bo'ladi" with an answer picked
 * off a cycling list. Seeding those would put nonsense in front of a student
 * and make the site's "145 problems" claim true in the worst possible way.
 * Only the 30 written ones go in; the rest is content work, not a migration.
 */
const PLACEHOLDER = /^Masala #\d+:/;

function readProblems() {
  return Object.entries(problemsData)
    .filter(([, problem]) => !PLACEHOLDER.test(problem.question))
    .map(([number, problem]) => ({
      number: Number(number),
      question: problem.question,
      question_en: '',
      question_ru: '',
      answer: problem.answer,
      explanation: problem.explanation ?? '',
      explanation_en: '',
      difficulty: 'medium',
    }));
}

function build() {
  return {
    _comment: 'Generated by frontend/scripts/export-learn-content.mjs. Do not edit by hand.',
    problems: {
      sphere: {
        slug: 'problems', order: 3,
        title: 'Masalalar', title_en: 'Problems', title_ru: 'Задачи',
        description: 'Amaliy masalalar va olimpiada savollari',
        description_en: 'Applied problems and olympiad questions',
        color: '#4ade80', icon: 'HelpCircle', link: '/learn/problems',
      },
      items: readProblems(),
    },
    spheres: SUBJECTS.map(({ data, ...sphere }) => {
      const slugFor = makeSlugger();
      return {
        ...sphere,
        topics: Object.values(data).map((topic) => {
          const topicSlug = slugFor(sphere.slug, topic.titleEn || topic.title);
          return {
            slug: topicSlug,
            // The numeric key the pre-API routes used, and the display order.
            order: topic.id,
            title: topic.title,
            title_en: topic.titleEn ?? '',
            title_ru: topic.titleRu ?? '',
            color: topic.color ?? sphere.color,
            lessons: readLessonTree(topic, slugFor, topicSlug),
          };
        }),
      };
    }),
  };
}

const serialised = `${JSON.stringify(build(), null, 2)}\n`;

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(OUT, 'utf8');
  } catch {
    /* missing counts as stale */
  }
  if (current !== serialised) {
    console.error(
      'learn_content.json is stale. Run:\n' +
      '  node scripts/export-learn-content.mjs\n' +
      'and commit the result.',
    );
    process.exit(1);
  }
  console.log('learn_content.json is up to date.');
} else {
  writeFileSync(OUT, serialised);
  const { spheres, problems } = build();
  const count = (nodes) => nodes.reduce((n, x) => n + 1 + count(x.children), 0);
  for (const s of spheres) {
    const lessons = s.topics.reduce((n, t) => n + count(t.lessons), 0);
    console.log(`  ${s.slug}: ${s.topics.length} topics, ${lessons} lesson nodes`);
  }
  const dropped = Object.keys(problemsData).length - problems.items.length;
  console.log(`  problems: ${problems.items.length} real (${dropped} placeholders dropped)`);
  console.log(`Wrote ${OUT}`);
}
