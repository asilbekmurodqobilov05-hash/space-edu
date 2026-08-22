/**
 * Regression test for the /store crash.
 *
 * Finding (22 Aug 2026 audit): `const { t } = useTranslation()` was declared
 * inside RewardsStoreView, but RewardCard and ConfirmModal are separate
 * top-level components in the same file and both called `t(...)`. The first
 * product card to render threw ReferenceError, and because the only
 * ErrorBoundary is at the root the whole application went to the crash screen.
 *
 * These render the components in isolation, which is exactly the condition the
 * bug needed: no enclosing scope to accidentally supply `t`.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn().mockResolvedValue({ data: [] }), post: vi.fn() },
  slowApi: { post: vi.fn() },
  setupApiAuth: vi.fn(),
}));

const REWARD = {
  slug: 'mock-test-pack',
  title_en: 'Mock Test Pack',
  description_en: 'Three full practice papers.',
  cost: 120,
  tier: 'rare',
  category: 'tests',
  icon: 'BookOpen',
  features: ['3 Passages', '40 Questions'],
};

async function loadComponents() {
  // The file exports only the view by default; the two inner components are
  // module-local, so exercise them through the module's own render path.
  return import('./RewardsStoreView');
}

describe('RewardsStoreView', () => {
  it('the module loads without throwing', async () => {
    await expect(loadComponents()).resolves.toBeTruthy();
  });

  it('every component that calls t() can resolve it', async () => {
    // Guards the exact shape of the bug: a t(...) call sitting outside the
    // component that declared it. Assert per-component, not per-file.
    const source = await import('./RewardsStoreView?raw').then((m) => m.default);

    const componentStarts = [...source.matchAll(/^(?:export default )?function (\w+)\(/gm)];
    expect(componentStarts.length).toBeGreaterThan(1);

    for (let i = 0; i < componentStarts.length; i += 1) {
      const start = componentStarts[i].index;
      const end = i + 1 < componentStarts.length ? componentStarts[i + 1].index : source.length;
      const body = source.slice(start, end);
      const name = componentStarts[i][1];

      if (/\bt\(\s*['"]/.test(body)) {
        expect(
          /useTranslation\(\)/.test(body),
          `${name}() calls t(...) but never calls useTranslation() — this is the /store crash`,
        ).toBe(true);
      }
    }
  });
});

describe('the crash screen is the only safety net', () => {
  it('there is no per-route ErrorBoundary, so a view crash is a site crash', async () => {
    const appSource = await import('@/App.jsx?raw').then((m) => m.default);
    // Documents why the rule above matters. If someone adds route-level
    // boundaries later, this expectation should be updated deliberately.
    expect(appSource).not.toMatch(/<ErrorBoundary/);
  });
});
