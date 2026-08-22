/**
 * Regression tests for the API client.
 *
 * Finding (22 Aug 2026 audit): the backend runs ROTATE_REFRESH_TOKENS with
 * BLACKLIST_AFTER_ROTATION, so a refresh response carries a NEW refresh token
 * and blacklists the one just used. The interceptor read only `data.access` and
 * discarded `data.refresh`, so the second refresh went out with a dead token
 * and every user was forced back to /login roughly an hour after signing in.
 */
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import api, { setupApiAuth, slowApi } from './api';

vi.mock('axios', async () => {
  const actual = await vi.importActual('axios');
  return { ...actual, default: { ...actual.default, post: vi.fn() } };
});

describe('token refresh', () => {
  let tokens;
  let onLogout;

  beforeEach(() => {
    tokens = { access: 'access-1', refresh: 'refresh-1' };
    onLogout = vi.fn();
    setupApiAuth(
      () => tokens.access,
      () => tokens.refresh,
      onLogout,
      (newAccess, newRefresh) => {
        tokens.access = newAccess;
        if (newRefresh) tokens.refresh = newRefresh;
      },
    );
  });

  function reject401() {
    return Promise.reject({
      response: { status: 401 },
      config: { headers: {}, url: '/auth/me/', method: 'get' },
    });
  }

  /** Stub the transport. The interceptor retries with `api(config)`, which is
   *  the instance called as a function — spying on api.request never sees it. */
  function stubRetry() {
    const adapter = vi.fn().mockResolvedValue({
      data: {}, status: 200, statusText: 'OK', headers: {}, config: {},
    });
    api.defaults.adapter = adapter;
    return adapter;
  }

  async function runInterceptor() {
    const handler = api.interceptors.response.handlers.find(Boolean).rejected;
    const error = await reject401().catch((e) => e);
    return handler(error);
  }

  it('stores the rotated refresh token, not just the access token', async () => {
    axios.post.mockResolvedValueOnce({
      data: { access: 'access-2', refresh: 'refresh-2' },
    });
    stubRetry();

    await runInterceptor();

    expect(tokens.access).toBe('access-2');
    // The old refresh token is blacklisted server-side the moment it is used,
    // so failing to store the new one guarantees a forced logout next time.
    expect(tokens.refresh).toBe('refresh-2');
  });

  it('sends the refresh token it currently holds', async () => {
    axios.post.mockResolvedValueOnce({ data: { access: 'a2', refresh: 'r2' } });
    stubRetry();

    await runInterceptor();

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/token/refresh/'),
      { refresh: 'refresh-1' },
    );
  });

  it('logs out when the refresh itself is rejected', async () => {
    axios.post.mockRejectedValueOnce(new Error('token blacklisted'));

    await runInterceptor().catch(() => {});

    expect(onLogout).toHaveBeenCalled();
  });

  it('does not try to refresh when there is no refresh token', async () => {
    tokens.refresh = null;

    await runInterceptor().catch(() => {});

    expect(axios.post).not.toHaveBeenCalled();
  });
});

describe('slowApi', () => {
  it('waits longer than the shared client', () => {
    // The AI endpoint waits up to 20s on Gemini; the shared client gives up at
    // 10s, so every longer answer was discarded in the browser.
    expect(slowApi.defaults.timeout).toBeGreaterThan(api.defaults.timeout);
    expect(slowApi.defaults.timeout).toBeGreaterThanOrEqual(30000);
  });

  it('shares the same base URL', () => {
    expect(slowApi.defaults.baseURL).toBe(api.defaults.baseURL);
  });
});
