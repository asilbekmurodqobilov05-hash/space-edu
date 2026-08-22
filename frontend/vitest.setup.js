import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

// jsdom has no matchMedia, and several components query it on mount.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

// Nothing under test needs a real IntersectionObserver, but several views
// construct one on mount and jsdom does not provide it.
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom has no 2D canvas, and several components build a texture from one on
// mount (LiveSpaceView's satellite dot, the game's coin sprite fallback).
// Installing the `canvas` package to draw pixels nothing looks at is not worth
// it; a stub that records nothing is enough for the components to keep going.
if (!HTMLCanvasElement.prototype.getContext.__stubbed) {
  const noop = () => {};
  const stub = function getContext(kind) {
    if (kind !== '2d') return null;
    return {
      canvas: this,
      fillStyle: '#000', strokeStyle: '#000', lineWidth: 1, globalAlpha: 1,
      font: '10px sans-serif', textAlign: 'start', textBaseline: 'alphabetic',
      arc: noop, beginPath: noop, clearRect: noop, closePath: noop, drawImage: noop,
      fill: noop, fillRect: noop, fillText: noop, lineTo: noop, moveTo: noop,
      restore: noop, rotate: noop, save: noop, scale: noop, stroke: noop,
      strokeRect: noop, translate: noop, setTransform: noop, clip: noop,
      createLinearGradient: () => ({ addColorStop: noop }),
      createRadialGradient: () => ({ addColorStop: noop }),
      createPattern: () => null,
      getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }),
      putImageData: noop,
      measureText: (text) => ({ width: String(text).length * 6 }),
    };
  };
  stub.__stubbed = true;
  HTMLCanvasElement.prototype.getContext = stub;
}
