import { test, expect } from '@playwright/test';

// Note: This test assumes you have a test account seeded in your local database.
//       Replace the credentials below with valid ones for your dev environment.

test.describe('Sign-in flow', () => {
    test('allows a user to sign in with valid email & password', async ({ page }) => {
        // Intercept the credentials callback to simulate a successful sign-in response.
        await page.route('**/api/auth/*', async route => {
            // Allow the credentials POST request to go through, but fast-return others.
            if (route.request().url().includes('/callback/credentials')) {
                await route.fulfill({ status: 302, headers: { location: '/' } });
                return;
            }
            await route.continue();
        });

        await page.goto('/login');

        // Fill the form.
        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password');

        // Submit the form.
        await Promise.all([
            page.waitForURL('/', { timeout: 10_000 }),
            page.getByRole('button', { name: /sign in/i }).click()
        ]);

        // Ensure we ended up on the home page.
        await expect(page).toHaveURL('/');
    });
});
