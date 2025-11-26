import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  // Selectors
  private usernameInput = '#user-name';
  private passwordInput = '#password';
  private loginButton = '#login-button';
  private errorMessage = '.error-message-container';
  private errorCloseButton = '.error-button';

  constructor(page: Page) {
    super(page);
  }

  async navigateToLogin(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async dismissErrorMessage(): Promise<void> {
    await this.click(this.errorCloseButton);
  }
}