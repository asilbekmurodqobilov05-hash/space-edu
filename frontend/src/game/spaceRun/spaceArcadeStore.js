import { create } from "zustand";
import { persist } from "zustand/middleware";

const SKIN_PRICES = {
  default: 0,
  ruby: 40,
  lime: 70,
  solar: 120,
};

export const useSpaceArcadeStore = create()(
  persist(
    (set, get) => ({
      wallet: 0,
      equippedSkin: "default",
      unlocked: ["default"],

      addWallet: (amount) =>
        set((s) => ({ wallet: Math.max(0, s.wallet + Math.floor(amount)) })),

      equipSkin: (id) => {
        if (get().unlocked.includes(id)) set({ equippedSkin: id });
      },

      tryBuySkin: (id) => {
        const price = SKIN_PRICES[id];
        const { wallet, unlocked } = get();
        if (unlocked.includes(id)) { set({ equippedSkin: id }); return true; }
        if (wallet < price) return false;
        set({ wallet: wallet - price, unlocked: [...unlocked, id], equippedSkin: id });
        return true;
      },
    }),
    { name: "space-edu-arcade" },
  ),
);

export const skinPrice = (id) => SKIN_PRICES[id];

export const SHIP_SKINS = [
  { id: "default", label: "Star Scout",  color: "#a78bfa" },
  { id: "ruby",    label: "Ruby Racer",  color: "#fb7185" },
  { id: "lime",    label: "Lime Comet",  color: "#a3e635" },
  { id: "solar",   label: "Solar Flare", color: "#fbbf24" },
];
