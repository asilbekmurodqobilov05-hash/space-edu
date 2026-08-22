/**
 * Regression tests for the gamification store.
 *
 * Findings (22 Aug 2026 audit):
 *  - addXp / addFuel / addRewards each POSTed to /gamification/grant/, letting
 *    the browser tell the server how much to award. One request produced level
 *    101. That endpoint no longer exists.
 *  - syncFromAPI kept whichever value was HIGHER, so anything inflated locally
 *    survived every sync and could never be corrected — an offline faucet on
 *    top of the network one.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const post = vi.fn();
const get = vi.fn();

vi.mock('@/lib/api', () => ({
  default: { post, get },
  slowApi: { post: vi.fn() },
  setupApiAuth: vi.fn(),
}));

const { useGamificationStore } = await import('./useGamificationStore');

const initial = useGamificationStore.getState();

describe('the store never tells the server what to award', () => {
  beforeEach(() => {
    post.mockClear();
    get.mockClear();
    useGamificationStore.setState({ xp: 0, level: 1, fuel: 100 }, false);
  });

  it('addXp does not call the API', () => {
    useGamificationStore.getState().addXp(500);
    expect(post).not.toHaveBeenCalled();
  });

  it('addFuel does not call the API', () => {
    useGamificationStore.getState().addFuel(50);
    expect(post).not.toHaveBeenCalled();
  });

  it('addRewards does not call the API', () => {
    useGamificationStore.getState().addRewards(500, 50);
    expect(post).not.toHaveBeenCalled();
  });

  it('nothing in the store posts to the removed grant endpoint', () => {
    const store = useGamificationStore.getState();
    ['addXp', 'addFuel', 'checkStreak', 'checkBadges'].forEach((fn) => {
      if (typeof store[fn] === 'function') store[fn](10);
    });
    const grantCalls = post.mock.calls.filter(([url]) => String(url).includes('grant'));
    expect(grantCalls).toEqual([]);
  });
});

describe('the server wins on sync', () => {
  beforeEach(() => {
    useGamificationStore.setState({ xp: 999999, level: 101, fuel: 1000 }, false);
  });

  it('a lower server value overwrites an inflated local one', () => {
    // Was Math.max(local, server), which made any local inflation permanent.
    useGamificationStore.getState().syncFromAPI({ xp: 450, level: 3, fuel: 60 });
    const s = useGamificationStore.getState();
    expect(s.xp).toBe(450);
    expect(s.level).toBe(3);
    expect(s.fuel).toBe(60);
  });

  it('a missing field leaves the current value alone', () => {
    useGamificationStore.setState({ xp: 100, level: 2, fuel: 50 }, false);
    useGamificationStore.getState().syncFromAPI({ xp: 200 });
    const s = useGamificationStore.getState();
    expect(s.xp).toBe(200);
    expect(s.level).toBe(2);
    expect(s.fuel).toBe(50);
  });

  it('zero from the server is respected, not treated as absent', () => {
    useGamificationStore.getState().syncFromAPI({ xp: 0, level: 1, fuel: 0 });
    expect(useGamificationStore.getState().xp).toBe(0);
    expect(useGamificationStore.getState().fuel).toBe(0);
  });
});

describe('pullFromServer', () => {
  beforeEach(() => {
    get.mockReset();
    useGamificationStore.setState({ xp: 5, level: 1, fuel: 10 }, false);
  });

  it('applies the profile the server returns', async () => {
    get.mockResolvedValueOnce({ data: { xp: 450, level: 3, fuel: 200 } });
    await useGamificationStore.getState().pullFromServer();
    expect(get).toHaveBeenCalledWith('/gamification/profile/');
    expect(useGamificationStore.getState().xp).toBe(450);
  });

  it('leaves state untouched when the request fails', async () => {
    get.mockRejectedValueOnce(new Error('offline'));
    await expect(useGamificationStore.getState().pullFromServer()).resolves.toBeNull();
    expect(useGamificationStore.getState().xp).toBe(5);
  });
});

describe('local arithmetic stays sane', () => {
  beforeEach(() => {
    useGamificationStore.setState({ xp: 0, level: 1, fuel: 100 }, false);
  });

  it('fuel is capped', () => {
    useGamificationStore.getState().addFuel(99999);
    expect(useGamificationStore.getState().fuel).toBeLessThanOrEqual(1000);
  });

  it('spendFuel refuses to go negative', () => {
    useGamificationStore.setState({ fuel: 30 }, false);
    expect(useGamificationStore.getState().spendFuel(50)).toBe(false);
    expect(useGamificationStore.getState().fuel).toBe(30);
  });

  it('the level formula matches the server', () => {
    // Server: floor(sqrt(xp / 100)) + 1
    useGamificationStore.getState().addXp(450);
    expect(useGamificationStore.getState().level).toBe(Math.floor(Math.sqrt(450 / 100)) + 1);
  });

  it('reset restores the initial shape', () => {
    useGamificationStore.getState().addXp(1000);
    useGamificationStore.getState().reset();
    expect(useGamificationStore.getState().xp).toBe(initial.xp);
    expect(useGamificationStore.getState().level).toBe(initial.level);
  });
});
