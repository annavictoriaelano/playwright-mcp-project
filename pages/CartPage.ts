import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class CartPage extends BasePage {
  // Selectors
  private pageTitle = '.title';
  private cartItem = '.cart_item';
  private cartItemName = '.inventory_item_name';
  private cartItemDescription = '.inventory_item_desc';
  private cartItemPrice = '.inventory_item_price';
  private cartQuantity = '.cart_quantity';
  private removeButton = '[data-test^="remove"]';
  private continueShoppingButton = '[data-test="continue-shopping"]';
  private checkoutButton = '[data-test="checkout"]';
  private cartBadge = '.shopping_cart_badge';

  constructor(page: Page) {
    super(page);
  }

  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  async getCartItemCount(): Promise<number> {
    const items = await this.page.$$(this.cartItem);
    return items.length;
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.page.$$eval(this.cartItemName, elements => 
      elements.map(el => el.textContent?.trim() || '')
    );
  }

  async getCartItemDescriptions(): Promise<string[]> {
    return await this.page.$$eval(this.cartItemDescription, elements => 
      elements.map(el => el.textContent?.trim() || '')
    );
  }

  async getCartItemPrices(): Promise<string[]> {
    return await this.page.$$eval(this.cartItemPrice, elements => 
      elements.map(el => el.textContent?.trim() || '')
    );
  }

  async getCartItemQuantities(): Promise<string[]> {
    return await this.page.$$eval(this.cartQuantity, elements => 
      elements.map(el => el.textContent?.trim() || '')
    );
  }

  async isRemoveButtonVisible(index: number = 0): Promise<boolean> {
    const buttons = await this.page.$$(this.removeButton);
    return buttons.length > index && await buttons[index].isVisible();
  }

  async isContinueShoppingButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.continueShoppingButton);
  }

  async isCheckoutButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.checkoutButton);
  }

  async removeItem(index: number = 0): Promise<void> {
    const buttons = await this.page.$$(this.removeButton);
    await buttons[index].click();
  }

  async removeItemByProductName(productName: string): Promise<void> {
    const productId = productName.toLowerCase().replace(/\s+/g, '-');
    await this.click(`[data-test="remove-${productId}"]`);
  }

  async clickContinueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }

  async clickCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  async getCartBadgeCount(): Promise<number> {
    const isVisible = await this.isVisible(this.cartBadge);
    if (!isVisible) return 0;
    const text = await this.getText(this.cartBadge);
    return parseInt(text) || 0;
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.isVisible(this.cartBadge);
  }

  async isCartEmpty(): Promise<boolean> {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }
}
