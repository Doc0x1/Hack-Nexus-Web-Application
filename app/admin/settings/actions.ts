'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

/**
 * Fetch the single SiteSettings record (id = '1'). Throws if unauthorised.
 */
export async function getSiteSettings() {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        throw new Error('Unauthorized');
    }

    const settings = await prisma.siteSettings.findUnique({
        where: { id: '1' }
    });

    return settings;
}

/**
 * Update or create the SiteSettings record using the submitted form data.
 * Returns an object with success/error flags so the client can react.
 */
export async function updateSiteSettings(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const data = {
            siteName: (formData.get('siteName') as string) || '',
            siteDescription: (formData.get('siteDescription') as string) || '',
            siteLogo: (formData.get('siteLogo') as string) || '',
            siteFavicon: (formData.get('siteFavicon') as string) || '',
            siteTheme: (formData.get('siteTheme') as string) || 'dark',
            siteLanguage: (formData.get('siteLanguage') as string) || 'en',
            siteBotEnabled: formData.get('siteBotEnabled') === 'on',
            siteRegistrationEnabled: formData.get('siteRegistrationEnabled') === 'on',
            siteAdminUserEmails: ((formData.get('siteAdminUserEmails') as string) || '')
                .split(',')
                .map(e => e.trim())
                .filter(Boolean),
            siteModeratorUserEmails: ((formData.get('siteModeratorUserEmails') as string) || '')
                .split(',')
                .map(e => e.trim())
                .filter(Boolean)
        } as const;

        await prisma.siteSettings.upsert({
            where: { id: '1' },
            update: data,
            create: {
                id: '1',
                ...data
            }
        });

        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error('Failed to update site settings:', error);
        return { success: false, error: 'Failed to update site settings' };
    }
}
