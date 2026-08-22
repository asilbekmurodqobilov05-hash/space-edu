/**
 * Fail the build if the three locale files drift apart.
 *
 * We are at 1007 keys with perfect parity across en/ru/uz — unusual, and worth
 * protecting. A key missing from one file does not crash anything: the
 * translation helper falls back to English, so a Russian or Uzbek reader
 * silently gets English text and nobody notices for months.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const LOCALES = ['en', 'ru', 'uz'];

function flatten(value, prefix = '', out = new Set()) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
  } else {
    out.add(prefix);
  }
  return out;
}

const keys = Object.fromEntries(
  LOCALES.map((lang) => [
    lang,
    flatten(JSON.parse(readFileSync(join(here, '..', 'src', 'locales', `${lang}.json`), 'utf8'))),
  ]),
);

const reference = keys.en;
let failed = false;

for (const lang of LOCALES) {
  const missing = [...reference].filter((k) => !keys[lang].has(k));
  const extra = [...keys[lang]].filter((k) => !reference.has(k));

  if (missing.length) {
    failed = true;
    console.error(`${lang}.json is missing ${missing.length} key(s) present in en.json:`);
    for (const k of missing.slice(0, 20)) console.error(`  - ${k}`);
    if (missing.length > 20) console.error(`  ... and ${missing.length - 20} more`);
  }
  if (extra.length) {
    failed = true;
    console.error(`${lang}.json has ${extra.length} key(s) absent from en.json:`);
    for (const k of extra.slice(0, 20)) console.error(`  + ${k}`);
  }
}

if (failed) {
  console.error('\nEvery new key must land in all three locales in the same commit.');
  process.exit(1);
}

console.log(`Locale parity OK — ${reference.size} keys in ${LOCALES.join(', ')}.`);
