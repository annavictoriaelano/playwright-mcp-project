import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

test.describe('M03_TS01: Product Information Display Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Navigate to first product details page
    await productsPage.clickProductImage(0);
    await expect(page).toHaveURL(/.*inventory-item.html/);
  });

  test('M03_TS01_TC01: Product name is displayed on the details page', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    const productName = await productDetailsPage.getProductName();
    expect(productName).toBeTruthy();
    expect(productName.length).toBeGreaterThan(0);
  });

  test('M03_TS01_TC02: Product description is displayed on the details page', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    const description = await productDetailsPage.getProductDescription();
    expect(description).toBeTruthy();
    expect(description.length).toBeGreaterThan(0);
  });

  test('M03_TS01_TC03: Product price is displayed on the details page', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    const price = await productDetailsPage.getProductPrice();
    expect(price).toContain('$');
    expect(parseFloat(price.replace('$', ''))).toBeGreaterThan(0);
  });

  test('M03_TS01_TC05: "Add to cart" button is displayed on the details page', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    expect(await productDetailsPage.isAddToCartButtonVisible()).toBeTruthy();
  });

  test('M03_TS01_TC06: "Back to products" button is displayed on the details page', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    expect(await productDetailsPage.isBackButtonVisible()).toBeTruthy();
  });

  test('M03_TS01_TC07: Footer is displayed at the bottom of the page', async ({ page }) => {
    const productDetailsPage = new ProductDetailsPage(page);

    // Verify footer is visible
    expect(await productDetailsPage.isFooterVisible()).toBeTruthy();
    
    // Verify social media links are present
    const socialLinksCount = await productDetailsPage.getSocialLinksCount();
    expect(socialLinksCount).toBeGreaterThan(0);
    
    // Verify social links point to actual platforms
    for (let i = 0; i < socialLinksCount; i++) {
      const href = await productDetailsPage.getSocialLinkHref(i);
      expect(href).toBeTruthy();
      expect(href.length).toBeGreaterThan(0);
    }
    
    // Verify copyright text is present
    const copyright = await productDetailsPage.getFooterCopyright();
    expect(copyright).toBeTruthy();
    expect(copyright).toContain('©');
  });

});
