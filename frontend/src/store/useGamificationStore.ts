import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  careerTrack: string;
  dateCompleted: string;
  skillsUsed: string[];
}

export type SkillLevel = 'Not Started' | 'In Progress' | 'Skilled' | 'Mastered';

interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  fuel: number;
  lastPlayDate: string | null;
  badges: Badge[];
  dailyChallengeCompleted: boolean;
  completedCareers: string[];
  trackedEvents: string[];
  careerTrack: string | null;
  skills: Record<string, SkillLevel>;
  portfolio: Project[];
  inventory: string[];
  
  addXp: (amount: number) => void;
  addFuel: (amount: number) => void;
  spendFuel: (amount: number) => boolean;
  setCareerTrack: (track: string) => void;
  updateSkill: (skill: string, level: SkillLevel) => void;
  addProjectToPortfolio: (project: Omit<Project, 'id' | 'dateCompleted'>) => void;
  buyItem: (itemId: string, cost: number) => boolean;
  
  checkStreak: () => void;
  completeDailyChallenge: (xpEarned: number) => void;
  checkBadges: () => void;
  markCareerExplored: (careerId: string) => void;
  trackEvent: (eventId: string) => void;
}

const calculateLevel = (xp: number) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const useGamificationStore = create<GamificationState>()(
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
        const newLevel = calculateLevel(newXp);
        set({ xp: newXp, level: newLevel });
        get().checkBadges();
      },

      addFuel: (amount) => {
        set((state) => ({ fuel: Math.min(1000, state.fuel + amount) }));
      },

      spendFuel: (amount) => {
        const currentFuel = get().fuel;
        if (currentFuel >= amount) {
          set({ fuel: currentFuel - amount });
          return true;
        }
        return false;
      },

      buyItem: (itemId, cost) => {
        const state = get();
        if (state.fuel >= cost && !state.inventory.includes(itemId)) {
          set({ 
            fuel: state.fuel - cost, 
            inventory: [...state.inventory, itemId] 
          });
          return true;
        }
        return false;
      },

      setCareerTrack: (track) => {
        set({ careerTrack: track });
      },

      updateSkill: (skill, level) => {
        set((state) => ({
          skills: { ...state.skills, [skill]: level }
        }));
      },

      addProjectToPortfolio: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          dateCompleted: new Date().toISOString()
        };
        set((state) => ({
          portfolio: [newProject, ...state.portfolio]
        }));
      },

      trackEvent: (eventId) => {
        const state = get();
        if (state.trackedEvents.includes(eventId)) return;

        const newTracked = [...state.trackedEvents, eventId];
        set({ trackedEvents: newTracked });
        
        let xpBonus = 20;
        
        if (newTracked.length >= 3) {
          xpBonus += 100;
          const hasBadge = state.badges.some(b => b.id === 'event_tracker');
          if (!hasBadge) {
            set((s) => ({
              badges: [...s.badges, {
                id: 'event_tracker',
                name: 'Stargazer',
                description: 'Tracked 3 astronomical events',
                icon: 'Star',
                unlockedAt: new Date().toISOString()
              }]
            }));
          }
        }
        
        get().addXp(xpBonus);
      },

      markCareerExplored: (careerId) => {
        const state = get();
        if (state.completedCareers.includes(careerId)) return;

        const newCompleted = [...state.completedCareers, careerId];
        set({ completedCareers: newCompleted });
        
        // Award XP for exploring
        let xpBonus = 50;
        
        // Check if all 4 careers are explored
        if (newCompleted.length >= 4) {
          xpBonus += 200;
          const hasExpertBadge = state.badges.some(b => b.id === 'career_expert');
          if (!hasExpertBadge) {
            set((s) => ({
              badges: [...s.badges, {
                id: 'career_expert',
                name: 'Career Expert',
                description: 'Explored all space career paths',
                icon: 'Briefcase',
                unlockedAt: new Date().toISOString()
              }]
            }));
          }
        }
        
        get().addXp(xpBonus);
      },

      checkStreak: () => {
        const today = new Date().toDateString();
        const lastPlay = get().lastPlayDate;
        
        if (lastPlay !== today) {
            set({ dailyChallengeCompleted: false });
            
            if (lastPlay) {
                const lastDate = new Date(lastPlay);
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (lastDate.toDateString() === yesterday.toDateString()) {
                    set((state) => ({ streak: state.streak + 1 }));
                } else {
                    set({ streak: 1 });
                }
            } else {
                set({ streak: 1 });
            }
            set({ lastPlayDate: today });
        }
      },

      completeDailyChallenge: (xpEarned) => {
        get().checkStreak();
        get().addXp(xpEarned);
        set({ dailyChallengeCompleted: true });
        get().checkBadges();
      },

      checkBadges: () => {
        const { level, streak, badges, dailyChallengeCompleted } = get();
        const newBadges = [...badges];
        
        const awardBadge = (id: string, name: string, description: string, icon: string) => {
            if (!newBadges.find(b => b.id === id)) {
                newBadges.push({ id, name, description, icon, unlockedAt: new Date().toISOString() });
            }
        };

        if (level >= 5) awardBadge('lvl5', 'Space Explorer', 'Reached Level 5', '🚀');
        if (level >= 10) awardBadge('lvl10', 'Star Navigator', 'Reached Level 10', '⭐');
        if (streak >= 3) awardBadge('streak3', 'Comet Rider', '3 Day Streak', '☄️');
        if (streak >= 7) awardBadge('streak7', 'Orbit Master', '7 Day Streak', '🌍');
        if (dailyChallengeCompleted) awardBadge('first_daily', 'First Step', 'Completed first daily challenge', '🎯');
        if (get().xp >= 50) awardBadge('first_lesson', 'Curious Mind', 'Completed your first lesson', 'BookOpen');

        if (newBadges.length > badges.length) {
            set({ badges: newBadges });
        }
      }
    }),
    {
      name: 'gamification-storage',
    }
  )
);
