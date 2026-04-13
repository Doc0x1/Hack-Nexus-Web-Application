import React from 'react';
import { Settings } from 'lucide-react';
import GuildCard from '@/components/zira-dashboard/GuildCard';
import type { GuildResponse } from '@/types/discord';
import NoGuildsState from '@/components/zira-dashboard/NoGuildsState';

interface GuildDashboardContentProps {
    guilds: GuildResponse;
}

export default function GuildDashboardContent({ guilds }: GuildDashboardContentProps) {
    if (guilds.manageable.length === 0) {
        return <NoGuildsState />;
    }

    return (
        <div className="mt-24 space-y-8 py-8">
            <h1 className="text-center text-3xl font-bold">Dashboard</h1>
            <section className="space-y-4">
                <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold">
                    <Settings className="size-6" />
                    Servers
                </h2>
                <div className="-mx-4 flex flex-wrap justify-center">
                    {guilds.manageable.map(guild => (
                        <GuildCard key={guild.id} id={guild.id} name={guild.name} icon={guild.icon} />
                    ))}
                </div>
            </section>
        </div>
    );
}
