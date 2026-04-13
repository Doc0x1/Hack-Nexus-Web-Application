import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoleRewards, createRoleReward, updateRoleReward, deleteRoleReward } from '@/app/actions/guild-actions';
import { signIn } from '@/auth';
import { toast } from 'sonner';
import { RoleReward } from '@/types/discord-bot-types';

interface RoleRewardsData {
    level: RoleReward[];
    tryhackme: RoleReward[];
}

export function useRoleRewards(guildId: string, type?: 'level' | 'tryhackme') {
    const queryClient = useQueryClient();

    const {
        data: roleRewards,
        isLoading,
        error: queryError
    } = useQuery({
        queryKey: ['roleRewards', guildId, type] as const,
        queryFn: async (): Promise<RoleRewardsData> => {
            const result = await getRoleRewards(guildId, type);
            if (!result.success && result.error?.includes('401')) {
                await signIn('discord', { callbackUrl: `/dashboard/guilds/${guildId}/roleRewards` });
                throw new Error('Unauthorized');
            }
            if (result.success && result.data) {
                return result.data;
            }
            throw new Error(result.error || 'Failed to load role rewards');
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

    const createMutation = useMutation({
        mutationFn: async (rewardData: Parameters<typeof createRoleReward>[1]) => {
            const result = await createRoleReward(guildId, rewardData);
            if (!result.success) {
                if (result.error?.includes('401')) {
                    await signIn('discord', { callbackUrl: `/dashboard/guilds/${guildId}/roleRewards` });
                    throw new Error('Unauthorized');
                }
                throw new Error(result.error || 'Failed to create role reward');
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate guild data cache to refresh role rewards
            queryClient.invalidateQueries({ queryKey: ['guild', guildId] });
            toast.success('Role reward created successfully', {
                dismissible: true,
                closeButton: true,
                classNames: {
                    success: '!bg-green-600'
                }
            });
        },
        onError: (error: Error) => {
            console.error('Error creating role reward:', error);
            toast.error(error.message, {
                dismissible: true,
                closeButton: true,
                classNames: {
                    error: '!bg-red-600'
                }
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({
            type,
            rewardId,
            updateData
        }: {
            type: 'level' | 'tryhackme';
            rewardId: string;
            updateData: any;
        }) => {
            const result = await updateRoleReward(guildId, type, rewardId, updateData);
            if (!result.success) {
                if (result.error?.includes('401')) {
                    await signIn('discord', { callbackUrl: `/dashboard/guilds/${guildId}/roleRewards` });
                    throw new Error('Unauthorized');
                }
                throw new Error(result.error || 'Failed to update role reward');
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate guild data cache to refresh role rewards
            queryClient.invalidateQueries({ queryKey: ['guild', guildId] });
            toast.success('Role reward updated successfully', {
                dismissible: true,
                closeButton: true,
                classNames: {
                    success: '!bg-green-600'
                }
            });
        },
        onError: (error: Error) => {
            console.error('Error updating role reward:', error);
            toast.error(error.message, {
                dismissible: true,
                closeButton: true,
                classNames: {
                    error: '!bg-red-600'
                }
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async ({ type, rewardId }: { type: 'level' | 'tryhackme'; rewardId: string }) => {
            const result = await deleteRoleReward(guildId, type, rewardId);
            if (!result.success) {
                if (result.error?.includes('401')) {
                    await signIn('discord', { callbackUrl: `/dashboard/guilds/${guildId}/roleRewards` });
                    throw new Error('Unauthorized');
                }
                throw new Error(result.error || 'Failed to delete role reward');
            }
            return result.message;
        },
        onSuccess: () => {
            // Invalidate guild data cache to refresh role rewards
            queryClient.invalidateQueries({ queryKey: ['guild', guildId] });
            toast.success('Role reward deleted successfully', {
                dismissible: true,
                closeButton: true,
                classNames: {
                    success: '!bg-green-600'
                }
            });
        },
        onError: (error: Error) => {
            console.error('Error deleting role reward:', error);
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
        roleRewards,
        isLoading,
        error: queryError,
        createReward: createMutation.mutateAsync,
        updateReward: updateMutation.mutateAsync,
        deleteReward: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
}
