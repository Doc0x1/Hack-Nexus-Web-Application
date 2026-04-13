'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import SearchBar from '@/components/common/SearchBar';
import PageSelector from '@/components/common/PageSelector';
import { Guild } from '@/types/discord-db-types';

interface UserFiltersProps {
    guilds: Guild[];
    selectedGuildId: string;
    onGuildChange: (guildId: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
    itemsPerPage: number;
    onItemsPerPageChange: (count: number) => void;
}

export default function UserFilters({
    guilds,
    selectedGuildId,
    onGuildChange,
    searchQuery,
    onSearchChange,
    onRefresh,
    isRefreshing,
    itemsPerPage,
    onItemsPerPageChange
}: UserFiltersProps) {
    return (
        <div className="mb-6 grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
                <Label htmlFor="guild-select">Select Guild</Label>
                <Select value={selectedGuildId} onValueChange={onGuildChange}>
                    <SelectTrigger id="guild-select">
                        <SelectValue placeholder="Select a guild" />
                    </SelectTrigger>
                    <SelectContent>
                        {guilds.map(guild => (
                            <SelectItem key={guild.id} value={guild.id}>
                                {guild.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                onRefresh={onRefresh}
                isRefreshing={isRefreshing}
                placeholder="Search by username..."
                label="Search Users"
            />

            <PageSelector
                value={itemsPerPage}
                onChange={onItemsPerPageChange}
                options={[20, 40, 60, 80, 100]}
                label="Users per page"
                className="place-items-end"
            />
        </div>
    );
}
