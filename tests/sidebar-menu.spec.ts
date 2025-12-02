import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { NavigationPage } from '../pages/NavigationPage';

test.describe('M07_TS02: Sidebar Menu Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('M07_TS02_TC01: Menu opens after clicking hamburger icon', async ({ page }) => {
    const navigationPage = new NavigationPage(page);

    await navigationPage.openMenu();

    expect(await navigationPage.isMenuOpen()).toBeTruthy();
  });

  test('M07_TS02_TC07: Menu closes after clicking the close button (X)', async ({ page }) => {
    const navigationPage = new NavigationPage(page);

    // Open menu
    await navigationPage.openMenu();
    expect(await navigationPage.isMenuOpen()).toBeTruthy();

    // Close menu
    await navigationPage.closeMenu();

    // Wait for the menu to be fully closed
    // The menu should not be visible anymore after closing
    await page.waitForSelector('.bm-menu', { state: 'hidden', timeout: 3000 });
    
    // Double check: try to open menu again (only works if it's fully closed)
    await navigationPage.openMenu();
    expect(await navigationPage.isMenuOpen()).toBeTruthy();
  });

  test('M07_TS02_TC08: User is redirected to inventory page after clicking "All Items"', async ({ page }) => {
    const navigationPage = new NavigationPage(page);
    const productsPage = new ProductsPage(page);

    // Navigate away from inventory first
    await productsPage.clickProductImage(0);
    await expect(page).toHaveURL(/.*inventory-item.html/);

    // Open menu and click All Items
    await navigationPage.openMenu();
    await navigationPage.clickAllItems();

    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('M07_TS02_TC09: User is redirected to about page after clicking "About"', async ({ page }) => {
    const navigationPage = new NavigationPage(page);

    await navigationPage.openMenu();
    await navigationPage.clickAbout();

    // About link goes to saucelabs.com
    await expect(page).toHaveURL(/.*saucelabs.com.*/);
  });

  test('M07_TS02_TC10: User is logged out after clicking "Logout"', async ({ page }) => {
    const navigationPage = new NavigationPage(page);

    await navigationPage.openMenu();
    await navigationPage.clickLogout();

    // Should be redirected to login page
    await expect(page).toHaveURL(/.*\/(|index.html)$/);
  });

  test('M07_TS02_TC11: Cart is cleared after clicking "Reset App State"', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const navigationPage = new NavigationPage(page);

    // Add items to cart
    await productsPage.addToCartByProductName('sauce-labs-backpack');
    await productsPage.addToCartByProductName('sauce-labs-bike-light');
    expect(await navigationPage.getCartBadgeCount()).toBe(2);

    // Reset app state
    await navigationPage.openMenu();
    await navigationPage.clickResetAppState();

    // Cart should be empty
    expect(await navigationPage.getCartBadgeCount()).toBe(0);
  });

});
