import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class CheckoutPage extends BasePage {
  // Checkout Step One Selectors (Information Entry)
  private firstNameInput = '[data-test="firstName"]';
  private lastNameInput = '[data-test="lastName"]';
  private postalCodeInput = '[data-test="postalCode"]';
  private cancelButton = '[data-test="cancel"]';
  private continueButton = '[data-test="continue"]';
  private errorMessage = '[data-test="error"]';
  private errorButton = '.error-button';

  // Checkout Step Two Selectors (Overview)
  private cartItem = '.cart_item';
  private cartItemName = '.inventory_item_name';
  private cartItemDescription = '.inventory_item_desc';
  private cartItemPrice = '.inventory_item_price';
  private cartQuantity = '.cart_quantity';
  private paymentInfo = '.summary_info_label:has-text("Payment Information")';
  private shippingInfo = '.summary_info_label:has-text("Shipping Information")';
  private subtotalLabel = '.summary_subtotal_label';
  private taxLabel = '.summary_tax_label';
  private totalLabel = '.summary_total_label';
  private finishButton = '[data-test="finish"]';

  constructor(page: Page) {
    super(page);
  }

  // Checkout Information Entry Methods
  async isFirstNameFieldVisible(): Promise<boolean> {
    return await this.isVisible(this.firstNameInput);
  }

  async isLastNameFieldVisible(): Promise<boolean> {
    return await this.isVisible(this.lastNameInput);
  }

  async isPostalCodeFieldVisible(): Promise<boolean> {
    return await this.isVisible(this.postalCodeInput);
  }

  async isCancelButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.cancelButton);
  }

  async isContinueButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.continueButton);
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.fill(this.lastNameInput, lastName);
  }

  async fillPostalCode(postalCode: string): Promise<void> {
    await this.fill(this.postalCodeInput, postalCode);
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
  }

  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async dismissErrorMessage(): Promise<void> {
    await this.click(this.errorButton);
  }

  // Checkout Overview Methods
  async getOverviewItemCount(): Promise<number> {
    const items = await this.page.$$(this.cartItem);
    return items.length;
  }

  async getOverviewItemNames(): Promise<string[]> {
    return await this.page.$$eval(this.cartItemName, elements => 
      elements.map(el => el.textContent?.trim() || '')
    );
  }

  async getOverviewItemDescriptions(): Promise<string[]> {
    return await this.page.$$eval(this.cartItemDescription, elements => 
      elements.map(el => el.textContent?.trim() || '')
    );
  }

  async getOverviewItemPrices(): Promise<string[]> {
    return await this.page.$$eval(this.cartItemPrice, elements => 
      elements.map(el => el.textContent?.trim() || '')
    );
  }

  async getOverviewItemQuantities(): Promise<string[]> {
    return await this.page.$$eval(this.cartQuantity, elements => 
      elements.map(el => el.textContent?.trim() || '')
    );
  }

  async isPaymentInfoVisible(): Promise<boolean> {
    return await this.isVisible(this.paymentInfo);
  }

  async isShippingInfoVisible(): Promise<boolean> {
    return await this.isVisible(this.shippingInfo);
  }

  async getSubtotal(): Promise<string> {
    return await this.getText(this.subtotalLabel);
  }

  async getTax(): Promise<string> {
    return await this.getText(this.taxLabel);
  }

  async getTotal(): Promise<string> {
    return await this.getText(this.totalLabel);
  }

  async calculateExpectedTotal(): Promise<number> {
    const subtotalText = await this.getSubtotal();
    const taxText = await this.getTax();
    
    // Extract numeric values (e.g., "Item total: $29.99" -> 29.99)
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    
    return subtotal + tax;
  }

  async getActualTotal(): Promise<number> {
    const totalText = await this.getTotal();
    // Extract numeric value (e.g., "Total: $32.39" -> 32.39)
    return parseFloat(totalText.replace(/[^0-9.]/g, ''));
  }

  async isFinishButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.finishButton);
  }

  async clickFinish(): Promise<void> {
    await this.click(this.finishButton);
  }
}
