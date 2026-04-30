import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { setupApiAuth } from '@/lib/api';
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
        set({ accessToken, refreshToken, isAuthenticated: Boolean(accessToken) });
        _setupAuth(get);
      },

      updateUser: (data) =>
        set((s) => ({ user: { ...s.user, ...data } })),

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        setupApiAuth(() => null, () => null, () => { window.location.href = getCosmicSilkRoadUrl(); });
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me/');
          set((s) => ({ user: { ...s.user, ...data }, isAuthenticated: true }));
          return true;
        } catch {
          get().logout();
          return false;
        }
      },
    }),
    { name: 'auth-storage' }
  )
);

function _setupAuth(get) {
  setupApiAuth(
    () => get().accessToken,
    () => get().refreshToken,
    () => { useAuthStore.getState().logout(); window.location.href = getCosmicSilkRoadUrl(); }
  );
}

setupApiAuth(
  () => useAuthStore.getState().accessToken,
  () => useAuthStore.getState().refreshToken,
  () => { useAuthStore.getState().logout(); window.location.href = getCosmicSilkRoadUrl(); }
);
