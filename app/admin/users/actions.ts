'use server';

// Rewritten to interact with the Sapphire bot's admin API rather than Prisma

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

const API_BASE = process.env.DISCORD_BOT_URL as string; // e.g. "https://bot.example.com"

async function api<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path: string,
    accessToken: string,
    body?: unknown
): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Bot API returned ${res.status}`);
    }

    // 204 No-Content ⇒ undefined
    return (res.status === 204 ? undefined : await res.json()) as T;
}

export async function getGuilds() {
    const session = await auth();
    if (!session?.user?.isAdmin || !session.accessToken) {
        throw new Error('Unauthorized');
    }

    return api<{ id: string; name: string }[]>('GET', '/api/admin/guilds', session.accessToken);
}

export async function getGuildUsers(guildId: string) {
    const session = await auth();
    if (!session?.user?.isAdmin || !session.accessToken) {
        throw new Error('Unauthorized');
    }

    return api<any[]>('GET', `/api/admin/guilds/${guildId}/users`, session.accessToken);
}

export async function updateGuildUser(userId: string, guildId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.isAdmin || !session.accessToken) {
        throw new Error('Unauthorized');
    }

    const data = {
        username: formData.get('username') as string,
        guildOwner: formData.get('guildOwner') === 'true' || formData.get('guildOwner') === 'on',
        currency: Number(formData.get('currency')) || 0,
        messagesSent: Number(formData.get('messagesSent')) || 0,
        timeInVoice: Number(formData.get('timeInVoice')) || 0,
        level: Number(formData.get('level')) || 0,
        exp: Number(formData.get('exp')) || 0,
        hearts: Number(formData.get('hearts')) || 0,
        tryHackMeDetailsUsername: (formData.get('tryHackMeDetailsUsername') as string) || null
    };

    try {
        const updated = await api<any>(
            'PATCH',
            `/api/admin/guilds/${guildId}/users/${userId}`,
            session.accessToken,
            data
        );
        revalidatePath('/admin/users');
        return { success: true, user: updated };
    } catch (error) {
        console.error('Error updating guild user:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function createGuildUser(guildId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.isAdmin || !session.accessToken) {
        throw new Error('Unauthorized');
    }

    const payload = {
        username: formData.get('username') as string,
        guildOwner: formData.get('guildOwner') === 'on',
        currency: Number(formData.get('currency')) || 0,
        messagesSent: Number(formData.get('messagesSent')) || 0,
        timeInVoice: Number(formData.get('timeInVoice')) || 0,
        level: Number(formData.get('level')) || 1,
        exp: Number(formData.get('exp')) || 0,
        hearts: Number(formData.get('hearts')) || 0,
        tryHackMeDetailsUsername: (formData.get('tryHackMeDetailsUsername') as string) || null
    };

    if (!payload.username) {
        throw new Error('Username is required');
    }

    try {
        const created = await api<any>('POST', `/api/admin/guilds/${guildId}/users`, session.accessToken, payload);
        revalidatePath('/admin/users');
        return { success: true, user: created };
    } catch (error) {
        console.error('Error creating guild user:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteGuildUser(userId: string, guildId: string) {
    const session = await auth();
    if (!session?.user?.isAdmin || !session.accessToken) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await api<void>('DELETE', `/api/admin/guilds/${guildId}/users/${userId}`, session.accessToken);
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Error deleting guild user:', error);
        return { success: false, error: (error as Error).message };
    }
}
