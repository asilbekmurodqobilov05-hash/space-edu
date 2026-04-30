/**
 * Standalone registration UI. Default: /cosmic-silk-road.html (Vite serves from public/).
 * Repo ildizidagi `cosmic-silk-road.html` har `npm run dev` / `npm run build` oldidan
 * `public/` ga avtomatik nusxalanadi (`scripts/sync-cosmic.mjs`).
 * Boshqa domen uchun: VITE_COSMIC_SILK_ROAD_URL
 */
export function getCosmicSilkRoadUrl() {
  const u = import.meta.env.VITE_COSMIC_SILK_ROAD_URL;
  if (u != null && String(u).trim() !== '') return String(u).trim();
  return '/cosmic-silk-road.html';
}
