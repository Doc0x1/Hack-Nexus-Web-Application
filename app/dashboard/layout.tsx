import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';
import { auth } from '@/auth';

// app/dashboard/layout.tsx
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    const siteSettings = await prisma.siteSettings.findUnique({
        where: { id: '1' }
    });

    if (!siteSettings?.siteBotEnabled && session?.user.role !== 'ADMIN') {
        redirect('/bot-in-development');
    }

    return (
        <main className="flex flex-1 flex-col">
            <div className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
    );
}
