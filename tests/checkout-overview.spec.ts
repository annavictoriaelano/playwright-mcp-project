import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('M05_TS02: Checkout Overview Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add items to cart
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    await productsPage.addToCartByProductName('sauce-labs-bike-light');
    
    // Go through checkout
    await page.click('.shopping_cart_link');
    await cartPage.clickCheckout();
    
    // Fill checkout information
    await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
    await checkoutPage.clickContinue();
    
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
  });

  test('M05_TS02_TC01: All cart items are displayed on the overview page', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    const itemCount = await checkoutPage.getOverviewItemCount();
    expect(itemCount).toBe(2);
  });

  test('M05_TS02_TC02: Product name is displayed for each item', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    const itemNames = await checkoutPage.getOverviewItemNames();
    expect(itemNames.length).toBe(2);
    expect(itemNames[0]).toBeTruthy();
    expect(itemNames[1]).toBeTruthy();
  });

  test('M05_TS02_TC03: Product description is displayed for each item', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    const descriptions = await checkoutPage.getOverviewItemDescriptions();
    expect(descriptions.length).toBe(2);
    expect(descriptions[0]).toBeTruthy();
    expect(descriptions[1]).toBeTruthy();
  });

  test('M05_TS02_TC04: Product price is displayed for each item', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    const prices = await checkoutPage.getOverviewItemPrices();
    expect(prices.length).toBe(2);
    
    prices.forEach(price => {
      expect(price).toContain('$');
    });
  });

  test('M05_TS02_TC05: Quantity is displayed for each item', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    const quantities = await checkoutPage.getOverviewItemQuantities();
    expect(quantities.length).toBe(2);
    
    quantities.forEach(qty => {
      expect(qty).toBe('1');
    });
  });

  test('M05_TS02_TC08: Price total (excluding tax) is displayed', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    const subtotal = await checkoutPage.getSubtotal();
    expect(subtotal).toContain('Item total');
    expect(subtotal).toContain('$');
  });

  test('M05_TS02_TC09: Tax amount is displayed', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    const tax = await checkoutPage.getTax();
    expect(tax).toContain('Tax');
    expect(tax).toContain('$');
  });

  test('M05_TS02_TC10: Total price (including tax) is calculated correctly', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    const expectedTotal = await checkoutPage.calculateExpectedTotal();
    const actualTotal = await checkoutPage.getActualTotal();

    // Allow small floating point difference
    expect(Math.abs(expectedTotal - actualTotal)).toBeLessThan(0.01);
  });

  test('M05_TS02_TC11: "Cancel" button is displayed', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    expect(await checkoutPage.isCancelButtonVisible()).toBeTruthy();
  });

  test('M05_TS02_TC12: "Finish" button is displayed', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    expect(await checkoutPage.isFinishButtonVisible()).toBeTruthy();
  });

});
