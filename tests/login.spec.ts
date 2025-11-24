import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Login Tests', () => {
  
  test('M_Login_TC01: User can login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    // Navigate to login page
    await loginPage.navigateToLogin();

    // Perform login with valid credentials
    await loginPage.login('standard_user', 'secret_sauce');

    // Verify successful login - Products page should be visible
    await expect(page).toHaveURL(/.*inventory.html/);
    expect(await productsPage.isProductsPageVisible()).toBeTruthy();
    expect(await productsPage.getPageTitle()).toBe('Products');
  });

});