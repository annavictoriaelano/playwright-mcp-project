import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('M01_TS03: Session Management Tests', () => {
  
  test('M01_TS03_TC01: User remains logged in after browser refresh', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await expect(page).toHaveURL(/.*inventory.html/);
    expect(await productsPage.isProductsPageVisible()).toBeTruthy();
    
    // Refresh the page
    await page.reload();
    
    // Verify user is still on products page (session persists)
    await expect(page).toHaveURL(/.*inventory.html/);
    expect(await productsPage.isProductsPageVisible()).toBeTruthy();
  });

  test('M01_TS03_TC02: User session expires after logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    await productsPage.logout();
    
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // Try to navigate back using browser back button
    await page.goBack();
    
    // Should be redirected to login page or show error
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

});
