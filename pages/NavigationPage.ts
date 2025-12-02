import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class NavigationPage extends BasePage {
  // Header Selectors
  private appLogo = '.app_logo';
  private cartIcon = '.shopping_cart_link';
  private cartBadge = '.shopping_cart_badge';
  private hamburgerMenu = '#react-burger-menu-btn';

  // Sidebar Menu Selectors
  private sidebarMenu = '.bm-menu';
  private allItemsLink = '#inventory_sidebar_link';
  private aboutLink = '#about_sidebar_link';
  private logoutLink = '#logout_sidebar_link';
  private resetAppLink = '#reset_sidebar_link';
  private closeMenuButton = '#react-burger-cross-btn';

  // Footer Selectors
  private footer = '.footer';
  private socialLinks = '.social a';
  private twitterLink = '.social_twitter a';
  private facebookLink = '.social_facebook a';
  private linkedinLink = '.social_linkedin a';
  private footerCopy = '.footer_copy';

  constructor(page: Page) {
    super(page);
  }

  // Header Navigation Methods
  async isAppLogoVisible(): Promise<boolean> {
    return await this.isVisible(this.appLogo);
  }

  async isCartIconVisible(): Promise<boolean> {
    return await this.isVisible(this.cartIcon);
  }

  async isHamburgerMenuVisible(): Promise<boolean> {
    return await this.isVisible(this.hamburgerMenu);
  }

  async getCartBadgeCount(): Promise<number> {
    const isVisible = await this.isVisible(this.cartBadge);
    if (!isVisible) return 0;
    const text = await this.getText(this.cartBadge);
    return parseInt(text) || 0;
  }

  async clickCartIcon(): Promise<void> {
    await this.click(this.cartIcon);
  }

  // Sidebar Menu Methods
  async openMenu(): Promise<void> {
    await this.click(this.hamburgerMenu);
    // Wait for menu to be visible
    await this.waitForSelector(this.sidebarMenu);
  }

  async isMenuOpen(): Promise<boolean> {
    return await this.isVisible(this.sidebarMenu);
  }

  async isAllItemsLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.allItemsLink);
  }

  async isAboutLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.aboutLink);
  }

  async isLogoutLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.logoutLink);
  }

  async isResetAppLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.resetAppLink);
  }

  async isCloseButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.closeMenuButton);
  }

  async closeMenu(): Promise<void> {
    await this.click(this.closeMenuButton);
  }

  async clickAllItems(): Promise<void> {
    await this.click(this.allItemsLink);
  }

  async clickAbout(): Promise<void> {
    await this.click(this.aboutLink);
  }

  async clickLogout(): Promise<void> {
    await this.click(this.logoutLink);
  }

  async clickResetAppState(): Promise<void> {
    await this.click(this.resetAppLink);
  }

  // Footer Methods
  async isFooterVisible(): Promise<boolean> {
    return await this.isVisible(this.footer);
  }

  async getSocialLinksCount(): Promise<number> {
    const links = await this.page.$$(this.socialLinks);
    return links.length;
  }

  async isTwitterIconVisible(): Promise<boolean> {
    return await this.isVisible(this.twitterLink);
  }

  async isFacebookIconVisible(): Promise<boolean> {
    return await this.isVisible(this.facebookLink);
  }

  async isLinkedInIconVisible(): Promise<boolean> {
    return await this.isVisible(this.linkedinLink);
  }

  async isCopyrightTextVisible(): Promise<boolean> {
    return await this.isVisible(this.footerCopy);
  }

  async getCopyrightText(): Promise<string> {
    return await this.getText(this.footerCopy);
  }
}
