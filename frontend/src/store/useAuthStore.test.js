/**
 * Ticket F4. The auth store carries three of the audit's findings and had no
 * tests: the refresh token that stayed valid for a week after "log out", the
 * `fetchMe` that treated any failure as a rejected credential, and the
 * interceptor wiring that dropped the rotated refresh token after a reload.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api', () => {
  const api = { get: vi.fn(), post: vi.fn() };
  return { default: api, slowApi: { post: vi.fn() }, setupApiAuth: vi.fn() };
});

let api;
let setupApiAuth;
let useAuthStore;
let useGamificationStore;

beforeEach(async () => {
  vi.resetModules();
  localStorage.clear();

  ({ default: api, setupApiAuth } = await import('@/lib/api'));
  api.get.mockReset();
  api.post.mockReset();
  setupApiAuth.mockClear();

  ({ useAuthStore } = await import('./useAuthStore'));
  ({ useGamificationStore } = await import('./useGamificationStore'));
  useAuthStore.setState({
    user: null, accessToken: null, refreshToken: null, isAuthenticated: false,
  });
});

const USER = { id: 1, username: 'aziz', first_name: 'Aziz' };

describe('login', () => {
  it('stores the session', () => {
    useAuthStore.getState().login(USER, 'access-1', 'refresh-1');
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe('access-1');
    expect(state.refreshToken).toBe('refresh-1');
    expect(state.user).toEqual(USER);
  });

  it('clears whatever the previous account left behind', () => {
    // Signing in on a shared computer used to inherit the last student's XP.
    useGamificationStore.setState({ xp: 5000, level: 8 });
    useAuthStore.getState().login(USER, 'access-1', 'refresh-1');
    expect(useGamificationStore.getState().xp).toBe(0);
  });

  it('rewires the interceptors so the new token is the one sent', () => {
    useAuthStore.getState().login(USER, 'access-1', 'refresh-1');
    expect(setupApiAuth).toHaveBeenCalled();
    const [getAccess] = setupApiAuth.mock.calls.at(-1);
    expect(getAccess()).toBe('access-1');
  });
});

describe('setTokens', () => {
  it('a token means authenticated, no token means not', () => {
    useAuthStore.getState().setTokens('a', 'r');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().setTokens(null, null);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('the refresh callback keeps the old refresh token when none is sent', () => {
    useAuthStore.getState().login(USER, 'access-1', 'refresh-1');
    const onTokenRefresh = setupApiAuth.mock.calls.at(-1)[3];

    onTokenRefresh('access-2', undefined);
    expect(useAuthStore.getState().accessToken).toBe('access-2');
    expect(useAuthStore.getState().refreshToken).toBe('refresh-1');
  });

  it('the refresh callback stores a rotated refresh token', () => {
    // The server runs ROTATE_REFRESH_TOKENS with BLACKLIST_AFTER_ROTATION, so
    // dropping the new one guarantees a forced logout about an hour later.
    useAuthStore.getState().login(USER, 'access-1', 'refresh-1');
    const onTokenRefresh = setupApiAuth.mock.calls.at(-1)[3];

    onTokenRefresh('access-2', 'refresh-2');
    expect(useAuthStore.getState().refreshToken).toBe('refresh-2');
  });

  it('the callback is wired on module load, not only on login', async () => {
    // A page reload restores persisted tokens without calling login(). The old
    // version passed three arguments here, leaving this a no-op, so every
    // reload threw the rotated token away.
    vi.resetModules();
    setupApiAuth.mockClear();
    await import('./useAuthStore');
    expect(setupApiAuth).toHaveBeenCalled();
    expect(setupApiAuth.mock.calls.at(-1)).toHaveLength(4);
    expect(typeof setupApiAuth.mock.calls.at(-1)[3]).toBe('function');
  });
});

describe('logout', () => {
  it('asks the server to blacklist the refresh token', () => {
    // Without this the token stayed valid for its full seven days after the
    // user pressed "log out".
    useAuthStore.getState().login(USER, 'access-1', 'refresh-1');
    api.post.mockResolvedValue({ data: {} });

    useAuthStore.getState().logout();
    expect(api.post).toHaveBeenCalledWith('/auth/logout/', { refresh: 'refresh-1' });
  });

  it('clears the session even if that call fails', () => {
    useAuthStore.getState().login(USER, 'access-1', 'refresh-1');
    api.post.mockRejectedValue(new Error('offline'));

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('empties the other stores so nothing is left for the next user', () => {
    api.post.mockResolvedValue({ data: {} });
    useAuthStore.getState().login(USER, 'access-1', 'refresh-1');
    useGamificationStore.setState({ xp: 900, level: 4 });

    useAuthStore.getState().logout();
    expect(useGamificationStore.getState().xp).toBe(0);
    expect(useGamificationStore.getState().level).toBe(1);
  });

  it('does not call the server when there is nothing to blacklist', () => {
    useAuthStore.getState().logout();
    expect(api.post).not.toHaveBeenCalled();
  });
});

describe('fetchMe', () => {
  beforeEach(() => {
    useAuthStore.getState().login(USER, 'access-1', 'refresh-1');
    api.post.mockResolvedValue({ data: {} });
  });

  it('merges the server copy of the user', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/auth/me/') return Promise.resolve({ data: { first_name: 'Azizbek' } });
      return Promise.resolve({ data: {} });
    });

    await expect(useAuthStore.getState().fetchMe()).resolves.toBe(true);
    expect(useAuthStore.getState().user.first_name).toBe('Azizbek');
    expect(useAuthStore.getState().user.username).toBe('aziz');
  });

  it('pulls the gamification totals from the server', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/gamification/profile/') {
        return Promise.resolve({ data: { xp: 350, level: 2, fuel: 80 } });
      }
      return Promise.resolve({ data: {} });
    });

    await useAuthStore.getState().fetchMe();
    expect(useGamificationStore.getState().xp).toBe(350);
    expect(useGamificationStore.getState().level).toBe(2);
  });

  it('a 401 ends the session', async () => {
    api.get.mockRejectedValue({ response: { status: 401 } });
    await expect(useAuthStore.getState().fetchMe()).resolves.toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('a 502 does not', async () => {
    // This used to catch everything, so one flaky request or a cold-starting
    // backend signed the user out.
    api.get.mockRejectedValue({ response: { status: 502 } });
    await expect(useAuthStore.getState().fetchMe()).resolves.toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('a network error with no response does not either', async () => {
    api.get.mockRejectedValue(new Error('Network Error'));
    await useAuthStore.getState().fetchMe();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('a failing side request does not fail the whole call', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/auth/me/') return Promise.resolve({ data: { id: 1 } });
      return Promise.reject(new Error('gamification is down'));
    });
    await expect(useAuthStore.getState().fetchMe()).resolves.toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});

describe('updateUser', () => {
  it('merges rather than replaces', () => {
    useAuthStore.getState().login(USER, 'a', 'r');
    useAuthStore.getState().updateUser({ first_name: 'Azizbek' });
    expect(useAuthStore.getState().user).toEqual({ ...USER, first_name: 'Azizbek' });
  });
});
