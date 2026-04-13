'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import AdminCard from '@/components/admin/AdminCard';
import AddUserDialog from '@/components/admin/AddDiscordUserDialog';
import EditUserDialog from '@/components/admin/EditDiscordUserDialog';
import UserFilters from '@/components/user/UserFilters';
import DataTable from '@/components/common/DataTable';
import { useUserManagement } from '@/hooks/useUserManagement';
import { GuildUser } from '@/types/discord-db-types';

export default function UsersPage() {
    const {
        guilds,
        selectedGuildId,
        users,
        searchQuery,
        isLoading,
        editingUser,
        isRefreshing,
        isAddingUser,
        currentPage,
        itemsPerPage,
        totalPages,
        setSearchQuery,
        setEditingUser,
        setIsAddingUser,
        setCurrentPage,
        setItemsPerPage,
        handleGuildChange,
        handleUpdateUser,
        handleRefresh,
        handleDelete,
        handleAddUser
    } = useUserManagement();

    const renderUserCard = (user: GuildUser) => (
        <AdminCard
            key={user.id}
            title={user.username}
            subtitle={`Level ${user.level} • ${user.exp} XP`}
            badge={user.guildOwner ? { text: 'Guild Owner' } : undefined}
            details={[
                { label: 'Currency', value: user.currency.toString() },
                { label: 'Messages', value: user.messagesSent.toString() },
                { label: 'Voice Time', value: `${user.timeInVoice} minutes` },
                { label: 'Hearts', value: user.hearts.toString() },
                { label: 'TryHackMe', value: user.tryHackMeDetailsUsername || 'Not set' }
            ]}
            onEdit={() => setEditingUser(user)}
            onDelete={() => handleDelete(user.userId, user.guildId)}
        />
    );

    return (
        <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Discord Guild User Management</h1>
                </div>
                <Button variant="outline" className="gap-2" onClick={() => setIsAddingUser(true)}>
                    <Users className="h-4 w-4" />
                    Add Entry
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Guild Users
                        </CardTitle>
                        <div className="text-sm text-slate-400">
                            {users.length} user{users.length !== 1 ? 's' : ''} found
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <UserFilters
                        guilds={guilds}
                        selectedGuildId={selectedGuildId}
                        onGuildChange={handleGuildChange}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />

                    <DataTable
                        data={users}
                        renderItem={renderUserCard}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        isLoading={isLoading}
                        emptyMessage="No users found"
                        loadingMessage="Loading users..."
                    />
                </CardContent>
            </Card>

            <EditUserDialog user={editingUser} onClose={() => setEditingUser(null)} onSubmit={handleUpdateUser} />
            <AddUserDialog open={isAddingUser} onClose={() => setIsAddingUser(false)} onSubmit={handleAddUser} />
        </div>
    );
}
