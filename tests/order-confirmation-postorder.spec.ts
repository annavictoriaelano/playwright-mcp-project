import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';

test.describe('M06_TS02: Post-Order State Tests', () => {
  
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

  test('M06_TS02_TC01: User is redirected to inventory page after clicking "Back Home"', async ({ page }) => {
    const orderConfirmationPage = new OrderConfirmationPage(page);

    await orderConfirmationPage.clickBackHome();

    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('M06_TS02_TC02: Shopping cart is empty after order completion', async ({ page }) => {
    const orderConfirmationPage = new OrderConfirmationPage(page);
    const cartPage = new CartPage(page);

    // Navigate to cart to verify it's empty
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart.html/);

    expect(await cartPage.isCartEmpty()).toBeTruthy();
  });

  test('M06_TS02_TC03: Cart badge displays zero or is hidden after order completion', async ({ page }) => {
    const orderConfirmationPage = new OrderConfirmationPage(page);

    // Cart badge should either not be visible or show 0
    const badgeCount = await orderConfirmationPage.getCartBadgeCount();
    expect(badgeCount).toBe(0);
  });

});
