import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * The same behaviour covered in tests/login.spec.ts, rewritten against the
 * LoginPage POM. Notice how the test body no longer contains any selectors —
 * if the form is restructured, only pages/LoginPage.ts changes.
 */
test.describe('login (via Page Object)', () => {
  test('happy path: valid credentials land on the dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('user@example.com', 'correct-horse-battery-staple');

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('error path: invalid credentials surface an error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('user@example.com', 'definitely-wrong');

    await expect(loginPage.errorMessage()).toBeVisible();
  });
});
