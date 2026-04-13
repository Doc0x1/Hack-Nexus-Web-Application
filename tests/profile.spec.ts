import { test, expect } from '@playwright/test';

// NOTE: This test shows the pattern for interacting with the profile edit form.
//       Replace selectors & field values with ones that exist in your implementation.

test.describe('Profile editing', () => {
    test.beforeEach(async ({ page }) => {
        // Assuming user is already authenticated by API shortcut.
        // You could also re-use the sign-in helper from above or set a session cookie here.
    });

    test('allows a user to update profile details', async ({ page }) => {
        await page.goto('/profile/me/edit');

        // Example field interactions – update as per your form's actual inputs.
        await page.getByLabel('Display name').fill('Test User');
        await page.getByLabel('Bio').fill('Just updating my bio for test automation.');

        // Save changes.
        await Promise.all([
            page.waitForResponse(resp => resp.url().includes('/api/profile') && resp.ok()),
            page.getByRole('button', { name: /save/i }).click()
        ]);

        // Success toast should appear.
        await expect(page.getByText(/profile updated successfully/i)).toBeVisible();
    });
});
