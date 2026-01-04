# Playwright E2E Testing for DEspendables

## Overview

This directory contains end-to-end tests for the DEspendables banking application using Playwright.

## Test Suites

### 1. Authentication Tests (`auth.spec.ts`)
- Login page display and validation
- Signup page functionality
- Form validation
- Locale switching (English/German)

### 2. Dashboard Tests (`dashboard.spec.ts`)
- Dashboard header and financial summary
- Navigation to different pages
- Chat widget visibility
- Mobile menu functionality

### 3. Admin Panel Tests (`admin.spec.ts`)
- Admin authentication and access control
- Stats display
- Tab switching (Users, Transactions, Chats)
- User management table
- Search functionality
- Charts display

### 4. Chat Widget Tests (`chat.spec.ts`)
- Chat button visibility
- Opening/closing chat widget
- Message input functionality
- Send button interaction

### 5. Navigation Tests (`navigation.spec.ts`)
- Page routing and navigation
- Locale persistence
- Legal pages access
- 404 handling
- Responsive design (mobile, tablet, desktop)
- Accessibility features

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### View test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test e2e/auth.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Configuration

The Playwright configuration is defined in `playwright.config.ts`:

- **Test Directory**: `./e2e`
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Parallel Execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure
- **Traces**: On first retry

## Writing New Tests

1. Create a new file in the `e2e` directory with `.spec.ts` extension
2. Import test and expect from `@playwright/test`
3. Use `test.describe` to group related tests
4. Use `test.beforeEach` for setup
5. Write assertions using `expect`

Example:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/feature');
  });

  test('should do something', async ({ page }) => {
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
```

## Best Practices

1. **Use semantic locators**: Prefer `getByRole`, `getByLabel`, `getByPlaceholder` over CSS selectors
2. **Wait for elements**: Use `await expect().toBeVisible()` instead of manual waits
3. **Test user flows**: Focus on real user scenarios
4. **Keep tests independent**: Each test should be able to run in isolation
5. **Use descriptive names**: Test names should clearly describe what they test
6. **Handle authentication**: Use `test.beforeEach` for login when needed

## Debugging Tests

### Debug a specific test
```bash
npx playwright test --debug e2e/auth.spec.ts
```

### Generate code
```bash
npx playwright codegen http://localhost:3000
```

### View traces
```bash
npx playwright show-trace trace.zip
```

## CI/CD Integration

Tests are configured to run in CI environments with:
- Automatic retries (2 retries)
- Single worker (no parallel execution)
- HTML reporter for results

## Notes

- Tests assume the development server is running on `http://localhost:3000`
- Some tests check for authentication state and may redirect to login
- Mobile tests use Pixel 5 and iPhone 12 viewports
- Accessibility tests check for basic WCAG compliance

## Troubleshooting

### Tests failing due to timeouts
- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Verify network connectivity

### Element not found errors
- Check if locators match the actual UI
- Verify the page has loaded completely
- Use `page.pause()` to inspect the page state

### Authentication issues
- Ensure test user credentials are valid
- Check Firebase configuration
- Verify token handling in tests
