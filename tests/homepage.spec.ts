import { test, expect } from '@playwright/test';

/**
 * Your first Playwright test.
 *
 * Prerequisites: your app is running on http://localhost:3000
 * (or DEPLOYMENT_URL is set to a deployed URL in playwright.config.ts).
 *
 * Run it:
 *   npx playwright test tests/homepage.spec.ts
 *
 * Run it in UI mode (recommended while authoring):
 *   npx playwright test tests/homepage.spec.ts --ui
 */
test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    // baseURL comes from playwright.config.ts, so '/' resolves to the app root.
    await page.goto('/');
  });

  test('loads with the correct page title', async ({ page }) => {
    // toHaveTitle accepts a regex — resilient to suffixes like " | Autonoma".
    await expect(page).toHaveTitle(/.+/);
  });

  test('renders the primary navigation', async ({ page }) => {
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });

  test('renders the hero heading', async ({ page }) => {
    // Prefer role-based locators over CSS — they test what users actually see.
    const hero = page.getByRole('heading', { level: 1 });
    await expect(hero).toBeVisible();
  });

  /**
   * Example of what a *failing* test looks like. We're asserting against an
   * element that does not exist, so Playwright will wait up to the default
   * timeout, then fail with a clear "locator resolved to 0 elements" message.
   *
   * Remove .skip to see the failure report + trace locally.
   */
  test.skip('what a failing assertion looks like', async ({ page }) => {
    const missing = page.getByRole('heading', {
      name: 'definitely-not-on-this-page',
    });
    await expect(missing).toBeVisible();
  });
});
