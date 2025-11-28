import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class OrderConfirmationPage extends BasePage {
  // Selectors
  private completeHeader = '.complete-header';
  private completeText = '.complete-text';
  private ponyExpressImage = '.pony_express';
  private backHomeButton = '[data-test="back-to-products"]';
  private cartBadge = '.shopping_cart_badge';

  constructor(page: Page) {
    super(page);
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.completeHeader);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

  async isSuccessIconVisible(): Promise<boolean> {
    return await this.isVisible(this.ponyExpressImage);
  }

  async isConfirmationHeaderVisible(): Promise<boolean> {
    return await this.isVisible(this.completeHeader);
  }

  async getConfirmationHeader(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

  async isConfirmationDescriptionVisible(): Promise<boolean> {
    return await this.isVisible(this.completeText);
  }

  async getConfirmationDescription(): Promise<string> {
    return await this.getText(this.completeText);
  }

  async isBackHomeButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.backHomeButton);
  }

  async clickBackHome(): Promise<void> {
    await this.click(this.backHomeButton);
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
}
