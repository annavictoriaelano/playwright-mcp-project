import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('M01_TS02: Logout Tests', () => {
  
  test('M01_TS02_TC01: User can successfully log out from the application', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    await productsPage.logout();
    
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('M01_TS02_TC02: User is redirected to login page after logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    await productsPage.logout();
    
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('M01_TS02_TC03: User cannot access inventory page after logout without re-authentication', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    await productsPage.logout();
    
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // Try to access inventory page directly after logout
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    // Should be redirected back to login or show error
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('.error-message-container')).toBeVisible();
  });

});
