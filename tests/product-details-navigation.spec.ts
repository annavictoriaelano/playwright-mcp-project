import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

test.describe('M03_TS03: Navigation from Product Details Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Navigate to first product details page
    await productsPage.clickProductImage(0);
    await expect(page).toHaveURL(/.*inventory-item.html/);
  });

  test('M03_TS03_TC01: User is redirected to inventory page after clicking "Back to products"', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    await productDetailsPage.clickBackToProducts();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('M03_TS03_TC02: User is redirected to cart page after clicking the shopping cart icon', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    await productDetailsPage.clickCartIcon();
    
    await expect(page).toHaveURL(/.*cart.html/);
  });

  test('M03_TS03_TC03: Cart badge count remains accurate when navigating back to inventory', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);
    const productsPage = new ProductsPage(page);

    // Add product to cart
    await productDetailsPage.addToCart();
    expect(await productDetailsPage.getCartBadgeCount()).toBe(1);

    // Navigate back to inventory
    await productDetailsPage.clickBackToProducts();
    await expect(page).toHaveURL(/.*inventory.html/);

    // Verify cart badge count persists
    expect(await productsPage.getCartBadgeCount()).toBe(1);
  });

  test('M03_TS03_TC04: User is taken to the top section of the product catalog after going back from the product page', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);
    const productsPage = new ProductsPage(page);

    // First, scroll down on the inventory page
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Navigate to a product
    await productsPage.clickProductImage(5); // Click a product further down
    await expect(page).toHaveURL(/.*inventory-item.html/);

    // Navigate back
    await productDetailsPage.clickBackToProducts();
    await expect(page).toHaveURL(/.*inventory.html/);

    // Verify user is at the top of the page (scroll position should be 0 or near 0)
    const scrollPosition = await productDetailsPage.getScrollPosition();
    expect(scrollPosition).toBeLessThan(100); // Allow small margin for page rendering
  });

});
