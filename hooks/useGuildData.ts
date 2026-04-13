import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGuildData, updateGuildSettings } from '@/app/actions/guild-actions';
import { updateGuildLeveling } from '@/app/actions/guild-actions';
import { signIn } from '@/auth';
import { GuildConfig, LevelingConfig } from '@/types/discord-bot-types';
import { Role } from '@/types/discord';
import { toast } from 'sonner';

interface DiscordChannel {
    id: string;
    name: string;
    type: number;
}

interface RoleRewardsData {
    level: any[];
    tryhackme: any[];
}

export interface GuildData {
    settings: GuildConfig | undefined;
    channels: DiscordChannel[];
    roles: Role[];
    Leveling: LevelingConfig | null;
    roleRewards: RoleRewardsData;
}

export function useGuildData(guildId: string) {
    const queryClient = useQueryClient();

    const {
        data: guildData,
        isLoading,
        error: queryError
    } = useQuery({
        queryKey: ['guild', guildId] as const,
        queryFn: async (): Promise<GuildData> => {
            const result = await getGuildData(guildId);
            if (!result.success && result.error?.includes('401')) {
                await signIn('discord', { callbackUrl: `/dashboard/guilds/${guildId}` });
                throw new Error('Unauthorized');
            }
            if (result.success && result.data) {
                return {
                    settings: result.data.getGuildSettings,
                    channels: result.data.getGuildChannels,
                    roles: result.data.getGuildRoles,
                    Leveling: result.data.getGuildLeveling,
                    roleRewards: result.data.getRoleRewards || { level: [], tryhackme: [] }
                };
            }
            throw new Error(result.error || 'Failed to load guild data');
        },
        gcTime: 1000 * 60 * 30, // Cache for 30 minutes
        staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
        retry: (failureCount, error) => {
            if (error instanceof Error && error.message === 'Unauthorized') {
                return false;
            }
            return failureCount < 3;
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (formData: GuildConfig) => {
            const formDataObj = new FormData();
            const fieldsToUpdate = [
                'prefix',
                'welcomeMessage',
                'farewellMessage',
                'loggingChannelId',
                'phishingLoggingChannelId',
                'muteRoleId',
                'ownerRoles',
                'adminRoles',
                'moderatorRoles'
            ] as const;

            fieldsToUpdate.forEach(key => {
                const value = formData[key];
                if (Array.isArray(value)) {
                    value.forEach(v => formDataObj.append(`${key}[]`, v));
                } else if (value !== null) {
                    formDataObj.append(key, value);
                }
            });

            const result = await updateGuildSettings(guildId, formDataObj);
            if (!result.success) {
                if (result.error?.includes('401')) {
                    await signIn('discord', { callbackUrl: `/dashboard/guilds/${guildId}` });
                    throw new Error('Unauthorized');
                }
                throw new Error(result.error || 'Failed to update settings');
            }
            return result.data;
        },
        onSuccess: (data, formData) => {
            queryClient.setQueryData<GuildData>(['guild', guildId], old => {
                if (!old) return old;
                return { ...old, settings: formData };
            });
            toast.success('Guild settings updated successfully', {
                dismissible: true,
                closeButton: true,
                classNames: {
                    success: '!bg-green-600'
                }
            });
        },
        onError: (error: Error) => {
            console.error('Error updating settings:', error);
            toast.error(error.message, {
                dismissible: true,
                closeButton: true,
                classNames: {
                    error: '!bg-red-600'
                }
            });
        }
    });

    const updateLevelingMutation = useMutation({
        mutationFn: async (formData: GuildConfig) => {
            const result = await updateGuildLeveling(guildId, formData);
            if (!result.success) {
                if (result.error?.includes('401')) {
                    await signIn('discord', { callbackUrl: `/dashboard/guilds/${guildId}` });
                    throw new Error('Unauthorized');
                }
                throw new Error(result.error || 'Failed to update leveling settings');
            }
            return result.data;
        },
        onSuccess: (data, formData) => {
            queryClient.setQueryData<GuildData>(['guild', guildId], old => {
                if (!old) return old;
                return {
                    ...old,
                    settings: {
                        ...old.settings,
                        enableLeveling: formData.enableLeveling,
                        announceLevelUps: formData.announceLevelUps,
                        Leveling: formData.Leveling
                    }
                } as GuildData;
            });
            toast.success('Leveling settings updated successfully', {
                dismissible: true,
                closeButton: true,
                classNames: {
                    success: '!bg-green-600'
                }
            });
        },
        onError: (error: Error) => {
            console.error('Error updating leveling settings:', error);
            toast.error(error.message, {
                dismissible: true,
                closeButton: true,
                classNames: {
                    error: '!bg-red-600'
                }
            });
        }
    });

    return {
        guildData,
        isLoading,
        error: queryError,
        updateSettings: updateMutation.mutateAsync,
        updateLeveling: updateLevelingMutation.mutateAsync
    };
}
