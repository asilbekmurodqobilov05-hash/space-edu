let ctx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  return ctx;
}

export async function resumeAudio() {
  const c = getCtx();
  if (c?.state === "suspended") await c.resume();
}

export function playCoinSound() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, t);
  osc.frequency.exponentialRampToValueAtTime(1320, t + 0.06);
  g.gain.setValueAtTime(0.2, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.15);
}

export function playExplosionSound() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const bufferSize = c.sampleRate * 0.35;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < buffer.length; i++)
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (buffer.length * 0.25));
  const noise = c.createBufferSource();
  noise.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(800, t);
  filter.frequency.exponentialRampToValueAtTime(120, t + 0.25);
  const g = c.createGain();
  g.gain.setValueAtTime(0.35, t);
  g.gain.exponentialRampToValueAtTime(0.01, t + 0.32);
  noise.connect(filter);
  filter.connect(g);
  g.connect(c.destination);
  noise.start(t);
  noise.stop(t + 0.36);
}

let engineNodes = [];

// One interval and one gain node, not an ever-growing list. The previous
// version pushed a stop-closure into `musicOscs` on every 420 ms tick even
// though each oscillator already stops itself at t+0.5, so a ten-minute
// session accumulated roughly 1400 dead entries before stopSpaceMusic() ran.
let musicIntervalId = null;
let musicMaster = null;

export function startSpaceMusic() {
  stopSpaceMusic();
  const c = getCtx();
  if (!c) return;
  const master = c.createGain();
  master.gain.value = 0.06;
  master.connect(c.destination);
  musicMaster = master;

  const notes = [196, 247, 294, 330, 392];
  let i = 0;
  musicIntervalId = window.setInterval(() => {
    if (c.state !== "running") return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "triangle";
    osc.frequency.value = notes[i % notes.length];
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    // Scheduled to stop, and onended drops the graph reference so the node can
    // be collected rather than kept alive by the connection to `master`.
    osc.stop(t + 0.5);
    osc.onended = () => {
      try { osc.disconnect(); } catch { /* already gone */ }
      try { g.disconnect(); } catch { /* already gone */ }
    };
    i++;
  }, 420);
}

export function stopSpaceMusic() {
  if (musicIntervalId !== null) {
    clearInterval(musicIntervalId);
    musicIntervalId = null;
  }
  if (musicMaster) {
    try { musicMaster.disconnect(); } catch { /* already gone */ }
    musicMaster = null;
  }
}

/** Test hook: how many long-lived handles the music loop is holding. */
export function __musicHandleCount() {
  return (musicIntervalId !== null ? 1 : 0) + (musicMaster ? 1 : 0);
}

export function startEngineHum() {
  stopEngineHum();
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  const filter = c.createBiquadFilter();
  const gain = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.value = 78;
  lfo.type = "sine";
  lfo.frequency.value = 0.35;
  lfoGain.gain.value = 6;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  filter.type = "lowpass";
  filter.frequency.value = 420;
  gain.gain.value = 0.028;
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  osc.start();
  lfo.start();
  engineNodes.push({
    stop: () => {
      try { osc.stop(); } catch { /* noop */ }
      try { lfo.stop(); } catch { /* noop */ }
      // Disconnect too: stopping an oscillator does not detach it, and the
      // chain kept a reference from destination all the way back.
      [osc, lfo, lfoGain, filter, gain].forEach((n) => {
        try { n.disconnect(); } catch { /* already gone */ }
      });
    },
  });
}

export function stopEngineHum() {
  engineNodes.forEach((n) => n.stop());
  engineNodes = [];
}

/**
 * Release the shared AudioContext.
 *
 * Browsers cap concurrent AudioContexts at around six. The module created one
 * lazily and never closed it, so entering and leaving the game a handful of
 * times in one tab eventually left audio silently dead everywhere.
 */
export async function closeAudio() {
  stopSpaceMusic();
  stopEngineHum();
  const c = ctx;
  ctx = null;
  if (c && typeof c.close === "function" && c.state !== "closed") {
    try { await c.close(); } catch { /* already closing */ }
  }
}
