import { test, expect } from '@playwright/test';

/**
 * End-to-end coverage for the login form at /login.
 *
 * Assumes the form exposes:
 *   - <label>Email</label>    <input type="email" />
 *   - <label>Password</label> <input type="password" />
 *   - <button type="submit">Sign in</button>
 * and that after successful login the dashboard renders an <h1>Dashboard</h1>.
 *
 * Run it:
 *   npx playwright test tests/login.spec.ts
 */
test.describe('login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('happy path: valid credentials land on the dashboard', async ({ page }) => {
    // getByLabel matches the accessible label of the input — the same thing
    // a screen reader would announce — which makes the test resilient to
    // CSS refactors and class renames.
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('correct-horse-battery-staple');

    await page.getByRole('button', { name: 'Sign in' }).click();

    // After login, we should be on /dashboard and see the dashboard heading.
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('error path: invalid credentials surface an error message', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('definitely-wrong');

    await page.getByRole('button', { name: 'Sign in' }).click();

    // The app should keep us on /login and render an inline error.
    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByText(/invalid (email|credentials|password)/i),
    ).toBeVisible();
  });
});
