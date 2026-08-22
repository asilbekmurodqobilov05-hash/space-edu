/**
 * Static content data must hold its shape.
 *
 * Findings (22 Aug 2026 audit):
 *  - three topics had no `titleRu`, so the Russian UI silently showed the Uzbek
 *    title — the translation fallback hides this rather than failing;
 *  - `newsData` carried three incompatible shapes across seven entries, so five
 *    of seven rendered English text in the Uzbek and Russian UI;
 *  - its category casing was inconsistent, so CATEGORY_COLORS missed four
 *    entries and the filter row showed one category as two separate chips;
 *  - every entry used `image` while NewsView reads `image_url`, so all seven
 *    showed the empty placeholder.
 */
import { describe, expect, it } from 'vitest';

import { newsData } from './mockData';
import { astronomyTopicsData } from './astronomyTopicsData';
import { creativityTopicsData } from './creativityTopicsData';
import { interviewsTopicsData } from './interviewsTopicsData';
import { physicsTopicsData } from './physicsTopicsData';
import { quizData } from './quizData';
import newsViewSource from '../views/community/NewsView.jsx?raw';

const TOPIC_SETS = {
  astronomyTopicsData,
  creativityTopicsData,
  interviewsTopicsData,
  physicsTopicsData,
};

describe('topic titles exist in every language', () => {
  for (const [name, topics] of Object.entries(TOPIC_SETS)) {
    it(`${name} has a Russian title for every entry`, () => {
      // These are objects keyed by id, not arrays.
      const list = Array.isArray(topics) ? topics : Object.values(topics ?? {});
      expect(list.length).toBeGreaterThan(0);
      const missing = list.filter((t) => !t.titleRu || !String(t.titleRu).trim());
      expect(
        missing.map((t) => t.title),
        'without titleRu the Russian UI falls back to the Uzbek title',
      ).toEqual([]);
    });

    it(`${name} has unique ids`, () => {
      const list = Array.isArray(topics) ? topics : Object.values(topics ?? {});
      const ids = list.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  }
});

describe('fallback news', () => {
  // Read straight from the view so the two cannot drift apart.
  const viewSource = newsViewSource;
  const colorBlock = viewSource.slice(
    viewSource.indexOf('const CATEGORY_COLORS'),
    viewSource.indexOf('};', viewSource.indexOf('const CATEGORY_COLORS')),
  );
  const knownCategories = [...colorBlock.matchAll(/^\s{2}(\w+):/gm)].map((m) => m[1]);

  it('the view really does define categories', () => {
    expect(knownCategories.length).toBeGreaterThan(3);
  });

  it('every entry has all three languages', () => {
    for (const article of newsData) {
      for (const field of ['title_en', 'title_uz', 'title_ru', 'summary_en', 'summary_uz', 'summary_ru']) {
        expect(article[field], `article ${article.id} is missing ${field}`).toBeTruthy();
      }
    }
  });

  it('no entry uses the old bare title/summary shape', () => {
    for (const article of newsData) {
      expect(article, `article ${article.id}`).not.toHaveProperty('title');
      expect(article, `article ${article.id}`).not.toHaveProperty('summary');
    }
  });

  it('uses image_url, the field the view reads', () => {
    for (const article of newsData) {
      expect(article.image_url, `article ${article.id}`).toBeTruthy();
      expect(article).not.toHaveProperty('image');
    }
  });

  it('every category matches one the view can colour', () => {
    for (const article of newsData) {
      expect(
        knownCategories,
        `article ${article.id} has category "${article.category}"`,
      ).toContain(article.category);
    }
  });

  it('category values are lowercase, so the filter shows one chip per category', () => {
    for (const article of newsData) {
      expect(article.category).toBe(article.category.toLowerCase());
    }
  });

  it('dates parse', () => {
    for (const article of newsData) {
      expect(Number.isNaN(new Date(article.date).getTime())).toBe(false);
    }
  });

  it('ids are unique', () => {
    const ids = newsData.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('quiz data', () => {
  it('every correct-answer index is inside its own options array', () => {
    for (const [category, questions] of Object.entries(quizData)) {
      for (const q of questions) {
        const options = q.options?.en ?? q.options;
        if (!Array.isArray(options)) continue;
        expect(
          q.correctAnswer,
          `${category}/${q.id}: index ${q.correctAnswer} is outside 0..${options.length - 1}`,
        ).toBeLessThan(options.length);
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('every question carries all three languages', () => {
    for (const [category, questions] of Object.entries(quizData)) {
      for (const q of questions) {
        for (const lang of ['en', 'uz', 'ru']) {
          expect(q.text?.[lang], `${category}/${q.id} text.${lang}`).toBeTruthy();
        }
      }
    }
  });
});
