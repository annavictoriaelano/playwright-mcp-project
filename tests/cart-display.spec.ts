import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

test.describe('M04_TS01: Cart Display Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add items to cart before each test
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    await productsPage.addToCartByProductName('sauce-labs-bike-light');
    
    // Navigate to cart
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart.html/);
  });

  test('M04_TS01_TC01: All added items are displayed in the cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);
  });

  test('M04_TS01_TC02: Product name is displayed for each cart item', async ({ page }) => {
    const cartPage = new CartPage(page);

    const itemNames = await cartPage.getCartItemNames();
    expect(itemNames.length).toBe(2);
    expect(itemNames[0]).toBeTruthy();
    expect(itemNames[1]).toBeTruthy();
  });

  test('M04_TS01_TC03: Product description is displayed for each cart item', async ({ page }) => {
    const cartPage = new CartPage(page);

    const descriptions = await cartPage.getCartItemDescriptions();
    expect(descriptions.length).toBe(2);
    expect(descriptions[0]).toBeTruthy();
    expect(descriptions[1]).toBeTruthy();
  });

  test('M04_TS01_TC04: Product price is displayed for each cart item', async ({ page }) => {
    const cartPage = new CartPage(page);

    const prices = await cartPage.getCartItemPrices();
    expect(prices.length).toBe(2);
    
    // Verify prices contain dollar sign
    prices.forEach(price => {
      expect(price).toContain('$');
    });
  });

  test('M04_TS01_TC05: Quantity label is displayed for each cart item', async ({ page }) => {
    const cartPage = new CartPage(page);

    const quantities = await cartPage.getCartItemQuantities();
    expect(quantities.length).toBe(2);
    
    // Verify each quantity is "1"
    quantities.forEach(qty => {
      expect(qty).toBe('1');
    });
  });

  test('M04_TS01_TC06: "Remove" button is displayed for each cart item', async ({ page }) => {
    const cartPage = new CartPage(page);

    expect(await cartPage.isRemoveButtonVisible(0)).toBeTruthy();
    expect(await cartPage.isRemoveButtonVisible(1)).toBeTruthy();
  });

  test('M04_TS01_TC07: "Continue Shopping" button is displayed', async ({ page }) => {
    const cartPage = new CartPage(page);

    expect(await cartPage.isContinueShoppingButtonVisible()).toBeTruthy();
  });

  test('M04_TS01_TC08: "Checkout" button is displayed', async ({ page }) => {
    const cartPage = new CartPage(page);

    expect(await cartPage.isCheckoutButtonVisible()).toBeTruthy();
  });

});
