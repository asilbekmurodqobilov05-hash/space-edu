import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';
import { getUnitById, getNextLesson } from '@/data/learningData';

interface LearningState {
  enrolledUnits: string[];
  completedLessons: string[];
  masteredLessons: string[];
  lessonScores: Record<string, number>;
  currentLessonId: string | null;
  currentUnitId: string | null;
  
  enrollUnit: (unitId: string) => void;
  completeLesson: (lessonId: string, unitId: string, score: number, xpReward: number) => void;
  resumeLesson: (lessonId: string, unitId: string) => void;
  isLessonUnlocked: (unitId: string, lessonId: string) => boolean;
  getUnitProgress: (unitId: string) => number;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      enrolledUnits: [],
      completedLessons: [],
      masteredLessons: [],
      lessonScores: {},
      currentLessonId: null,
      currentUnitId: null,

      enrollUnit: (unitId) => {
        const state = get();
        if (!state.enrolledUnits.includes(unitId)) {
          set({ enrolledUnits: [...state.enrolledUnits, unitId] });
        }
      },

      completeLesson: (lessonId, unitId, score, xpReward) => {
        const state = get();
        const isMastered = score >= 80;
        
        const newCompleted = state.completedLessons.includes(lessonId) 
          ? state.completedLessons 
          : [...state.completedLessons, lessonId];
          
        const newMastered = isMastered && !state.masteredLessons.includes(lessonId)
          ? [...state.masteredLessons, lessonId]
          : state.masteredLessons;

        set({
          completedLessons: newCompleted,
          masteredLessons: newMastered,
          lessonScores: { ...state.lessonScores, [lessonId]: Math.max(score, state.lessonScores[lessonId] || 0) }
        });

        // Award XP via Gamification Store
        if (!state.completedLessons.includes(lessonId)) {
          useGamificationStore.getState().addXp(xpReward);
        }

        // Auto-advance to next lesson if available
        const nextLesson = getNextLesson(unitId, lessonId);
        if (nextLesson) {
          set({ currentLessonId: nextLesson.id, currentUnitId: unitId });
        } else {
          // Unit completed
          set({ currentLessonId: null });
        }
      },

      resumeLesson: (lessonId, unitId) => {
        set({ currentLessonId: lessonId, currentUnitId: unitId });
      },

      isLessonUnlocked: (unitId, lessonId) => {
        const unit = getUnitById(unitId);
        if (!unit) return false;

        const lessonIndex = unit.lessons.findIndex(l => l.id === lessonId);
        if (lessonIndex === 0) return true; // First lesson always unlocked

        // Unlocked if previous lesson is completed
        const previousLessonId = unit.lessons[lessonIndex - 1].id;
        return get().completedLessons.includes(previousLessonId);
      },

      getUnitProgress: (unitId) => {
        const unit = getUnitById(unitId);
        if (!unit || unit.lessons.length === 0) return 0;

        const completedInUnit = unit.lessons.filter(l => get().completedLessons.includes(l.id)).length;
        return Math.round((completedInUnit / unit.lessons.length) * 100);
      }
    }),
    {
      name: 'uz-cosmos-learning-storage',
    }
  )
);
