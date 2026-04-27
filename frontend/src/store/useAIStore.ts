import { create } from 'zustand';

interface AIState {
  context: string | undefined;
  setContext: (context: string | undefined) => void;
}

export const useAIStore = create<AIState>((set) => ({
  context: undefined,
  setContext: (context) => set({ context }),
}));
