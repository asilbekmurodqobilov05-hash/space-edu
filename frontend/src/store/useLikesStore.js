import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLikesStore = create(
  persist(
    (set, get) => ({
      likedLessons: [], // Array of objects: { id, title, subject, url, timestamp }
      
      likeLesson: (lessonData) => set((state) => {
        // Prevent duplicates
        if (state.likedLessons.some(l => l.id === lessonData.id)) {
          return state;
        }
        return {
          likedLessons: [...state.likedLessons, { ...lessonData, timestamp: Date.now() }]
        };
      }),

      unlikeLesson: (lessonId) => set((state) => ({
        likedLessons: state.likedLessons.filter(l => l.id !== lessonId)
      })),

      isLiked: (lessonId) => {
        return get().likedLessons.some(l => l.id === lessonId);
      }
    }),
    {
      name: 'space-edu-likes-storage', // unique name
    }
  )
);
