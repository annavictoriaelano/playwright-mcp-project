import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class ProductDetailsPage extends BasePage {
  // Selectors
  private productName = '.inventory_details_name';
  private productDescription = '.inventory_details_desc';
  private productPrice = '.inventory_details_price';
  private productImage = '.inventory_details_img';
  private addToCartButton = '[data-test^="add-to-cart"]';
  private removeButton = '[data-test^="remove"]';
  private backButton = '[data-test="back-to-products"]';
  private cartBadge = '.shopping_cart_badge';
  private cartIcon = '.shopping_cart_link';
  private footer = '.footer';
  private socialLinks = '.social a';
  private footerCopy = '.footer_copy';

  constructor(page: Page) {
    super(page);
  }

  async getProductName(): Promise<string> {
    return await this.getText(this.productName);
  }

  async getProductDescription(): Promise<string> {
    return await this.getText(this.productDescription);
  }

  async getProductPrice(): Promise<string> {
    return await this.getText(this.productPrice);
  }

  async isProductImageVisible(): Promise<boolean> {
    return await this.isVisible(this.productImage);
  }

  async isAddToCartButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.addToCartButton);
  }

  async isBackButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.backButton);
  }

  async addToCart(): Promise<void> {
    await this.click(this.addToCartButton);
  }

  async removeFromCart(): Promise<void> {
    await this.click(this.removeButton);
  }

  async isRemoveButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.removeButton);
  }

  async getCartBadgeCount(): Promise<number> {
    const isVisible = await this.isVisible(this.cartBadge);
    if (!isVisible) return 0;
    const text = await this.getText(this.cartBadge);
    return parseInt(text) || 0;
  }

  async clickBackToProducts(): Promise<void> {
    await this.click(this.backButton);
  }

  async clickCartIcon(): Promise<void> {
    await this.click(this.cartIcon);
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.isVisible(this.cartBadge);
  }

  // Footer Methods
  async isFooterVisible(): Promise<boolean> {
    return await this.isVisible(this.footer);
  }

  async getSocialLinksCount(): Promise<number> {
    const links = await this.page.$$(this.socialLinks);
    return links.length;
  }

  async getSocialLinkHref(index: number): Promise<string> {
    const links = await this.page.$$(this.socialLinks);
    return await links[index].getAttribute('href') || '';
  }

  async getFooterCopyright(): Promise<string> {
    return await this.getText(this.footerCopy);
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async getScrollPosition(): Promise<number> {
    return await this.page.evaluate(() => window.scrollY);
  }
}
