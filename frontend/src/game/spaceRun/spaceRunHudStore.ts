import { create } from "zustand";

interface HudState {
  score: number;
  survivalSec: number;
  distance: number;
  coinsCollected: number;
  health: number;
  shield: number;
  boost: number;
  gameOver: boolean;
  paused: boolean;
  difficulty: number;
  activePower: string | null;
  setHud: (p: Partial<Omit<HudState, "setHud" | "reset">>) => void;
  reset: () => void;
}

export const useSpaceRunHud = create<HudState>((set) => ({
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
  setHud: (p) => set(p),
  reset: () =>
    set({
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
    }),
}));
