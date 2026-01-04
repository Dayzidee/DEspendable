import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should display login page', async ({ page }) => {
        await page.goto('/en/login');

        // Check for login form elements
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
        await expect(page.getByPlaceholder(/email/i)).toBeVisible();
        await expect(page.getByPlaceholder(/password/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
        await page.goto('/en/login');

        // Try to submit empty form
        await page.getByRole('button', { name: /login/i }).click();

        // HTML5 validation should prevent submission
        const emailInput = page.getByPlaceholder(/email/i);
        await expect(emailInput).toHaveAttribute('required', '');
    });

    test('should navigate to signup page', async ({ page }) => {
        await page.goto('/en/login');

        // Click signup link
        await page.getByRole('link', { name: /sign up/i }).click();

        // Should be on signup page
        await expect(page).toHaveURL(/\/signup/);
        await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
    });

    test('should display signup form', async ({ page }) => {
        await page.goto('/en/signup');

        // Check for signup form elements
        await expect(page.getByPlaceholder(/name/i)).toBeVisible();
        await expect(page.getByPlaceholder(/email/i)).toBeVisible();
        await expect(page.getByPlaceholder(/password/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
    });

    test('should switch between English and German', async ({ page }) => {
        await page.goto('/en/login');

        // Switch to German
        await page.goto('/de/login');

        // Check for German text
        await expect(page.getByRole('heading', { name: /anmelden/i })).toBeVisible();
    });
});
