/**
 * Ticket F4, the market paging helper.
 *
 * `/market/items/` is a DRF ViewSet and paginates at 20. The old code read
 * `.results` and stopped, so item 21 onwards did not exist as far as the shop
 * was concerned. The fix walks `next` — and a paging loop is exactly the kind
 * of code that is fine until the day the catalogue crosses a page boundary, so
 * it gets its own tests rather than being covered by hand.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
  slowApi: { post: vi.fn() },
  setupApiAuth: vi.fn(),
}));

let api;
let fetchAllPages;

beforeEach(async () => {
  ({ default: api } = await import('@/lib/api'));
  api.get.mockReset();
  ({ fetchAllPages } = await import('./MarketView'));
});

const page = (results, next = null) => ({ data: { results, next } });

describe('fetchAllPages', () => {
  it('walks every page, not just the first', () => {
    api.get
      .mockResolvedValueOnce(page([1, 2], '/market/items/?page=2'))
      .mockResolvedValueOnce(page([3, 4], '/market/items/?page=3'))
      .mockResolvedValueOnce(page([5]));

    return expect(fetchAllPages('/market/items/')).resolves.toEqual([1, 2, 3, 4, 5]);
  });

  it('stops at the page that has no next', async () => {
    api.get.mockResolvedValue(page([1, 2]));
    await fetchAllPages('/market/items/');
    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('accepts a bare array, which is what the admin endpoints return', async () => {
    // The admin panel's responses are unpaginated by design — turning DRF
    // pagination on there empties every table silently.
    api.get.mockResolvedValue({ data: [7, 8, 9] });
    await expect(fetchAllPages('/market/items/')).resolves.toEqual([7, 8, 9]);
  });

  it('returns nothing rather than throwing on a response with no results key', async () => {
    api.get.mockResolvedValue({ data: {} });
    await expect(fetchAllPages('/market/items/')).resolves.toEqual([]);
  });

  it('handles an empty catalogue', async () => {
    api.get.mockResolvedValue(page([]));
    await expect(fetchAllPages('/market/items/')).resolves.toEqual([]);
  });

  it('refuses to follow next forever', async () => {
    // A server that always reports a next page would otherwise spin until the
    // tab dies. The cap is 50.
    api.get.mockResolvedValue(page([1], '/market/items/?page=99'));
    const items = await fetchAllPages('/market/items/');
    expect(api.get).toHaveBeenCalledTimes(50);
    expect(items).toHaveLength(50);
  });

  it('follows the url the server gives, not one it builds itself', async () => {
    api.get
      .mockResolvedValueOnce(page([1], 'https://api.example.invalid/market/items/?cursor=abc'))
      .mockResolvedValueOnce(page([2]));

    await fetchAllPages('/market/items/');
    expect(api.get).toHaveBeenNthCalledWith(
      2, 'https://api.example.invalid/market/items/?cursor=abc',
    );
  });
});
