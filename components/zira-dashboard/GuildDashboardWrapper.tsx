'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import GuildDashboardContent from '@/components/zira-dashboard/GuildDashboardContent';
import type { GuildResponse } from '@/types/discord';

interface GuildDashboardWrapperProps {
    guilds: GuildResponse | { error: 'AUTH_EXPIRED' };
}

export default function GuildDashboardWrapper({ guilds }: GuildDashboardWrapperProps) {
    useEffect(() => {
        if ('error' in guilds && guilds.error === 'AUTH_EXPIRED') {
            // Only sign out if the session is truly expired, not if Discord is just not linked
            const timer = setTimeout(() => {
                signOut({ callbackUrl: '/login' });
            }, 2000);
            
            return () => clearTimeout(timer);
        }
    }, [guilds]);

    if ('error' in guilds && guilds.error === 'AUTH_EXPIRED') {
        return (
            <div className="mt-24 space-y-8 py-8">
                <div className="text-center">
                    <p>Discord account not linked or session expired. Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return <GuildDashboardContent guilds={guilds as GuildResponse} />;
}