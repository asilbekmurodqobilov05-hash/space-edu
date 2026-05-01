import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStarStore = create(
  persist(
    (set, get) => ({
      collection: [], // Array of star IDs
      points: 0,
      badges: [],
      starOfTheDay: null,
      lastDailyCheck: null,

      addStarToCollection: (starId) => set((state) => {
        if (!state.collection.includes(starId)) {
          let newPoints = state.points + 50; // Base points
          let newBadges = [...state.badges];

          // Check if it's the star of the day for bonus points
          if (state.starOfTheDay === starId) {
            newPoints += 100; // Bonus
            if (!newBadges.includes('daily_finder')) {
              newBadges.push('daily_finder');
            }
          }

          return { 
            collection: [...state.collection, starId],
            points: newPoints,
            badges: newBadges
          };
        }
        return state;
      }),

      initializeDailyStar: (allStarIds) => {
        const today = new Date().toDateString();
        const { lastDailyCheck, starOfTheDay } = get();

        // Rotate daily star if it's a new day or not set
        if (today !== lastDailyCheck || !starOfTheDay) {
          // Simple logic to pick a star based on the day of the year
          const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
          const index = dayOfYear % allStarIds.length;
          set({
            starOfTheDay: allStarIds[index],
            lastDailyCheck: today
          });
        }
      }
    }),
    {
      name: 'star-collection-storage',
    }
  )
);

export default useStarStore;
