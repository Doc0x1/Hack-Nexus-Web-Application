import { NextResponse } from 'next/server';
import { DiscordUser } from '@/types/discord';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();

    if (!session?.accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Discord API error:', errorText);
            throw new Error(`Discord API returned ${response.status}`);
        }

        const userData: DiscordUser = await response.json();
        return NextResponse.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
}
