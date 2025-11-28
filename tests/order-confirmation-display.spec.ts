import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';

test.describe('M06_TS01: Order Confirmation Display Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Complete full checkout flow
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await cartPage.clickCheckout();
    
    await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();
    
    await expect(page).toHaveURL(/.*checkout-complete.html/);
  });

  test('M06_TS01_TC01: Success message is displayed after completing checkout', async ({ page }) => {
    const orderConfirmationPage = new OrderConfirmationPage(page);

    expect(await orderConfirmationPage.isSuccessMessageVisible()).toBeTruthy();
    
    const message = await orderConfirmationPage.getSuccessMessage();
    expect(message).toBeTruthy();
    expect(message.length).toBeGreaterThan(0);
  });

  test('M06_TS01_TC03: Confirmation header text is displayed', async ({ page }) => {
    const orderConfirmationPage = new OrderConfirmationPage(page);

    expect(await orderConfirmationPage.isConfirmationHeaderVisible()).toBeTruthy();
    
    const header = await orderConfirmationPage.getConfirmationHeader();
    expect(header).toBeTruthy();
    // Common success messages include "Thank you" or "complete"
    expect(header.toLowerCase()).toMatch(/thank|complete/);
  });

  test('M06_TS01_TC04: Confirmation description text is displayed', async ({ page }) => {
    const orderConfirmationPage = new OrderConfirmationPage(page);

    expect(await orderConfirmationPage.isConfirmationDescriptionVisible()).toBeTruthy();
    
    const description = await orderConfirmationPage.getConfirmationDescription();
    expect(description).toBeTruthy();
    expect(description.length).toBeGreaterThan(0);
  });

  test('M06_TS01_TC05: "Back Home" button is displayed', async ({ page }) => {
    const orderConfirmationPage = new OrderConfirmationPage(page);

    expect(await orderConfirmationPage.isBackHomeButtonVisible()).toBeTruthy();
  });

});
