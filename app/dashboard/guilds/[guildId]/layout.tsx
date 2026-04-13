'use client';

import BotSidebar from '@/components/zira-dashboard/Sidebar';
import { useParams } from 'next/navigation';

const tabs = [
    { name: 'General', href: '' },
    { name: 'Leveling', href: '/leveling' }
];

export default function GuildLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();

    if (!params?.guildId) {
        return <div className="text-white">Error: Guild ID not found.</div>;
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] pt-16">
            <BotSidebar guildId={params.guildId as string} />
            <main className="ml-64 w-full flex-1 p-6">{children}</main>
        </div>
    );
}
