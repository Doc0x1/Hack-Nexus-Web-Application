'use server';

import { auth } from '@/auth';
import { GuildResponse } from '@/types/discord';
import { unstable_cache } from 'next/cache';

const getCachedGuilds = unstable_cache(
    async (accessToken: string): Promise<GuildResponse> => {
        // Call the bot's API to get user guilds
        const response = await fetch(`${process.env.DISCORD_BOT_URL}/api/guilds/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('AUTH_EXPIRED');
            }
            if (response.status === 429) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Rate limited. Please try again later.');
            }
            if (response.status === 502) {
                throw new Error('Failed to fetch guilds from Discord API');
            }
            throw new Error(`Bot API returned ${response.status}: ${response.statusText}`);
        }

        const guildResponse: GuildResponse = await response.json();
        return guildResponse;
    },
    ['guilds'],
    {
        revalidate: 60, // Cache for 1 minute
        tags: ['guilds'] // Tag for manual revalidation
    }
);

export async function getGuilds(): Promise<GuildResponse | { error: 'AUTH_EXPIRED' }> {
    const session = await auth();

    if (!session?.user) {
        return { error: 'AUTH_EXPIRED' };
    }

    // Check if user has Discord linked and can access bot
    if (!session.user.canAccessBot || !session.user.discordId) {
        return { error: 'AUTH_EXPIRED' };
    }

    // For Discord users, we need a valid access token
    if (!session.accessToken || session.error === 'RefreshAccessTokenError') {
        return { error: 'AUTH_EXPIRED' };
    }

    try {
        // Call the bot's API to get processed guilds data
        return await getCachedGuilds(session.accessToken);
    } catch (error) {
        console.error('Error fetching guilds:', error);

        if (error instanceof Error && error.message === 'AUTH_EXPIRED') {
            return { error: 'AUTH_EXPIRED' };
        }

        throw error instanceof Error ? error : new Error('Failed to fetch guilds');
    }
}
