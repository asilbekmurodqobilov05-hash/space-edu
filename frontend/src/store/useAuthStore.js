import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setupApiAuth } from '@/lib/api';
import { getCosmicSilkRoadUrl } from '@/lib/externalAuthUrl';

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, access, refresh) => {
        set({
          user,
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        window.location.href = getCosmicSilkRoadUrl();
      },
    }),
    {
      name: 'uz-cosmos-auth',
    }
  )
);

// Initialize API interceptor with store methods
setupApiAuth(
  () => useAuthStore.getState().accessToken,
  () => useAuthStore.getState().refreshToken,
  () => useAuthStore.getState().logout()
);
