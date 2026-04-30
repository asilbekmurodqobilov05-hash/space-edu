import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProblemsStore = create(
  persist(
    (set) => ({
      solvedProblems: {}, // { problemId: 'correct' | 'wrong' }

      setProblemStatus: (id, status) => set((state) => ({
        solvedProblems: {
          ...state.solvedProblems,
          [id]: status
        }
      })),

      resetProblems: () => set({ solvedProblems: {} }),
    }),
    {
      name: 'space-edu-problems', // unique name for localStorage
    }
  )
);
