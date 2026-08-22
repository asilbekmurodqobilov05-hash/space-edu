/**
 * GPU resource discipline in the Space Run scene.
 *
 * Finding (ticket F3): the 2097-line scene builds 26 three.js resources —
 * geometries, materials and canvas textures — inside `useMemo`. Most were
 * disposed on unmount; two were not, so every visit to the game leaked a
 * compiled shader program and an uploaded canvas texture for the lifetime of
 * the tab. Separately, the module-level TEXTURE_CACHE was never emptied.
 *
 * This is a source-shape test rather than a render test. Rendering the scene
 * needs WebGL, which jsdom does not have, and the failure mode we care about is
 * structural: a resource created and never released. Checking the shape catches
 * the next one too, which a test of these two specific cases would not.
 */
import { describe, expect, it } from 'vitest';

import sceneSource from './SpaceRunScene.jsx?raw';
import viewSource from '@/views/game/SpaceRunView.jsx?raw';

/** Matches `x.dispose()`, `x?.dispose()`, `x?.dispose?.()`. */
const DISPOSE = /(\w+)\s*\??\.\s*dispose\s*(?:\?\.)?\s*\(/g;

/** A useMemo body that builds something living on the GPU. */
const GPU_RESOURCE = /Geometry|Material|Texture|createCraterCanvas|createEngineParticle/;

function memoisedResources(source) {
  const found = [];
  const re = /const\s+(\w+)\s*=\s*useMemo\(\s*\(\)\s*=>\s*([\s\S]{0,160})/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const [, name, body] = m;
    if (!GPU_RESOURCE.test(body)) continue;
    found.push({
      name,
      line: source.slice(0, m.index).split('\n').length,
      fromSharedCache: /loadTextureCached/.test(body),
    });
  }
  return found;
}

describe('every GPU resource is released', () => {
  const resources = memoisedResources(sceneSource);
  const disposed = new Set([...sceneSource.matchAll(DISPOSE)].map((m) => m[1]));

  it('the scene really does build GPU resources in useMemo', () => {
    expect(resources.length).toBeGreaterThan(20);
  });

  it('nothing built per-component is left undisposed', () => {
    const owned = resources.filter((r) => !r.fromSharedCache);
    const leaked = owned.filter((r) => !disposed.has(r.name));
    expect(
      leaked.map((r) => `${r.name} (line ${r.line})`),
      'created in useMemo but never disposed — this survives every unmount',
    ).toEqual([]);
  });

  it('the shared texture cache can be emptied', () => {
    // These are deliberately not disposed per component: several meshes share
    // one map and it must not be uploaded twice. But something has to free them
    // when the game closes.
    expect(sceneSource).toMatch(/export function releaseTextureCache/);
    expect(sceneSource).toMatch(/TEXTURE_CACHE\.clear\(\)/);
  });
});

describe('the game gives its resources back on unmount', () => {
  it('the view releases the texture cache', () => {
    expect(viewSource).toMatch(/releaseTextureCache\(\)/);
  });

  it('the view closes the audio context', () => {
    // Browsers cap concurrent AudioContexts at around six; opening and closing
    // the game a handful of times used to leave audio dead for the whole tab.
    expect(viewSource).toMatch(/closeAudio\(\)/);
  });

  it('both happen in a cleanup function, not on mount', () => {
    const cleanup = viewSource.match(/return \(\) => \{[\s\S]{0,300}?\};/g) ?? [];
    const releases = cleanup.filter(
      (block) => /releaseTextureCache\(\)/.test(block) && /closeAudio\(\)/.test(block),
    );
    expect(releases.length).toBeGreaterThan(0);
  });
});

describe('no per-frame React state updates', () => {
  it('useFrame callbacks do not call a React setter', () => {
    // Calling a setState inside useFrame re-renders 60 times a second. The
    // scene currently avoids this; keep it that way.
    const offenders = [];
    const re = /useFrame\(\s*\(([^)]*)\)\s*=>\s*\{/g;
    let m;
    while ((m = re.exec(sceneSource)) !== null) {
      // Walk braces to the end of the callback. A fixed-size window overruns
      // into the next function and reports its calls as this one's.
      let depth = 0;
      let i = sceneSource.indexOf('{', m.index);
      const start = i;
      for (; i < sceneSource.length; i += 1) {
        if (sceneSource[i] === '{') depth += 1;
        else if (sceneSource[i] === '}') {
          depth -= 1;
          if (depth === 0) break;
        }
      }
      const body = sceneSource.slice(start, i + 1);

      // React setters look like `setThing(`. three.js has plenty of its own:
      // setScalar, setXYZ, setFromMatrixPosition, gl.setPixelRatio and so on.
      const THREE_METHODS = /^(Scalar|XYZ|XY|XYZW|X|Y|Z|W|RGB|Hex|HSL|Style|FromMatrixPosition|FromSpherical|FromEuler|FromAxisAngle|Attribute|Index|DrawRange|PixelRatio|Size|ClearColor|RenderTarget|Matrix|RotationFromEuler|Length|Component)$/;
      const hits = [...body.matchAll(/set([A-Z]\w*)\(/g)]
        .map((h) => h[1])
        .filter((n) => !THREE_METHODS.test(n));
      if (hits.length) {
        const line = sceneSource.slice(0, m.index).split(String.fromCharCode(10)).length;
        offenders.push(`line ${line}: set${hits[0]}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('file size', () => {
  it('is flagged until the scene is split', () => {
    // House rule: 800 lines is the hard ceiling. This file is far past it and
    // splitting it is part of ticket F3; this documents the debt rather than
    // pretending it is fine.
    const lines = sceneSource.split('\n').length;
    expect(lines).toBeGreaterThan(800);
    expect(
      lines,
      'the scene grew past 2400 lines — split it before adding more',
    ).toBeLessThan(2400);
  });
});
