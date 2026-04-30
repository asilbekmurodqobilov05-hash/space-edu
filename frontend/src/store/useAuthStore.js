import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { setupApiAuth } from '@/lib/api';
import { useGamificationStore } from './useGamificationStore';
import { useLearningStore } from './useLearningStore';
import { getCosmicSilkRoadUrl } from '@/lib/externalAuthUrl';

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
        _setupAuth(get);
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
        _setupAuth(get);
      },

      updateUser: (data) =>
        set((s) => ({ user: { ...s.user, ...data } })),

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        setupApiAuth(() => null, () => null, () => { window.location.href = getCosmicSilkRoadUrl(); });
      },

      // Called on app mount to verify token is still valid
      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me/');
          set((s) => ({ user: { ...s.user, ...data } }));

          try {
            const { data: gamificationData } = await api.get('/gamification/profile/');
            useGamificationStore.getState().syncFromAPI(gamificationData);
          } catch (e) { }

          try {
            const { data: progressData } = await api.get('/progress/');
            useLearningStore.getState().syncProgressFromAPI(progressData);
          } catch (e) { }

          return true;
        } catch {
          get().logout();
          return false;
        }
      },
    }),
    { name: 'uz-cosmos-auth' }
  )
);

function _setupAuth(get) {
  setupApiAuth(
    () => get().accessToken,
    () => get().refreshToken,
    () => { useAuthStore.getState().logout(); window.location.href = getCosmicSilkRoadUrl(); }
  );
}

// Wire up interceptors on store creation (handles page reload with persisted tokens)
setTimeout(() => {
  const { accessToken, refreshToken, logout } = useAuthStore.getState();
  if (accessToken) {
    setupApiAuth(
      () => useAuthStore.getState().accessToken,
      () => useAuthStore.getState().refreshToken,
      () => { logout(); window.location.href = getCosmicSilkRoadUrl(); }
    );
  }
}, 0);