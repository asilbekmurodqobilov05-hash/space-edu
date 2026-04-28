import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';
import { getUnitById, getNextLesson } from '@/data/learningData';

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

      completeLesson: (lessonId, unitId, score, xpReward) => {
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
        if (!s.completedLessons.includes(lessonId))
          useGamificationStore.getState().addXp(xpReward);
        const next = getNextLesson(unitId, lessonId);
        set(next ? { currentLessonId: next.id, currentUnitId: unitId } : { currentLessonId: null });
      },

      resumeLesson: (lessonId, unitId) =>
        set({ currentLessonId: lessonId, currentUnitId: unitId }),

      isLessonUnlocked: (unitId, lessonId) => {
        const unit = getUnitById(unitId);
        if (!unit) return false;
        const idx = unit.lessons.findIndex((l) => l.id === lessonId);
        if (idx === 0) return true;
        return get().completedLessons.includes(unit.lessons[idx - 1].id);
      },

      getUnitProgress: (unitId) => {
        const unit = getUnitById(unitId);
        if (!unit || unit.lessons.length === 0) return 0;
        const done = unit.lessons.filter((l) => get().completedLessons.includes(l.id)).length;
        return Math.round((done / unit.lessons.length) * 100);
      },
    }),
    { name: 'uz-cosmos-learning-storage' },
  ),
);
