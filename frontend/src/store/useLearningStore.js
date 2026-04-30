import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';
import api from '@/lib/api';

export const useLearningStore = create()(
  persist(
    (set, get) => ({
      enrolledUnits: [],
      completedLessons: [],
      masteredLessons: [],
      lessonScores: {},
      currentLessonId: null,
      currentUnitId: null,

      enrollUnit: (unitId) => {
        const s = get();
        if (!s.enrolledUnits.includes(unitId))
          set({ enrolledUnits: [...s.enrolledUnits, unitId] });
      },

      completeLesson: async (lessonId, unitId, score, xpReward) => {
        const s = get();
        const mastered = score >= 80;
        set({
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
          masteredLessons: mastered && !s.masteredLessons.includes(lessonId)
            ? [...s.masteredLessons, lessonId]
            : s.masteredLessons,
          lessonScores: { ...s.lessonScores, [lessonId]: Math.max(score, s.lessonScores[lessonId] || 0) },
        });
        
        try {
            // Find next lesson via backend call, since we don't have hardcoded data
            const { data } = await api.get(`/courses/units/${unitId}/`);
            const lessons = data.lessons || [];
            const idx = lessons.findIndex(l => l.slug === lessonId);
            if (idx !== -1 && idx < lessons.length - 1) {
                set({ currentLessonId: lessons[idx + 1].slug, currentUnitId: unitId });
            } else {
                set({ currentLessonId: null });
            }
        } catch (e) {
            set({ currentLessonId: null });
        }
      },

      resumeLesson: (lessonId, unitId) =>
        set({ currentLessonId: lessonId, currentUnitId: unitId }),
        
      // API integration for progress tracking
      syncProgressFromAPI: (progressData) => {
          if (!progressData) return;
          const completed = progressData.lessons ? progressData.lessons.map(l => l.lesson_slug) : [];
          set({ completedLessons: completed });
      }
    }),
    { name: 'uz-cosmos-learning-storage' },
  ),
);
