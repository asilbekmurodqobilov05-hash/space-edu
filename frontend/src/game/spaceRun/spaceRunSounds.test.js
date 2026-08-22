/**
 * Regression tests for the Web Audio lifecycle.
 *
 * Findings:
 *  - startSpaceMusic() pushed a `{stop}` closure into `musicOscs` on every tick
 *    of a 420 ms interval. Each oscillator already stops itself at t+0.5, so
 *    the entries were pointless — but the array only cleared on
 *    stopSpaceMusic(), so a ten-minute session accumulated ~1400 of them.
 *  - the `master` gain node was never disconnected.
 *  - the module-level AudioContext was never closed. Browsers cap concurrent
 *    contexts at around six, so repeatedly entering and leaving the game
 *    eventually leaves audio silently dead.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

class FakeParam {
  constructor() { this.value = 0; }
  setValueAtTime() { return this; }
  exponentialRampToValueAtTime() { return this; }
  linearRampToValueAtTime() { return this; }
}

class FakeNode {
  constructor(ctx, kind) {
    this.ctx = ctx;
    this.kind = kind;
    this.gain = new FakeParam();
    this.frequency = new FakeParam();
    this.Q = new FakeParam();
    this.type = '';
    this.connected = [];
    this.disconnected = false;
    this.started = false;
    this.stopped = false;
  }
  connect(target) { this.connected.push(target); return target; }
  disconnect() { this.disconnected = true; }
  start() { this.started = true; }
  stop() { this.stopped = true; }
}

class FakeAudioContext {
  constructor() {
    this.state = 'running';
    this.currentTime = 0;
    this.destination = new FakeNode(this, 'destination');
    this.nodes = [];
    this.closed = false;
    FakeAudioContext.instances.push(this);
  }
  _make(kind) { const n = new FakeNode(this, kind); this.nodes.push(n); return n; }
  createGain() { return this._make('gain'); }
  createOscillator() { return this._make('oscillator'); }
  createBiquadFilter() { return this._make('filter'); }
  createBufferSource() { return this._make('buffer'); }
  createBuffer() { return { getChannelData: () => new Float32Array(64) }; }
  async resume() { this.state = 'running'; }
  async close() { this.closed = true; this.state = 'closed'; }
}
FakeAudioContext.instances = [];

let sounds;

beforeEach(async () => {
  vi.useFakeTimers();
  FakeAudioContext.instances = [];
  window.AudioContext = FakeAudioContext;
  vi.resetModules();
  sounds = await import('./spaceRunSounds');
});

afterEach(() => {
  sounds.stopSpaceMusic?.();
  sounds.stopEngineHum?.();
  vi.useRealTimers();
});

describe('space music', () => {
  it('does not accumulate one entry per tick', () => {
    sounds.startSpaceMusic();
    const ctx = FakeAudioContext.instances[0];
    const before = ctx.nodes.length;

    // Ten minutes of play at one note every 420 ms.
    vi.advanceTimersByTime(600_000);

    sounds.stopSpaceMusic();

    // Everything the loop created must have been stopped, and nothing may be
    // retained after stop.
    sounds.startSpaceMusic();
    vi.advanceTimersByTime(1_000);
    const retained = sounds.__musicHandleCount?.();
    expect(retained, 'the stop-closure array grows without bound').toBeLessThan(5);
    expect(ctx.nodes.length).toBeGreaterThan(before);
  });

  it('stops the interval so no further notes are scheduled', () => {
    sounds.startSpaceMusic();
    const ctx = FakeAudioContext.instances[0];
    vi.advanceTimersByTime(2_000);
    const afterPlaying = ctx.nodes.length;

    sounds.stopSpaceMusic();
    vi.advanceTimersByTime(10_000);

    expect(ctx.nodes.length).toBe(afterPlaying);
  });

  it('disconnects the master gain on stop', () => {
    sounds.startSpaceMusic();
    const ctx = FakeAudioContext.instances[0];
    const master = ctx.nodes.find((n) => n.kind === 'gain');
    sounds.stopSpaceMusic();
    expect(master.disconnected).toBe(true);
  });

  it('starting twice does not leave the first loop running', () => {
    sounds.startSpaceMusic();
    sounds.startSpaceMusic();
    const ctx = FakeAudioContext.instances[0];
    vi.advanceTimersByTime(2_000);
    const withTwoStarts = ctx.nodes.length;

    sounds.stopSpaceMusic();
    vi.advanceTimersByTime(5_000);
    expect(ctx.nodes.length).toBe(withTwoStarts);
  });
});

describe('engine hum', () => {
  it('stops cleanly and can be restarted', () => {
    sounds.startEngineHum();
    const ctx = FakeAudioContext.instances[0];
    const oscillators = ctx.nodes.filter((n) => n.kind === 'oscillator');
    expect(oscillators.length).toBeGreaterThan(0);

    sounds.stopEngineHum();
    expect(oscillators.every((o) => o.stopped)).toBe(true);

    expect(() => sounds.startEngineHum()).not.toThrow();
  });

  it('stopping without starting is harmless', () => {
    expect(() => sounds.stopEngineHum()).not.toThrow();
  });
});

describe('audio context', () => {
  it('can be closed, so leaving the game releases it', async () => {
    // Browsers cap concurrent AudioContexts; without this, entering and
    // leaving the game a handful of times kills audio for the whole tab.
    expect(typeof sounds.closeAudio).toBe('function');

    sounds.startSpaceMusic();
    const ctx = FakeAudioContext.instances[0];
    await sounds.closeAudio();
    expect(ctx.closed).toBe(true);
  });

  it('a new context is created after close', async () => {
    sounds.startSpaceMusic();
    await sounds.closeAudio();
    sounds.startSpaceMusic();
    expect(FakeAudioContext.instances.length).toBe(2);
  });
});
