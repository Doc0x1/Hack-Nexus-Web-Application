'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getGuilds, getGuildUsers, updateGuildUser, createGuildUser, deleteGuildUser } from '@/app/admin/users/actions';
import { GuildUser, Guild } from '@/types/discord-db-types';

export function useUserManagement() {
    const { toast } = useToast();
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [selectedGuildId, setSelectedGuildId] = useState<string>('');
    const [users, setUsers] = useState<GuildUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<GuildUser | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const filteredUsers = useMemo(() => {
        return users.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [users, searchQuery]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Load guilds on mount
    useEffect(() => {
        const loadGuilds = async () => {
            try {
                const guildsData = await getGuilds();
                setGuilds(guildsData);
                if (guildsData.length > 0) {
                    setSelectedGuildId(guildsData[0].id);
                }
            } catch (error) {
                console.error('Error loading guilds:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load guilds',
                    className: 'bg-red-600 text-white'
                });
            }
        };
        loadGuilds();
    }, [toast]);

    // Load users when guild changes
    useEffect(() => {
        const loadUsers = async () => {
            if (!selectedGuildId) return;
            setIsLoading(true);
            try {
                const usersData = await getGuildUsers(selectedGuildId);
                setUsers(usersData);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error loading users:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load users',
                    className: 'bg-red-600 text-white'
                });
            } finally {
                setIsLoading(false);
            }
        };
        loadUsers();
    }, [selectedGuildId, toast]);

    // Reset to first page when search or items per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, itemsPerPage]);

    const handleGuildChange = useCallback((value: string) => {
        setSelectedGuildId(value);
        setEditingUser(null);
        setSearchQuery('');
    }, []);

    const handleUpdateUser = useCallback(
        async (formData: FormData) => {
            if (!editingUser) return;

            try {
                const result = await updateGuildUser(editingUser.userId, editingUser.guildId, formData);
                if (result.success && result.user) {
                    setUsers(prev => prev.map(u => (u.id === editingUser.id ? result.user! : u)));
                    setEditingUser(null);
                    toast({
                        title: 'Success',
                        description: 'User updated successfully',
                        className: 'bg-green-600 text-white'
                    });
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                console.error('Error updating user:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to update user',
                    className: 'bg-red-600 text-white'
                });
            }
        },
        [editingUser, toast]
    );

    const handleRefresh = useCallback(async () => {
        if (isRefreshing || !selectedGuildId) return;
        setIsRefreshing(true);
        try {
            const usersData = await getGuildUsers(selectedGuildId);
            if (usersData) {
                setUsers(usersData);
                setCurrentPage(1);
                toast({
                    title: 'Success',
                    description: 'Users refreshed successfully',
                    className: 'bg-green-600 text-white'
                });
            }
        } catch (error) {
            console.error('Error refreshing users:', error);
            toast({
                title: 'Error',
                description: 'Failed to refresh users',
                className: 'bg-red-600 text-white'
            });
        } finally {
            setIsRefreshing(false);
        }
    }, [isRefreshing, selectedGuildId, toast]);

    const handleDelete = useCallback(
        async (userId: string, guildId: string) => {
            if (!confirm('Are you sure you want to delete this user?')) return;

            try {
                await deleteGuildUser(userId, guildId);
                setUsers(prev => prev.filter(u => u.userId !== userId));
                toast({
                    title: 'Success',
                    description: 'User deleted successfully',
                    className: 'bg-green-600 text-white'
                });
            } catch (error) {
                console.error('Error deleting user:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to delete user',
                    className: 'bg-red-600 text-white'
                });
            }
        },
        [toast]
    );

    const handleAddUser = useCallback(
        async (formData: FormData) => {
            if (!selectedGuildId) {
                toast({
                    title: 'Error',
                    description: 'Please select a guild first',
                    className: 'bg-red-600 text-white'
                });
                return;
            }

            try {
                const result = await createGuildUser(selectedGuildId, formData);
                if (result.success && result.user) {
                    setUsers(prev => [...prev, result.user as GuildUser]);
                    setIsAddingUser(false);
                    toast({
                        title: 'Success',
                        description: 'User added successfully',
                        className: 'bg-green-600 text-white'
                    });
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                console.error('Error adding user:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to add user',
                    className: 'bg-red-600 text-white'
                });
            }
        },
        [selectedGuildId, toast]
    );

    return {
        // State
        guilds,
        selectedGuildId,
        users: filteredUsers,
        searchQuery,
        isLoading,
        editingUser,
        isRefreshing,
        isAddingUser,
        currentPage,
        itemsPerPage,
        totalPages,

        // Setters
        setSearchQuery,
        setEditingUser,
        setIsAddingUser,
        setCurrentPage,
        setItemsPerPage,

        // Handlers
        handleGuildChange,
        handleUpdateUser,
        handleRefresh,
        handleDelete,
        handleAddUser
    };
}
