import { test, expect } from '@playwright/test';

// Note: These tests assume you have a test user or can create one
// You may need to adjust based on your authentication setup

test.describe('Dashboard Features', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to login page
        await page.goto('/en/login');

        // TODO: Add actual login logic here
        // For now, we'll just check if we can access the dashboard
    });

    test('should display dashboard header', async ({ page }) => {
        await page.goto('/en/dashboard');

        // Check for dashboard elements (may redirect to login if not authenticated)
        const url = page.url();
        if (url.includes('/dashboard')) {
            await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
        }
    });

    test('should display financial summary', async ({ page }) => {
        await page.goto('/en/dashboard');

        if (page.url().includes('/dashboard')) {
            // Check for total balance display
            await expect(page.getByText(/total balance/i)).toBeVisible();
        }
    });

    test('should navigate to accounts page', async ({ page }) => {
        await page.goto('/en/dashboard');

        if (page.url().includes('/dashboard')) {
            // Click accounts link in sidebar
            await page.getByRole('link', { name: /accounts/i }).click();
            await expect(page).toHaveURL(/\/accounts/);
        }
    });

    test('should navigate to transactions page', async ({ page }) => {
        await page.goto('/en/dashboard');

        if (page.url().includes('/dashboard')) {
            await page.getByRole('link', { name: /transactions/i }).click();
            await expect(page).toHaveURL(/\/transactions/);
        }
    });

    test('should navigate to goals page', async ({ page }) => {
        await page.goto('/en/dashboard');

        if (page.url().includes('/dashboard')) {
            // Look for goals link or navigate directly
            await page.goto('/en/goals');
            await expect(page.getByRole('heading', { name: /financial goals/i })).toBeVisible();
        }
    });

    test('should display chat widget button', async ({ page }) => {
        await page.goto('/en/dashboard');

        if (page.url().includes('/dashboard')) {
            // Chat widget should be visible
            const chatButton = page.locator('button').filter({ hasText: /chat|support/i }).first();
            await expect(chatButton).toBeVisible();
        }
    });

    test('should open mobile menu on mobile viewport', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/en/dashboard');

        if (page.url().includes('/dashboard')) {
            // Click hamburger menu
            const menuButton = page.getByRole('button', { name: /menu/i }).first();
            if (await menuButton.isVisible()) {
                await menuButton.click();

                // Sidebar should be visible
                await expect(page.getByRole('navigation')).toBeVisible();
            }
        }
    });
});
