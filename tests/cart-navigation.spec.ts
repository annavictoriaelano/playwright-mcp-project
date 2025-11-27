import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

test.describe('M04_TS03: Cart Navigation Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add items to cart
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    await productsPage.addToCartByProductName('sauce-labs-bike-light');
    
    // Navigate to cart
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart.html/);
  });

  test('M04_TS03_TC01: User is redirected to inventory page after clicking "Continue Shopping"', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.clickContinueShopping();

    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('M04_TS03_TC02: User is redirected to checkout page after clicking "Checkout"', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.clickCheckout();

    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });

  test('M04_TS03_TC03: Cart state persists when navigating back from checkout', async ({ page }) => {
    const cartPage = new CartPage(page);

    // Remember cart count
    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBe(2);

    // Go to checkout
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // Navigate back to cart
    await page.goBack();
    await expect(page).toHaveURL(/.*cart.html/);

    // Verify cart still has same items
    const finalCount = await cartPage.getCartItemCount();
    expect(finalCount).toBe(initialCount);
  });

});
