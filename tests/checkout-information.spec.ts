import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('M05_TS01: Checkout Information Entry Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item to cart and go to checkout
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await cartPage.clickCheckout();
    
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });

  test('M05_TS01_TC01: First name field is displayed', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    expect(await checkoutPage.isFirstNameFieldVisible()).toBeTruthy();
  });

  test('M05_TS01_TC02: Last name field is displayed', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    expect(await checkoutPage.isLastNameFieldVisible()).toBeTruthy();
  });

  test('M05_TS01_TC03: Postal code field is displayed', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    expect(await checkoutPage.isPostalCodeFieldVisible()).toBeTruthy();
  });

  test('M05_TS01_TC04: "Cancel" button is displayed', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    expect(await checkoutPage.isCancelButtonVisible()).toBeTruthy();
  });

  test('M05_TS01_TC05: "Continue" button is displayed', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    expect(await checkoutPage.isContinueButtonVisible()).toBeTruthy();
  });

  test('M05_TS01_TC09: User cannot proceed with empty first name field', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Leave first name empty, fill other fields
    await checkoutPage.fillLastName('Doe');
    await checkoutPage.fillPostalCode('12345');
    await checkoutPage.clickContinue();

    // Should still be on checkout step one
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('M05_TS01_TC10: User cannot proceed with empty last name field', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Leave last name empty, fill other fields
    await checkoutPage.fillFirstName('John');
    await checkoutPage.fillPostalCode('12345');
    await checkoutPage.clickContinue();

    // Should still be on checkout step one
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('M05_TS01_TC11: User cannot proceed with empty postal code field', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Leave postal code empty, fill other fields
    await checkoutPage.fillFirstName('John');
    await checkoutPage.fillLastName('Doe');
    await checkoutPage.clickContinue();

    // Should still be on checkout step one
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('M05_TS01_TC12: Error message displays when mandatory fields are empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Try to continue with empty fields
    await checkoutPage.clickContinue();

    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();
    
    const errorText = await checkoutPage.getErrorMessage();
    expect(errorText).toContain('Error');
  });

  test('M05_TS01_TC13: Error message can be dismissed by clicking the X button', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Trigger error
    await checkoutPage.clickContinue();
    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();

    // Dismiss error
    await checkoutPage.dismissErrorMessage();

    // Error button should disappear (similar to login error behavior)
    await expect(page.locator('.error-button')).not.toBeVisible();
  });

});
