import { test, expect, request as apiRequest } from '@playwright/test';

/**
 * Running the same spec against a preview deployment.
 *
 * The URL under test comes from DEPLOYMENT_URL (set by CI) with a local
 * fallback. Three patterns, each useful in a different situation:
 *
 *   1. Relative path + baseURL           — the ordinary case.
 *   2. Full URL built with `new URL()`   — deep links, canonical checks.
 *   3. API preflight with request.newContext() — fail fast if the deploy
 *      is dead before we spend seconds rendering the UI.
 */
const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL ?? 'http://localhost:3000';

test.describe('preview deployment smoke', () => {
  // Pattern 3: preflight. Runs once for the whole file. If the deploy can't
  // serve /api/health within a few seconds, fail every test in this file
  // immediately instead of timing out on UI waits.
  test.beforeAll(async () => {
    const ctx = await apiRequest.newContext({ baseURL: DEPLOYMENT_URL });
    const res = await ctx.get('/api/health', { timeout: 10_000 });
    expect(res.ok(), `health check failed: ${res.status()} from ${DEPLOYMENT_URL}`).toBe(true);
    await ctx.dispose();
  });

  test('pattern 1: relative path resolves against baseURL', async ({ page }) => {
    // page.goto('/') uses `use.baseURL` from playwright.config.ts, which in
    // turn reads DEPLOYMENT_URL. No string concatenation here — no off-by-one
    // bugs with trailing slashes.
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('pattern 2: full URL built with `new URL()` for deep links', async ({ page }) => {
    // `new URL(path, base).href` handles slash edge cases correctly, which
    // matters when DEPLOYMENT_URL does or doesn't end in /.
    const deepLink = new URL('/pricing?plan=pro', DEPLOYMENT_URL).href;

    await page.goto(deepLink);
    await expect(page).toHaveURL(/\/pricing/);
    await expect(page.getByRole('heading', { name: /pro/i })).toBeVisible();
  });
});
