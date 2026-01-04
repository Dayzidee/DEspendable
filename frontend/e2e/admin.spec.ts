import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to login page
        await page.goto('/en/login');

        // Check if we need to login
        if (await page.getByPlaceholder(/email/i).isVisible()) {
            await page.getByPlaceholder(/email/i).fill('admin@despendables.com');
            await page.getByPlaceholder(/password/i).fill('YourSecurePassword123');
            await page.getByRole('button', { name: /sign in|login/i }).click();
            await page.waitForURL('**/dashboard');
        }

        // Navigate to admin
        await page.goto('/en/admin');
    });

    test('should display admin panel', async ({ page }) => {
        // If not redirected to login, we should see admin content
        await expect(page).toHaveURL(/.*admin/);
        await expect(page.getByText(/admin dashboard/i).or(page.getByText(/total users/i))).toBeVisible();
    });

    test('should display user management table', async ({ page }) => {
        // Ensure on users tab (default)
        const usersTab = page.getByRole('button', { name: /users/i });
        if (await usersTab.isVisible()) {
            await usersTab.click();
        }

        // Check for table headers
        await expect(page.getByRole('columnheader', { name: /name/i })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: /email/i })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: /balance/i })).toBeVisible();
    });

    test('should have tabs for users, transactions, and chats', async ({ page }) => {
        await expect(page.getByRole('button', { name: /users/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /transactions/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /support chats/i })).toBeVisible();
    });

    test('should switch between tabs', async ({ page }) => {
        // Click transactions tab
        await page.getByRole('button', { name: /transactions/i }).click();
        await expect(page.getByRole('table')).toBeVisible();

        // Click chats tab
        await page.getByRole('button', { name: /support chats/i }).click();
        await expect(page.getByText(/all support chats/i)).toBeVisible();
    });

    test('should have search functionality', async ({ page }) => {
        const searchInput = page.getByPlaceholder(/search/i);
        await expect(searchInput).toBeVisible();
        await searchInput.fill('test');
        await expect(searchInput).toHaveValue('test');
    });

    test('should display charts', async ({ page }) => {
        // Switch back to users or dashboard view where charts might be
        await page.getByRole('button', { name: /users/i }).click();
        const charts = page.locator('canvas');
        await expect(charts.first()).toBeVisible();
    });
});
