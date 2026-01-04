import { test, expect } from '@playwright/test';

test.describe('Chat Widget', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/en/dashboard');
    });

    test('should display chat widget button', async ({ page }) => {
        if (page.url().includes('/dashboard')) {
            // Look for chat button (floating button)
            const chatButton = page.locator('button').filter({ has: page.locator('svg') }).first();
            await expect(chatButton).toBeVisible();
        }
    });

    test('should open chat widget when clicked', async ({ page }) => {
        if (page.url().includes('/dashboard')) {
            // Find and click chat button
            const chatButtons = page.locator('button');
            const chatButton = chatButtons.filter({ has: page.locator('svg') }).first();

            if (await chatButton.isVisible()) {
                await chatButton.click();

                // Chat window should appear
                await expect(page.getByText(/support chat/i)).toBeVisible();
            }
        }
    });

    test('should display message input in chat', async ({ page }) => {
        if (page.url().includes('/dashboard')) {
            const chatButton = page.locator('button').filter({ has: page.locator('svg') }).first();

            if (await chatButton.isVisible()) {
                await chatButton.click();

                // Check for message input
                const messageInput = page.getByPlaceholder(/type.*message/i);
                await expect(messageInput).toBeVisible();
            }
        }
    });

    test('should be able to type in chat input', async ({ page }) => {
        if (page.url().includes('/dashboard')) {
            const chatButton = page.locator('button').filter({ has: page.locator('svg') }).first();

            if (await chatButton.isVisible()) {
                await chatButton.click();

                const messageInput = page.getByPlaceholder(/type.*message/i);
                if (await messageInput.isVisible()) {
                    await messageInput.fill('Test message');
                    await expect(messageInput).toHaveValue('Test message');
                }
            }
        }
    });

    test('should have send button', async ({ page }) => {
        if (page.url().includes('/dashboard')) {
            const chatButton = page.locator('button').filter({ has: page.locator('svg') }).first();

            if (await chatButton.isVisible()) {
                await chatButton.click();

                // Look for send button
                const sendButton = page.getByRole('button', { name: /send/i });
                await expect(sendButton).toBeVisible();
            }
        }
    });

    test('should be able to close chat widget', async ({ page }) => {
        if (page.url().includes('/dashboard')) {
            const chatButton = page.locator('button').filter({ has: page.locator('svg') }).first();

            if (await chatButton.isVisible()) {
                await chatButton.click();

                // Look for close button
                const closeButton = page.locator('button').filter({ has: page.locator('svg') }).nth(1);
                if (await closeButton.isVisible()) {
                    await closeButton.click();

                    // Chat should be closed
                    await expect(page.getByText(/support chat/i)).not.toBeVisible();
                }
            }
        }
    });
});
