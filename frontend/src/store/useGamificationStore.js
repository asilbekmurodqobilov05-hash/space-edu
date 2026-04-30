import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const calcLevel = (xp) => Math.floor(Math.sqrt(xp / 100)) + 1;

export const useGamificationStore = create()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streak: 0,
      fuel: 100,
      lastPlayDate: null,
      badges: [],
      dailyChallengeCompleted: false,
      completedCareers: [],
      trackedEvents: [],
      careerTrack: null,
      skills: {},
      portfolio: [],
      inventory: [],

      addXp: (amount) => {
        const newXp = get().xp + amount;
        set({ xp: newXp, level: calcLevel(newXp) });
        get().checkBadges();
      },

      addFuel: (amount) =>
        set((s) => ({ fuel: Math.min(1000, s.fuel + amount) })),

      spendFuel: (amount) => {
        const cur = get().fuel;
        if (cur < amount) return false;
        set({ fuel: cur - amount });
        return true;
      },

      buyItem: (itemId, cost) => {
        const s = get();
        if (s.fuel < cost || s.inventory.includes(itemId)) return false;
        set({ fuel: s.fuel - cost, inventory: [...s.inventory, itemId] });
        return true;
      },

      setCareerTrack: (track) => set({ careerTrack: track }),

      updateSkill: (skill, level) =>
        set((s) => ({ skills: { ...s.skills, [skill]: level } })),

      addProjectToPortfolio: (data) => {
        const project = {
          ...data,
          id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          dateCompleted: new Date().toISOString(),
        };
        set((s) => ({ portfolio: [project, ...s.portfolio] }));
      },

      trackEvent: (eventId) => {
        const s = get();
        if (s.trackedEvents.includes(eventId)) return;
        const tracked = [...s.trackedEvents, eventId];
        set({ trackedEvents: tracked });
        let xp = 20;
        if (tracked.length >= 3) {
          xp += 100;
          if (!s.badges.some((b) => b.id === 'event_tracker')) {
            set((st) => ({
              badges: [...st.badges, { id: 'event_tracker', name: 'Stargazer', description: 'Tracked 3 astronomical events', icon: 'Star', unlockedAt: new Date().toISOString() }],
            }));
          }
        }
        get().addXp(xp);
      },

      markCareerExplored: (careerId) => {
        const s = get();
        if (s.completedCareers.includes(careerId)) return;
        const completed = [...s.completedCareers, careerId];
        set({ completedCareers: completed });
        let xp = 50;
        if (completed.length >= 4) {
          xp += 200;
          if (!s.badges.some((b) => b.id === 'career_expert')) {
            set((st) => ({
              badges: [...st.badges, { id: 'career_expert', name: 'Career Expert', description: 'Explored all space career paths', icon: 'Briefcase', unlockedAt: new Date().toISOString() }],
            }));
          }
        }
        get().addXp(xp);
      },

      checkStreak: () => {
        const today = new Date().toDateString();
        const last = get().lastPlayDate;
        if (last === today) return;
        set({ dailyChallengeCompleted: false });
        if (last) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          set((s) => ({ streak: new Date(last).toDateString() === yesterday.toDateString() ? s.streak + 1 : 1 }));
        } else {
          set({ streak: 1 });
        }
        set({ lastPlayDate: today });
      },

      completeDailyChallenge: (xpEarned) => {
        get().checkStreak();
        get().addXp(xpEarned);
        set({ dailyChallengeCompleted: true });
        get().checkBadges();
      },

      // Sync state from backend API response
      syncFromAPI: ({ xp, level, fuel, streak, last_play_date, skills }) =>
        set({ xp, level, fuel, streak, lastPlayDate: last_play_date ?? null, skills: skills ?? {} }),

      // Apply lesson complete response from API
      applyLessonResult: ({ xp_earned, fuel_earned, new_level, new_badges }) => {
        set((s) => ({
          xp: s.xp + xp_earned,
          level: new_level,
          fuel: Math.min(1000, s.fuel + fuel_earned),
        }));
      },

      checkBadges: () => {
        const { level, streak, badges, dailyChallengeCompleted, xp } = get();
        const cur = [...badges];
        const award = (id, name, description, icon) => {
          if (!cur.find((b) => b.id === id))
            cur.push({ id, name, description, icon, unlockedAt: new Date().toISOString() });
        };
        if (level >= 5)  award('lvl5',        'Space Explorer', 'Reached Level 5',                '🚀');
        if (level >= 10) award('lvl10',        'Star Navigator', 'Reached Level 10',               '⭐');
        if (streak >= 3) award('streak3',      'Comet Rider',    '3 Day Streak',                   '☄️');
        if (streak >= 7) award('streak7',      'Orbit Master',   '7 Day Streak',                   '🌍');
        if (dailyChallengeCompleted) award('first_daily', 'First Step', 'Completed first daily challenge', '🎯');
        if (xp >= 50)    award('first_lesson', 'Curious Mind',   'Completed your first lesson',    'BookOpen');
        if (cur.length > badges.length) set({ badges: cur });
      },
    }),
    { name: 'gamification-storage' },
  ),
);
