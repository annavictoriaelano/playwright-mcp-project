import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

test.describe('M04_TS02: Remove Items from Cart Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add multiple items to cart
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    await productsPage.addToCartByProductName('sauce-labs-bike-light');
    await productsPage.addToCartByProductName('sauce-labs-bolt-t-shirt');
    
    // Navigate to cart
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart.html/);
  });

  test('M04_TS02_TC01: User can remove an item from the cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBe(3);

    await cartPage.removeItem(0);

    const newCount = await cartPage.getCartItemCount();
    expect(newCount).toBe(2);
  });

  test('M04_TS02_TC02: Item is no longer displayed after removal', async ({ page }) => {
    const cartPage = new CartPage(page);

    const initialNames = await cartPage.getCartItemNames();
    const firstItemName = initialNames[0];

    await cartPage.removeItem(0);

    const remainingNames = await cartPage.getCartItemNames();
    expect(remainingNames).not.toContain(firstItemName);
  });

  test('M04_TS02_TC03: Cart badge count decreases after removing an item', async ({ page }) => {
    const cartPage = new CartPage(page);

    expect(await cartPage.getCartBadgeCount()).toBe(3);

    await cartPage.removeItem(0);

    expect(await cartPage.getCartBadgeCount()).toBe(2);
  });

  test('M04_TS02_TC04: User can remove all items from the cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    // Remove all 3 items
    await cartPage.removeItem(0);
    await cartPage.removeItem(0); // Index stays 0 as items shift up
    await cartPage.removeItem(0);

    expect(await cartPage.isCartEmpty()).toBeTruthy();
  });

  test('M04_TS02_TC05: Cart displays empty state when all items are removed', async ({ page }) => {
    const cartPage = new CartPage(page);

    // Remove all items
    await cartPage.removeItem(0);
    await cartPage.removeItem(0);
    await cartPage.removeItem(0);

    // Verify cart is empty
    expect(await cartPage.getCartItemCount()).toBe(0);
    
    // Verify cart badge is not visible or shows 0
    const badgeCount = await cartPage.getCartBadgeCount();
    expect(badgeCount).toBe(0);
  });

});
