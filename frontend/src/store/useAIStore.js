import { create } from 'zustand';

export const useAIStore = create((set) => ({
  context: undefined,
  setContext: (context) => set({ context }),
}));
