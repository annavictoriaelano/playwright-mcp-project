import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('M01_TS01: Login Tests', () => {
  
  test('M01_TS01_TC01: User can login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory.html/);
    expect(await productsPage.isProductsPageVisible()).toBeTruthy();
    expect(await productsPage.getPageTitle()).toBe('Products');
  });

  test('M01_TS01_TC02: User cannot sign in with invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('invalid_user', 'secret_sauce');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('M01_TS01_TC03: User cannot sign in with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'wrong_password');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('M01_TS01_TC04: User cannot sign in with empty username field', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('', 'secret_sauce');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });

  test('M01_TS01_TC05: User cannot sign in with empty password field', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', '');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Password is required');
  });

  test('M01_TS01_TC06: User cannot sign in with both fields empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('', '');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });

  test('M01_TS01_TC07: Error message displays for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('invalid_user', 'invalid_password');

    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Username and password do not match');
  });

  test('M01_TS01_TC08: Error message displays for locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('locked_out_user', 'secret_sauce');

    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Sorry, this user has been locked out');
  });

  test('M01_TS01_TC10: Error message can be dismissed by clicking the X button', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('invalid_user', 'secret_sauce');
    
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    
    await loginPage.dismissErrorMessage();
    
    // Verify the error button (X) is no longer visible after dismissal
    await expect(page.locator('.error-button')).not.toBeVisible();
  });

});