import { create } from 'zustand';

export const useAIStore = create((set) => ({
  context: undefined,
  isSupportOpen: false,
  setContext: (context) => set({ context }),
  setIsSupportOpen: (open) => set({ isSupportOpen: open }),
}));
