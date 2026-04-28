import { create } from "zustand";

const INITIAL = {
  score: 0,
  survivalSec: 0,
  distance: 0,
  coinsCollected: 0,
  health: 100,
  shield: 0,
  boost: 100,
  gameOver: false,
  paused: false,
  difficulty: 1,
  activePower: null,
};

export const useSpaceRunHud = create((set) => ({
  ...INITIAL,
  setHud: (patch) => set(patch),
  reset: () => set(INITIAL),
}));
