export function calculateLevel(xp) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function formatNumber(n) {
  return n.toLocaleString();
}
