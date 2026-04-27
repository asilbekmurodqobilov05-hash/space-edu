import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ShipSkinId = "default" | "ruby" | "lime" | "solar";

const SKIN_PRICES: Record<ShipSkinId, number> = {
  default: 0,
  ruby: 40,
  lime: 70,
  solar: 120,
};

interface SpaceArcadeState {
  wallet: number;
  equippedSkin: ShipSkinId;
  unlocked: ShipSkinId[];
  addWallet: (amount: number) => void;
  equipSkin: (id: ShipSkinId) => void;
  tryBuySkin: (id: ShipSkinId) => boolean;
}

export const useSpaceArcadeStore = create<SpaceArcadeState>()(
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
        if (unlocked.includes(id)) {
          set({ equippedSkin: id });
          return true;
        }
        if (wallet < price) return false;
        set({
          wallet: wallet - price,
          unlocked: [...unlocked, id],
          equippedSkin: id,
        });
        return true;
      },
    }),
    { name: "space-edu-arcade" }
  )
);

export function skinPrice(id: ShipSkinId) {
  return SKIN_PRICES[id];
}

export const SHIP_SKINS: { id: ShipSkinId; label: string; color: string }[] = [
  { id: "default", label: "Star Scout", color: "#38bdf8" },
  { id: "ruby", label: "Ruby Racer", color: "#fb7185" },
  { id: "lime", label: "Lime Comet", color: "#a3e635" },
  { id: "solar", label: "Solar Flare", color: "#fbbf24" },
];
