import { test, expect } from '@playwright/test';

/**
 * Network mocking with page.route().
 *
 * Mocking lets you:
 *   - decouple UI tests from a real backend (faster, deterministic)
 *   - exercise error paths (500s, timeouts) that are hard to trigger live
 *   - assert the client sends the right request body
 *
 * Run: npx playwright test tests/api-mocking.spec.ts
 */
test.describe('API mocking', () => {
  test('renders products returned by a mocked GET /api/products', async ({ page }) => {
    // Intercept every request that matches the glob. Playwright routes
    // match the URL pattern AND the HTTP method used in .fulfill().
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'p_1', name: 'Mock Widget', priceCents: 1999 },
          { id: 'p_2', name: 'Mock Gadget', priceCents: 2999 },
        ]),
      });
    });

    await page.goto('/products');

    await expect(page.getByText('Mock Widget')).toBeVisible();
    await expect(page.getByText('Mock Gadget')).toBeVisible();
  });

  test('shows the error UI when POST /api/orders fails with 500', async ({ page }) => {
    await page.route('**/api/orders', async (route) => {
      // Only mock the POST. Let other methods (GET, etc.) pass through.
      if (route.request().method() !== 'POST') {
        await route.fallback();
        return;
      }

      // Inspect the outgoing request body — handy for assertions on what
      // the client sent, and for branching mock responses.
      const requestBody = route.request().postDataJSON();
      expect(requestBody).toHaveProperty('items');

      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'internal_server_error' }),
      });
    });

    await page.goto('/checkout');
    await page.getByRole('button', { name: /place order/i }).click();

    // The client should surface the failure without crashing.
    await expect(
      page.getByText(/something went wrong|try again/i),
    ).toBeVisible();
  });
});
