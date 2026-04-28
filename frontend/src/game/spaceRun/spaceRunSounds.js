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

let musicOscs = [];
let engineNodes = [];

export function startSpaceMusic() {
  stopSpaceMusic();
  const c = getCtx();
  if (!c) return;
  const master = c.createGain();
  master.gain.value = 0.06;
  master.connect(c.destination);
  const notes = [196, 247, 294, 330, 392];
  let i = 0;
  const id = window.setInterval(() => {
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
    osc.stop(t + 0.5);
    musicOscs.push({ stop: () => { try { osc.stop(); } catch { /* noop */ } } });
    i++;
  }, 420);
  musicOscs.push({ stop: () => clearInterval(id) });
}

export function stopSpaceMusic() {
  musicOscs.forEach((o) => o.stop());
  musicOscs = [];
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
    },
  });
}

export function stopEngineHum() {
  engineNodes.forEach((n) => n.stop());
  engineNodes = [];
}
