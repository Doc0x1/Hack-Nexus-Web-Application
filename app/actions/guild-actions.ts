// app/actions/guild-actions.ts
'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { Role } from '@/types/discord';
import { GuildConfig } from '@/types/discord-bot-types';

const schema = z.object({
    prefix: z.string().min(1, 'Command prefix is required'),
    welcomeMessage: z
        .string()
        .nullable()
        .optional()
        .transform(val => (val === '' ? null : val)),
    farewellMessage: z
        .string()
        .nullable()
        .optional()
        .transform(val => (val === '' ? null : val)),
    loggingChannelId: z.string().optional(),
    phishingLoggingChannelId: z.string().optional(),
    muteRoleId: z
        .string()
        .nullable()
        .optional()
        .transform(val => (val === '' ? null : val)),
    ownerRoles: z.array(z.string()).default([]),
    adminRoles: z.array(z.string()).default([]),
    moderatorRoles: z.array(z.string()).default([])
});

interface GuildChannel {
    id: string;
    name: string;
    type: number;
}

async function fetchGuildChannels(guildId: string): Promise<GuildChannel[]> {
    try {
        const response = await fetch(`https://discord.com/api/guilds/${guildId}/channels`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch channels: ${response.statusText}`);
        }

        const channels: GuildChannel[] = await response.json();
        // Filter for text channels (type 0)
        return channels.filter(channel => channel.type === 0);
    } catch (error) {
        console.error('Error fetching guild channels:', error);
        throw new Error('Failed to fetch channels');
    }
}

async function fetchGuildRoles(guildId: string): Promise<Role[]> {
    try {
        const response = await fetch(`https://discord.com/api/guilds/${guildId}/roles`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch roles: ${response.statusText}`);
        }

        const roles: Role[] = await response.json();
        // Sort roles by position (highest first) and filter out managed roles
        return roles.filter(role => !role.managed).sort((a, b) => b.position - a.position);
    } catch (error) {
        console.error('Error fetching guild roles:', error);
        throw new Error('Failed to fetch roles');
    }
}

async function fetchGuildData(guildId: string): Promise<{ channels: GuildChannel[]; roles: Role[] }> {
    const [channels, roles] = await Promise.all([fetchGuildChannels(guildId), fetchGuildRoles(guildId)]);

    return { channels, roles };
}

export async function getGuildData(guildId: string) {
    const session = await auth();
    if (!session?.accessToken) {
        return { success: false, error: 'Not authenticated - 401' };
    }

    try {
        // Fetch guild config and role rewards in parallel
        const [configResponse, roleRewardsResponse] = await Promise.all([
            fetch(`${process.env.DISCORD_BOT_URL}/api/guilds/${guildId}/config`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.accessToken}`
                }
            }),
            fetch(`${process.env.DISCORD_BOT_URL}/api/guilds/${guildId}/role-rewards`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.accessToken}`
                }
            })
        ]);

        if (!configResponse.ok) {
            return { success: false, error: configResponse.statusText };
        }

        const settings = await configResponse.json();
        const { channels, roles } = await fetchGuildData(guildId);

        // Handle role rewards - don't fail if they're not available
        let roleRewards = { level: [], tryhackme: [] };
        if (roleRewardsResponse.ok) {
            try {
                roleRewards = await roleRewardsResponse.json();
            } catch (error) {
                console.warn('Failed to parse role rewards response:', error);
            }
        } else {
            console.warn('Role rewards not available:', roleRewardsResponse.status);
        }

        if (!settings) {
            return { success: false, error: 'Guild settings not found' };
        }

        return {
            success: true,
            data: {
                getGuildSettings: settings,
                getGuildChannels: channels,
                getGuildRoles: roles,
                getGuildLeveling: settings.Leveling || null,
                getRoleRewards: roleRewards
            }
        };
    } catch (error) {
        console.error('Guild data fetch error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateGuildSettings(guildId: string, formData: FormData) {
    const session = await auth();
    if (!session?.accessToken) {
        return { success: false, error: 'Not authenticated - 401' };
    }

    try {
        const settings = {
            prefix: formData.get('prefix') as string,
            welcomeMessage: (formData.get('welcomeMessage') as string) || null,
            farewellMessage: (formData.get('farewellMessage') as string) || null,
            loggingChannelId: (formData.get('loggingChannelId') as string) || undefined,
            phishingLoggingChannelId: (formData.get('phishingLoggingChannelId') as string) || undefined,
            muteRoleId: (formData.get('muteRoleId') as string) || null,
            ownerRoles: formData.getAll('ownerRoles[]') as string[],
            adminRoles: formData.getAll('adminRoles[]') as string[],
            moderatorRoles: formData.getAll('moderatorRoles[]') as string[]
        };

        const validatedData = schema.parse(settings);

        // Send POST request to the bot's API
        const response = await fetch(`${process.env.DISCORD_BOT_URL}/api/guilds/${guildId}/config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({
                guildId: guildId,
                ...validatedData
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, error: 'Unauthorized - Please sign in again' };
            }
            const errorData = await response.json();
            console.error('Error updating guild settings:', errorData);
            throw new Error(errorData.error || 'Failed to update guild settings');
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Guild settings update error:', error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message };
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateGuildLeveling(guildId: string, data: GuildConfig) {
    const session = await auth();
    if (!session?.accessToken) {
        return { success: false, error: 'Not authenticated - 401' };
    }

    try {
        const response = await fetch(`${process.env.DISCORD_BOT_URL}/api/guilds/${guildId}/config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({
                guildId,
                enableLeveling: data.enableLeveling,
                announceLevelUps: data.announceLevelUps,
                leveling: data.Leveling // note lowercase to match API schema
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, error: 'Unauthorized - Please sign in again' };
            }
            const errorData = await response.json();
            console.error('Error updating leveling settings:', errorData);
            throw new Error(errorData.error || 'Failed to update leveling settings');
        }

        const responseData = await response.json();
        return { success: true, data: responseData };
    } catch (error) {
        console.error('Guild leveling update error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Role Reward Validation Schemas - Match bot API schemas exactly
const levelRewardSchema = z.object({
    type: z.literal('level'),
    roleId: z.string().min(1, 'Role ID is required'),
    level: z.number().int().min(1, 'Level must be at least 1')
});

const baseTryHackMeRewardSchema = z.object({
    type: z.literal('tryhackme'),
    roleId: z.string().min(1, 'Role ID is required'),
    roomsRequired: z.number().int().min(0).optional().nullable(),
    rankRequired: z.number().int().min(1).optional().nullable()
});

const roleRewardSchema = z.discriminatedUnion('type', [levelRewardSchema, baseTryHackMeRewardSchema]).refine(
    data => {
        if (data.type === 'tryhackme') {
            return data.roomsRequired !== null || data.rankRequired !== null;
        }
        return true;
    },
    {
        message: 'At least one requirement (rooms or rank) must be specified',
        path: ['requirements']
    }
);

const updateLevelRewardSchema = z
    .object({
        level: z.number().min(1, 'Level must be at least 1').max(1000, 'Level cannot exceed 1000').optional()
    })
    .partial();

const updateTryHackMeRewardSchema = z
    .object({
        roomsRequired: z.number().min(1).nullable().optional(),
        rankRequired: z.string().nullable().optional()
    })
    .partial()
    .refine(
        data => {
            if (Object.keys(data).length === 0) return false;
            return true;
        },
        { message: 'At least one field must be provided for update' }
    );

// Role Reward Actions
export async function getRoleRewards(guildId: string, type?: 'level' | 'tryhackme') {
    const session = await auth();
    if (!session?.accessToken) {
        return { success: false, error: 'Not authenticated - 401' };
    }

    try {
        const url = `${process.env.DISCORD_BOT_URL}/api/guilds/${guildId}/role-rewards${type ? `?type=${type}` : ''}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, error: 'Unauthorized - Please sign in again' };
            }
            if (response.status === 404) {
                return { success: false, error: 'Guild not found' };
            }
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch role rewards');
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Role rewards fetch error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function createRoleReward(guildId: string, rewardData: z.infer<typeof roleRewardSchema>) {
    const session = await auth();
    if (!session?.accessToken) {
        return { success: false, error: 'Not authenticated - 401' };
    }

    try {
        const validatedData = roleRewardSchema.parse(rewardData);

        const response = await fetch(`${process.env.DISCORD_BOT_URL}/api/guilds/${guildId}/role-rewards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(validatedData)
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(await response.text());
            } catch {
                errorData = null;
            }

            if (response.status === 401) {
                return { success: false, error: 'Unauthorized - Please sign in again' };
            }
            if (response.status === 400) {
                return { success: false, error: errorData?.error || 'Invalid data provided' };
            }
            if (response.status === 404) {
                return {
                    success: false,
                    error: 'Role rewards feature not available. The Discord bot may need to be updated to support role rewards.'
                };
            }
            if (response.status === 409) {
                return { success: false, error: 'A reward for this role/level already exists' };
            }
            throw new Error(errorData?.error || 'Failed to create role reward');
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Role reward creation error:', error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message };
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateRoleReward(
    guildId: string,
    type: 'level' | 'tryhackme',
    rewardId: string,
    updateData: z.infer<typeof updateLevelRewardSchema> | z.infer<typeof updateTryHackMeRewardSchema>
) {
    const session = await auth();
    if (!session?.accessToken) {
        return { success: false, error: 'Not authenticated - 401' };
    }

    try {
        let validatedData;
        if (type === 'level') {
            validatedData = updateLevelRewardSchema.parse(updateData);
        } else {
            validatedData = updateTryHackMeRewardSchema.parse(updateData);
        }

        const response = await fetch(
            `${process.env.DISCORD_BOT_URL}/api/guilds/${guildId}/role-rewards/${type}/${rewardId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.accessToken}`
                },
                body: JSON.stringify(validatedData)
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, error: 'Unauthorized - Please sign in again' };
            }
            if (response.status === 400) {
                const errorData = await response.json();
                return { success: false, error: errorData.error || 'Invalid data provided' };
            }
            if (response.status === 404) {
                return { success: false, error: 'Role reward not found' };
            }
            if (response.status === 409) {
                return { success: false, error: 'A reward for this role/level already exists' };
            }
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update role reward');
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Role reward update error:', error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message };
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function deleteRoleReward(guildId: string, type: 'level' | 'tryhackme', rewardId: string) {
    const session = await auth();
    if (!session?.accessToken) {
        return { success: false, error: 'Not authenticated - 401' };
    }

    try {
        const response = await fetch(
            `${process.env.DISCORD_BOT_URL}/api/guilds/${guildId}/role-rewards/${type}/${rewardId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.accessToken}`
                }
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, error: 'Unauthorized - Please sign in again' };
            }
            if (response.status === 404) {
                return { success: false, error: 'Role reward not found' };
            }
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete role reward');
        }

        return { success: true, message: 'Role reward deleted successfully' };
    } catch (error) {
        console.error('Role reward deletion error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
