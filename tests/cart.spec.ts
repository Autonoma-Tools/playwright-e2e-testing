import { test, expect } from '../fixtures/authenticatedUser';

/**
 * Example consumer of the custom fixtures. The test body is pure assertion —
 * login and cart setup live in fixtures/authenticatedUser.ts.
 */
test('authenticated cart shows two items and a checkout button', async ({
  cartWithItems,
}) => {
  await expect(cartWithItems.getByRole('heading', { name: /cart/i })).toBeVisible();
  await expect(cartWithItems.getByTestId('cart-item')).toHaveCount(2);
  await expect(
    cartWithItems.getByRole('button', { name: /checkout/i }),
  ).toBeVisible();
});
