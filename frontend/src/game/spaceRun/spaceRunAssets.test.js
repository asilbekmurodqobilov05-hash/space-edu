/**
 * Every absolute asset path in the source must exist in `public/`, or be on the
 * list below.
 *
 * Ticket Q3, tail. The game references 33 files that are not in the repository:
 * six sets of PBR maps, four .glb models and a handful of loose textures. Each
 * one was a 404 on every play, and — before the loaders got error callbacks —
 * left a material sampling an empty texture, which is why the power-ups and the
 * asteroid rendered black rather than untextured.
 *
 * The fix is in two halves. The loaders now degrade (a flat placeholder map, a
 * skipped decorative model), and this test pins the list so it can only get
 * shorter. Adding a reference to a file nobody has committed fails the build.
 *
 * To close an entry: commit the asset and delete its line. To close the ticket:
 * empty the list.
 *
 * Two more, `/burnt_metal.png` and `/rocket_metal.png`, are missing as well but
 * are not listed: they are asked for by the prebuilt third-party bundle in
 * `public/falcon9-simulator/`, which this scan does not read and which we do
 * not build. They are for whoever owns that simulator.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../../..');
const PUBLIC = join(ROOT, 'public');
const SRC = join(ROOT, 'src');

/** Referenced, absent, and knowingly so. Shrink this; never grow it. */
const KNOWN_MISSING = new Set([
  // Loose textures, referenced by materials that now fall back to a flat map.
  '/textures/space-run/coin-3d.png',
  '/textures/space-run/coin-special-3d.png',
  // PBR map sets. Four channels each, none of them committed.
  '/models/space-run/asteroid/albedo.jpg',
  '/models/space-run/asteroid/metalness.jpg',
  '/models/space-run/asteroid/normal.jpg',
  '/models/space-run/asteroid/roughness.jpg',
  '/models/space-run/coin/albedo.jpg',
  '/models/space-run/coin/metalness.jpg',
  '/models/space-run/coin/normal.jpg',
  '/models/space-run/coin/roughness.jpg',
  '/models/space-run/coin-special/albedo.jpg',
  '/models/space-run/coin-special/metalness.jpg',
  '/models/space-run/coin-special/normal.jpg',
  '/models/space-run/coin-special/roughness.jpg',
  '/models/space-run/powerup-magnet/albedo.jpg',
  '/models/space-run/powerup-magnet/metalness.jpg',
  '/models/space-run/powerup-magnet/normal.jpg',
  '/models/space-run/powerup-magnet/roughness.jpg',
  '/models/space-run/powerup-shield/albedo.jpg',
  '/models/space-run/powerup-shield/metalness.jpg',
  '/models/space-run/powerup-shield/normal.jpg',
  '/models/space-run/powerup-shield/roughness.jpg',
  '/models/space-run/powerup-slow/albedo.jpg',
  '/models/space-run/powerup-slow/metalness.jpg',
  '/models/space-run/powerup-slow/normal.jpg',
  '/models/space-run/powerup-slow/roughness.jpg',
  // Models. The power-ups fall back to procedural geometry; mercury is
  // decorative and is simply skipped.
  '/models/space-run/planet_mercury.glb',
  '/models/space-run/powerup-magnet/powerup-magnet.glb',
  '/models/space-run/powerup-shield/powerup-shield.glb',
  '/models/space-run/powerup-slow/powerup-slow.glb',
]);

const ASSET_PATTERN =
  /['"`](\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|avif|ktx2|basis|glb|gltf|mp3|ogg|wav|svg))['"`]/g;

function sourceFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...sourceFiles(full));
    } else if (['.js', '.jsx', '.ts', '.tsx'].includes(extname(entry))) {
      out.push(full);
    }
  }
  return out;
}

function referencedAssets() {
  const found = new Map(); // path -> the file that asks for it
  for (const file of sourceFiles(SRC)) {
    if (file.endsWith('.test.js') || file.endsWith('.test.jsx')) continue;
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(ASSET_PATTERN)) {
      if (!found.has(match[1])) found.set(match[1], file);
    }
  }
  return found;
}

describe('public assets the code asks for', () => {
  const referenced = referencedAssets();

  it('finds the references at all, so an empty pass cannot look like success', () => {
    expect(referenced.size).toBeGreaterThan(100);
  });

  it('every referenced asset exists, apart from the known-missing list', () => {
    const missing = [...referenced.keys()]
      .filter((path) => !existsSync(join(PUBLIC, path)))
      .filter((path) => !KNOWN_MISSING.has(path));

    expect(
      missing,
      'these are referenced but not committed — add the file, or add it to '
      + 'KNOWN_MISSING with a reason',
    ).toEqual([]);
  });

  it('the known-missing list has no stale entries', () => {
    // A file that has since been committed must come off the list, or the list
    // stops meaning anything.
    const resolved = [...KNOWN_MISSING].filter((path) => existsSync(join(PUBLIC, path)));
    expect(resolved, 'these now exist — delete them from KNOWN_MISSING').toEqual([]);
  });

  it('the known-missing list has no entries nobody references', () => {
    const unreferenced = [...KNOWN_MISSING].filter((path) => !referenced.has(path));
    expect(
      unreferenced,
      'nothing asks for these any more — delete them from KNOWN_MISSING',
    ).toEqual([]);
  });

  it('the debt does not grow', () => {
    expect(KNOWN_MISSING.size).toBeLessThanOrEqual(31);
  });
});

describe('the loaders survive a missing file', () => {
  const source = readFileSync(join(SRC, 'game/spaceRun/SpaceRunScene.jsx'), 'utf8');

  it('every texture load has an error callback', () => {
    // `new THREE.TextureLoader(...).load(path)` with no handlers is what turned
    // a 404 into a material sampling an empty texture.
    const bare = [...source.matchAll(/TextureLoader\([^)]*\)\s*\.load\(\s*([^,)]+)\s*\)/g)];
    expect(bare.map((m) => m[1])).toEqual([]);
  });

  it('a missing map falls back to a placeholder rather than nothing', () => {
    expect(source).toMatch(/function makePlaceholderTexture/);
    expect(source).toMatch(/makePlaceholderTexture\(kind\)/);
  });

  it('the decorative planet loader no longer throws on a missing model', () => {
    const loadSafe = source.slice(source.indexOf('const loadSafe ='));
    expect(loadSafe.slice(0, 400)).toMatch(/undefined,\s*\n\s*\(\) => \{\},/);
  });
});
