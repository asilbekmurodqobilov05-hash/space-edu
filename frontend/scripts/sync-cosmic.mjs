import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..', 'cosmic-silk-road.html');
const dest = path.join(__dirname, '..', 'public', 'cosmic-silk-road.html');

if (fs.existsSync(repoRoot)) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(repoRoot, dest);
  console.log('[sync-cosmic] ../../cosmic-silk-road.html → public/cosmic-silk-road.html');
} else {
  console.warn('[sync-cosmic] ../../cosmic-silk-road.html topilmadi — public/ dagi nusxa saqlanadi.');
}
