import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

test.describe('M03_TS02: Add to Cart from Product Details Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Navigate to first product details page
    await productsPage.clickProductImage(0);
    await expect(page).toHaveURL(/.*inventory-item.html/);
  });

  test('M03_TS02_TC01: User can add product to cart from the product details page', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    await productDetailsPage.addToCart();
    
    expect(await productDetailsPage.isCartBadgeVisible()).toBeTruthy();
    expect(await productDetailsPage.getCartBadgeCount()).toBe(1);
  });

  test('M03_TS02_TC02: Button text changes to "Remove" after adding product to cart', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    expect(await productDetailsPage.isAddToCartButtonVisible()).toBeTruthy();
    
    await productDetailsPage.addToCart();
    
    expect(await productDetailsPage.isRemoveButtonVisible()).toBeTruthy();
  });

  test('M03_TS02_TC03: Shopping cart badge displays correct count after adding product', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    const initialCount = await productDetailsPage.getCartBadgeCount();
    expect(initialCount).toBe(0);

    await productDetailsPage.addToCart();
    
    expect(await productDetailsPage.getCartBadgeCount()).toBe(1);
  });

  test('M03_TS02_TC04: User can remove product from cart using "Remove" button on details page', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    // First add the product
    await productDetailsPage.addToCart();
    expect(await productDetailsPage.getCartBadgeCount()).toBe(1);

    // Then remove it
    await productDetailsPage.removeFromCart();
    
    expect(await productDetailsPage.getCartBadgeCount()).toBe(0);
    expect(await productDetailsPage.isAddToCartButtonVisible()).toBeTruthy();
  });

});
