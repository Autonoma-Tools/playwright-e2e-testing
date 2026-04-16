import type { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the login screen.
 *
 * A Page Object wraps a page's selectors and interactions behind a small API.
 * Tests become declarative ("log in") instead of imperative ("fill this field,
 * then click that button"), and selector churn stays in a single file.
 */
export class LoginPage {
  readonly page: Page;

  // Locators are lazily-evaluated queries — defining them in the constructor
  // is cheap and lets every method reuse the same reference.
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  /** Navigate to the login screen. */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /** Fill the email and password fields. */
  async fill(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /** Submit the form. */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * End-to-end helper: navigate, fill, submit. Use this when a test needs to
   * be logged in but doesn't care *how* that happens.
   */
  async login(email: string, password: string): Promise<void> {
    await this.goto();
    await this.fill(email, password);
    await this.submit();
  }

  /** Locator for the inline error the form shows on bad credentials. */
  errorMessage(): Locator {
    return this.page.getByText(/invalid (email|credentials|password)/i);
  }
}
