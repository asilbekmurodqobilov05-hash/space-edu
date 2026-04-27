import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = 'ENG' | 'UZB' | 'RUS';

/**
 * Detect the user's preferred language from their browser settings.
 * Maps browser locale prefixes to our internal language codes.
 */
function detectBrowserLanguage(): Language {
  try {
    const browserLang = (navigator.language || '').toLowerCase();
    if (browserLang.startsWith('uz')) return 'UZB';
    if (browserLang.startsWith('ru')) return 'RUS';
  } catch {
    // SSR or environments without navigator
  }
  return 'ENG';
}

interface UserState {
  completedLessons: string[];
  quizScores: Record<string, number>;
  achievements: string[];
  astronautName: string;
  spaceship: string;
  language: Language;
  setLanguage: (lang: Language) => void;
  setAstronautName: (name: string) => void;
  setSpaceship: (spaceship: string) => void;
  completeLesson: (lessonId: string) => void;
  saveQuizScore: (quizId: string, score: number) => void;
  unlockAchievement: (achievementId: string) => void;
  resetProgress: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      completedLessons: [],
      quizScores: {},
      achievements: [],
      astronautName: "",
      spaceship: "Explorer I",
      language: detectBrowserLanguage(),
      setLanguage: (lang) => set({ language: lang }),
      setAstronautName: (name) => set({ astronautName: name }),
      setSpaceship: (spaceship) => set({ spaceship }),
      completeLesson: (lessonId) =>
        set((state) => ({
          completedLessons: state.completedLessons.includes(lessonId)
            ? state.completedLessons
            : [...state.completedLessons, lessonId],
        })),
      saveQuizScore: (quizId, score) =>
        set((state) => ({
          quizScores: { ...state.quizScores, [quizId]: score },
        })),
      unlockAchievement: (achievementId) =>
        set((state) => ({
          achievements: state.achievements.includes(achievementId)
            ? state.achievements
            : [...state.achievements, achievementId],
        })),
      resetProgress: () =>
        set({
          completedLessons: [],
          quizScores: {},
          achievements: [],
          astronautName: "",
          language: 'ENG',
        }),
    }),
    {
      name: "uz-cosmos-storage",
    },
  ),
);
