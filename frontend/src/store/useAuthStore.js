import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { setupApiAuth } from '@/lib/api';
import { useGamificationStore } from './useGamificationStore';
import { useLearningStore } from './useLearningStore';
import { useUserStore } from './useUserStore';
import useStarStore from './useStarStore';
import { useProblemsStore } from './useProblemsStore';

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, accessToken, refreshToken) => {
        _resetAllStores();
        set({ user, accessToken, refreshToken, isAuthenticated: true });
        _setupAuth();
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken, isAuthenticated: Boolean(accessToken) });
        _setupAuth();
      },

      updateUser: (data) =>
        set((s) => ({ user: { ...s.user, ...data } })),

      logout: () => {
        // Tell the server to blacklist the refresh token; without this it stayed
        // valid for its full 7 days after the user pressed "log out".
        const refresh = get().refreshToken;
        if (refresh) {
          api.post('/auth/logout/', { refresh }).catch(() => {});
        }
        _resetAllStores();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        setupApiAuth(
          () => null,
          () => null,
          () => { window.location.href = '/login'; },
          () => {},
        );
      },

      // Called on app mount to verify token is still valid
      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me/');
          set((s) => ({ user: { ...s.user, ...data }, isAuthenticated: true }));

          try {
            const { data: gamificationData } = await api.get('/gamification/profile/');
            useGamificationStore.getState().syncFromAPI(gamificationData);
          } catch (e) { }

          try {
            const { data: progressData } = await api.get('/progress/');
            useLearningStore.getState().syncProgressFromAPI(progressData);
          } catch (e) { }
          return true;
        } catch (err) {
          // Only a rejected credential ends the session. This used to catch
          // everything, so one flaky request or a 502 from a cold-starting
          // backend logged the user out.
          if (err?.response?.status === 401) {
            get().logout();
          }
          return false;
        }
      },
    }),
    { name: 'uz-cosmos-auth' }
  )
);

function _resetAllStores() {
  useGamificationStore.getState().reset();
  useLearningStore.getState().reset();
  useUserStore.getState().resetProgress();
  useStarStore.setState({ collection: [], points: 0, badges: [], starOfTheDay: null, lastDailyCheck: null });
  useProblemsStore.getState().resetProblems();
}

function _setupAuth() {
  setupApiAuth(
    () => useAuthStore.getState().accessToken,
    () => useAuthStore.getState().refreshToken,
    () => { useAuthStore.getState().logout(); window.location.href = '/login'; },
    (newAccess, newRefresh) => {
      useAuthStore.setState((s) => ({
        accessToken: newAccess,
        refreshToken: newRefresh ?? s.refreshToken,
      }));
    }
  );
}

// Wire up the interceptors on module load, so a page reload with persisted
// tokens gets the same wiring as a fresh login. The old version passed only
// three arguments here, leaving the token-refresh callback as a no-op — so
// after any reload the rotated tokens were thrown away.
_setupAuth();
