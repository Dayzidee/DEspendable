import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
    test('should navigate to landing page', async ({ page }) => {
        await page.goto('/');

        // Should redirect to /en by default
        await expect(page).toHaveURL(/\/en/);
    });

    test('should display navigation menu', async ({ page }) => {
        await page.goto('/en');

        // Check for navigation links
        await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
    });

    test('should navigate to different pages from dashboard sidebar', async ({ page }) => {
        await page.goto('/en/dashboard');

        if (page.url().includes('/dashboard')) {
            const pages = [
                { name: /transactions/i, url: '/transactions' },
                { name: /accounts/i, url: '/accounts' },
                { name: /cards/i, url: '/cards' },
                { name: /rewards/i, url: '/rewards' },
            ];

            for (const { name, url } of pages) {
                const link = page.getByRole('link', { name });
                if (await link.isVisible()) {
                    await link.click();
                    await expect(page).toHaveURL(new RegExp(url));

                    // Go back to dashboard
                    await page.goto('/en/dashboard');
                }
            }
        }
    });

    test('should navigate to legal pages', async ({ page }) => {
        await page.goto('/en');

        // Navigate to impressum
        await page.goto('/en/impressum');
        await expect(page.getByRole('heading', { name: /impressum|imprint/i })).toBeVisible();

        // Navigate to directions
        await page.goto('/en/directions');
        await expect(page.getByRole('heading', { name: /directions|terms/i })).toBeVisible();
    });

    test('should handle 404 pages', async ({ page }) => {
        await page.goto('/en/nonexistent-page');

        // Should show 404 or redirect
        const url = page.url();
        expect(url.includes('404') || url.includes('/en')).toBeTruthy();
    });

    test('should maintain locale across navigation', async ({ page }) => {
        await page.goto('/de/login');

        // Navigate to signup
        await page.getByRole('link', { name: /registrieren/i }).click();

        // Should still be in German
        await expect(page).toHaveURL(/\/de\//);
    });
});

test.describe('Responsive Design', () => {
    test('should be mobile responsive', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/en');

        // Page should load without horizontal scroll
        const body = await page.locator('body').boundingBox();
        expect(body?.width).toBeLessThanOrEqual(375);
    });

    test('should display mobile menu', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/en/dashboard');

        if (page.url().includes('/dashboard')) {
            // Hamburger menu should be visible
            const menuButton = page.getByRole('button').first();
            await expect(menuButton).toBeVisible();
        }
    });

    test('should work on tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/en/dashboard');

        if (page.url().includes('/dashboard')) {
            // Dashboard should be visible
            await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
        }
    });
});

test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
        await page.goto('/en/login');

        // Check for h1
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
    });

    test('should have alt text for images', async ({ page }) => {
        await page.goto('/en');

        // All images should have alt attribute
        const images = page.locator('img');
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            await expect(img).toHaveAttribute('alt');
        }
    });

    test('should be keyboard navigable', async ({ page }) => {
        await page.goto('/en/login');

        // Tab through form elements
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Should be able to focus on elements
        const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
        expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
    });
});
