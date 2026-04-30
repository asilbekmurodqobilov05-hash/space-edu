import { create } from "zustand";
import { persist } from "zustand/middleware";

function normalizeLanguage(lang) {
  const value = String(lang || "").trim().toUpperCase();
  if (value === "UZ" || value === "UZB") return "UZB";
  if (value === "RU" || value === "RUS") return "RUS";
  if (value === "EN" || value === "ENG") return "ENG";
  return detectBrowserLanguage();
}

function detectBrowserLanguage() {
  try {
    const lang = (navigator.language || '').toLowerCase();
    if (lang.startsWith('uz')) return 'UZB';
    if (lang.startsWith('ru')) return 'RUS';
  } catch {
    // SSR / no navigator
  }
  return 'ENG';
}

export const useUserStore = create()(
  persist(
    (set) => ({
      completedLessons: [],
      quizScores: {},
      achievements: [],
      astronautName: "",
      spaceship: "Explorer I",
      language: detectBrowserLanguage(),

      setLanguage:      (lang)       => set({ language: normalizeLanguage(lang) }),
      setAstronautName: (name)       => set({ astronautName: name }),
      setSpaceship:     (spaceship)  => set({ spaceship }),

      completeLesson: (lessonId) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
        })),

      saveQuizScore: (quizId, score) =>
        set((s) => ({ quizScores: { ...s.quizScores, [quizId]: score } })),

      unlockAchievement: (id) =>
        set((s) => ({
          achievements: s.achievements.includes(id)
            ? s.achievements
            : [...s.achievements, id],
        })),

      resetProgress: () =>
        set({ completedLessons: [], quizScores: {}, achievements: [], astronautName: "", language: 'ENG' }),
    }),
    { name: "uz-cosmos-storage" },
  ),
);
