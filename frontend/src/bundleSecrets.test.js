/**
 * Nothing a student should not know may ship in the JavaScript.
 *
 * Second-pass finding, 22 Aug 2026. The first audit closed three answer-key
 * leaks on the server — `QuizQuestion.correct_answer`, the same field nested in
 * the lesson endpoint, and `Problem.answer` for the whole Masalalar set — and
 * the client kept its own copies the whole time:
 *
 *   quizData.js      24 questions with `correctAnswer`
 *   problemsData.js  145 problems with `answer` and `explanation`
 *
 * Grading happened in the browser against those, so every answer was one View
 * Source away and nothing on the server could stop it. Both files are gone;
 * this makes sure they, or anything like them, cannot come back unnoticed.
 *
 * It reads `dist/`, so it only means something after a build. CI builds before
 * it tests. Locally, run `npm run build` first — the test says so rather than
 * passing vacuously.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const DIST = resolve(__dirname, '../dist/assets');

/**
 * Answer keys, counted rather than forbidden outright.
 *
 * The admin panel legitimately ships `correct_answer: 0` — it is the default
 * for the "new question" form and the name of a field a staff member fills in.
 * A real answer key is not one occurrence, it is one per question: the deleted
 * `quizData.js` had 24. Counting separates a form default from a bundled data
 * file without pretending the field name itself is a secret.
 */
const ANSWER_KEY_PATTERNS = [
  { name: 'camelCase', pattern: /correctAnswer\s*[:=]\s*\d/g },
  { name: 'snake_case', pattern: /correct_answer\s*[:=]\s*\d/g },
];
const FORM_DEFAULT_ALLOWANCE = 2;

/** Credentials. One occurrence is one too many. */
const FORBIDDEN = [
  { name: 'a Google API key', pattern: /AIza[0-9A-Za-z_-]{30,}/ },
  { name: 'an OpenAI-style key', pattern: /\bsk-[a-zA-Z0-9]{30,}/ },
  { name: 'a private key block', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'an AWS access key id', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
];

/** Answers from the seeded problem set, as a spot check on the general rule. */
const KNOWN_ANSWERS = [
  'Mexanikaning asosiy vazifasini',   // problem 1's question text
  "Masala #31",                        // the placeholder filler
];

function bundleFiles() {
  if (!existsSync(DIST)) return null;
  return readdirSync(DIST)
    .filter((name) => name.endsWith('.js'))
    .map((name) => ({ name, text: readFileSync(join(DIST, name), 'utf8') }));
}

describe('the built bundle', () => {
  const files = bundleFiles();

  it('exists — run `npm run build` before this test means anything', () => {
    expect(
      files,
      'dist/assets is missing; this suite cannot vouch for a bundle that was not built',
    ).not.toBeNull();
    expect(files.length).toBeGreaterThan(5);
  });

  it.each(FORBIDDEN)('does not contain $name', ({ pattern }) => {
    if (!files) return;
    const guilty = files.filter((file) => pattern.test(file.text)).map((file) => file.name);
    expect(guilty).toEqual([]);
  });

  it.each(ANSWER_KEY_PATTERNS)('carries no $name answer key', ({ pattern }) => {
    if (!files) return;
    const guilty = files
      .map((file) => ({
        name: file.name,
        hits: (file.text.match(pattern) ?? []).length,
      }))
      .filter((file) => file.hits > FORM_DEFAULT_ALLOWANCE);
    expect(
      guilty,
      'more answers than a form default can explain — a data file is being bundled',
    ).toEqual([]);
  });

  it('does not contain the problem set that used to be bundled with it', () => {
    if (!files) return;
    for (const needle of KNOWN_ANSWERS) {
      const guilty = files.filter((file) => file.text.includes(needle)).map((file) => file.name);
      expect(guilty, `"${needle}" is in the bundle`).toEqual([]);
    }
  });

  it('ships no chunk named after the deleted answer files', () => {
    if (!files) return;
    const guilty = files
      .map((file) => file.name)
      .filter((name) => /quizData|problemsData/i.test(name));
    expect(guilty).toEqual([]);
  });
});
