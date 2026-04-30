export const J2000 = new Date('2000-01-01T12:00:00Z').getTime();

// Helper to calculate orbital position based on Keplerian elements
// a: semi-major axis (AU)
// e: eccentricity
// i: inclination (deg)
// N: longitude of ascending node (deg)
// w: argument of periapsis (deg)
// M0: mean anomaly at J2000 (deg)
// n: daily motion (deg/day)
// date: timestamp in ms
export function calculatePosition(elements, date) {
  const d = (date - J2000) / (1000 * 60 * 60 * 24); // days since J2000

  // Update elements (ignoring variations over centuries for simplicity, 
  // but using mean daily motion for anomaly)
  const a = elements.a;
  const e = elements.e;
  const i = elements.i * (Math.PI / 180);
  const N = elements.N * (Math.PI / 180);
  const w = elements.w * (Math.PI / 180);
  
  // Mean anomaly
  let M = (elements.M0 + elements.n * d) % 360;
  if (M < 0) M += 360;
  M = M * (Math.PI / 180);

  // Solve Kepler's equation for Eccentric Anomaly (E)
  let E = M;
  let F = E - e * Math.sin(E) - M;
  let iter = 0;
  while (Math.abs(F) > 1e-6 && iter < 100) {
    E = E - F / (1 - e * Math.cos(E));
    F = E - e * Math.sin(E) - M;
    iter++;
  }

  // True anomaly (v) and distance (r)
  const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
  const r = a * (1 - e * Math.cos(E));

  // Heliocentric coordinates
  const x = r * (Math.cos(N) * Math.cos(w + v) - Math.sin(N) * Math.sin(w + v) * Math.cos(i));
  const y = r * (Math.sin(N) * Math.cos(w + v) + Math.cos(N) * Math.sin(w + v) * Math.cos(i));
  const z = r * (Math.sin(w + v) * Math.sin(i));

  // Note: Three.js uses Y-up, so map Z to Y in three.js if needed, or XZ plane for orbits.
  // We'll return X, Y, Z where XY is the ecliptic plane, Z is up/down.
  return new Float32Array([x, y, z]);
}
