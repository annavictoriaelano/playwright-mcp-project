import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class ProductsPage extends BasePage {
  // Selectors
  private pageTitle = '.title';
  private productItem = '.inventory_item';
  private menuButton = '#react-burger-menu-btn';
  private logoutLink = '#logout_sidebar_link';

  constructor(page: Page) {
    super(page);
  }

  async getPageTitle(): Promise<string> {
    await this.waitForSelector(this.pageTitle);
    return await this.getText(this.pageTitle);
  }

  async isProductsPageVisible(): Promise<boolean> {
    return await this.isVisible(this.pageTitle);
  }

  async getProductCount(): Promise<number> {
    const products = await this.page.$$(this.productItem);
    return products.length;
  }

  async logout(): Promise<void> {
    await this.click(this.menuButton);
    await this.click(this.logoutLink);
  }
}