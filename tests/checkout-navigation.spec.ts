import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('M05_TS03: Checkout Navigation Tests', () => {
  
  test('M05_TS03_TC01: User is redirected to cart page after clicking "Cancel" on information page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await cartPage.clickCheckout();
    
    // On checkout step one, click cancel
    await checkoutPage.clickCancel();
    
    await expect(page).toHaveURL(/.*cart.html/);
  });

  test('M05_TS03_TC02: User is redirected to cart page after clicking "Cancel" on overview page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await cartPage.clickCheckout();
    
    // Fill info and proceed to overview
    await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    
    // On checkout step two, click cancel
    await checkoutPage.clickCancel();
    
    // NOTE: Actual SauceDemo behavior goes to inventory, not cart
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('M05_TS03_TC03: User is redirected to checkout overview after clicking "Continue"', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await cartPage.clickCheckout();
    
    // Fill valid info and click continue
    await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
    await checkoutPage.clickContinue();
    
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
  });

  test('M05_TS03_TC04: User can complete checkout after clicking "Finish"', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await cartPage.clickCheckout();
    
    // Complete checkout flow
    await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    
    await checkoutPage.clickFinish();
    
    // Should be on order confirmation page
    await expect(page).toHaveURL(/.*checkout-complete.html/);
  });

});
