import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { NavigationPage } from '../pages/NavigationPage';

test.describe('M07_TS01: Header Navigation Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('M07_TS01_TC04: Shopping cart badge displays correct item count', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const navigationPage = new NavigationPage(page);

    // Initially no items
    expect(await navigationPage.getCartBadgeCount()).toBe(0);

    // Add items
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    expect(await navigationPage.getCartBadgeCount()).toBe(1);

    await productsPage.addToCartByProductName('sauce-labs-bike-light');
    expect(await navigationPage.getCartBadgeCount()).toBe(2);
  });

  test('M07_TS01_TC05: User is redirected to cart page after clicking cart icon', async ({ page }) => {
    const navigationPage = new NavigationPage(page);

    await navigationPage.clickCartIcon();

    await expect(page).toHaveURL(/.*cart.html/);
  });

});
