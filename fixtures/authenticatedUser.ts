import { test as base, expect, type Page } from '@playwright/test';

/**
 * Custom Playwright fixtures.
 *
 * A fixture is a named piece of test setup/teardown that Playwright resolves
 * before a test runs and cleans up after it finishes. Fixtures can depend on
 * each other — here, `cartWithItems` depends on `authenticatedUser`, so any
 * test that asks for a cart automatically gets a logged-in page too.
 *
 * Usage:
 *   import { test, expect } from '../fixtures/authenticatedUser';
 *
 *   test('shows cart', async ({ cartWithItems }) => {
 *     await expect(cartWithItems.getByText('Checkout')).toBeVisible();
 *   });
 */

type Fixtures = {
  authenticatedUser: Page;
  cartWithItems: Page;
};

export const test = base.extend<Fixtures>({
  /**
   * Logs a user in, then hands the authenticated page to the test.
   * On teardown, clears storage so the next test starts clean.
   */
  authenticatedUser: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('correct-horse-battery-staple');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    // Yield the logged-in page to the test.
    await use(page);

    // Teardown: wipe storage so residual auth state doesn't leak.
    await page.context().clearCookies();
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  },

  /**
   * Builds on authenticatedUser: adds two items to the cart and hands the
   * page back with the cart populated.
   */
  cartWithItems: async ({ authenticatedUser }, use) => {
    const page = authenticatedUser;
    await page.goto('/products');
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.getByRole('button', { name: 'Add to cart' }).nth(1).click();
    await page.goto('/cart');

    await use(page);
  },
});

export { expect };
