import { prisma } from '@/lib/prisma';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';

export default async function AdminSettingsPage() {
    const settings = await prisma.siteSettings.findUnique({
        where: { id: '1' }
    });

    if (!settings) {
        return <div className="p-8">No site settings found.</div>;
    }

    return (
        <div className="flex w-full flex-col items-center p-8">
            <h1 className="mb-6 text-3xl font-bold">Site Settings</h1>
            <SiteSettingsForm settings={settings} />
        </div>
    );
}
