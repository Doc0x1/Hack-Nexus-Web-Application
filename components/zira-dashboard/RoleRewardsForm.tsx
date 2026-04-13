'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Trophy, Target } from 'lucide-react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { useRoleRewards } from '@/hooks/useRoleRewards';
import { GuildData } from '@/hooks/useGuildData';
import { RoleReward } from '@/types/discord-bot-types';
import ReactSelect, { SingleValue, MultiValue, ActionMeta } from 'react-select';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

// Form validation schema
const roleRewardFormSchema = z
    .discriminatedUnion('type', [
        z.object({
            type: z.literal('level'),
            roleId: z.string().min(1, 'Role is required'),
            level: z.number().int().min(1, 'Level must be at least 1').max(1000, 'Level cannot exceed 1000')
        }),
        z.object({
            type: z.literal('tryhackme'),
            roleId: z.string().min(1, 'Role is required'),
            roomsRequired: z.number().int().min(0).optional().nullable(),
            rankRequired: z.number().int().min(1).max(21).optional().nullable()
        })
    ])
    .refine(
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

type RoleRewardFormData = z.infer<typeof roleRewardFormSchema>;

interface RoleSelectOption {
    value: string;
    label: string;
    color: number;
}

interface RoleRewardsFormProps {
    guildId: string;
    guildData: GuildData | undefined;
}

// TryHackMe ranks with their hex values and names
const TRYHACKME_RANKS = [
    'Neophyte',
    'Apprentice',
    'Pathfinder',
    'Seeker',
    'Visionary',
    'Voyager',
    'Adept',
    'Hacker',
    'Mage',
    'Wizard',
    'Master',
    'Guru',
    'Legend',
    'Guardian',
    'TITAN',
    'SAGE',
    'VANGUARD',
    'SHOGUN',
    'ASCENDED',
    'MYTHIC',
    'ETERNAL'
];

// Map rank names to numeric values (hex 0x1-0x15 = decimal 1-21)
const RANK_TO_NUMBER: Record<string, number> = {
    Neophyte: 1, // 0x1
    Apprentice: 2, // 0x2
    Pathfinder: 3, // 0x3
    Seeker: 4, // 0x4
    Visionary: 5, // 0x5
    Voyager: 6, // 0x6
    Adept: 7, // 0x7
    Hacker: 8, // 0x8
    Mage: 9, // 0x9
    Wizard: 10, // 0xA
    Master: 11, // 0xB
    Guru: 12, // 0xC
    Legend: 13, // 0xD
    Guardian: 14, // 0xE
    TITAN: 15, // 0xF
    SAGE: 16, // 0x10
    VANGUARD: 17, // 0x11
    SHOGUN: 18, // 0x12
    ASCENDED: 19, // 0x13
    MYTHIC: 20, // 0x14
    ETERNAL: 21 // 0x15
};

const NUMBER_TO_RANK: Record<number, string> = {
    1: 'Neophyte',
    2: 'Apprentice',
    3: 'Pathfinder',
    4: 'Seeker',
    5: 'Visionary',
    6: 'Voyager',
    7: 'Adept',
    8: 'Hacker',
    9: 'Mage',
    10: 'Wizard',
    11: 'Master',
    12: 'Guru',
    13: 'Legend',
    14: 'Guardian',
    15: 'TITAN',
    16: 'SAGE',
    17: 'VANGUARD',
    18: 'SHOGUN',
    19: 'ASCENDED',
    20: 'MYTHIC',
    21: 'ETERNAL'
};

// Convert Discord color integer to hex
const colorIntToHex = (color: number): string => {
    if (!color) return '#99AAB5';
    return `#${color.toString(16).padStart(6, '0')}`;
};

// Custom option component with color circle
const RoleOption = ({ data, innerProps }: any) => (
    <div {...innerProps} className="flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-gray-700">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colorIntToHex(data.color) }} />
        <span>{data.label}</span>
    </div>
);

// Custom single value component for roles
const RoleSingleValue = ({ data }: any) => (
    <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colorIntToHex(data.color) }} />
        <span>{data.label}</span>
    </div>
);

// New Reward Form Component using react-hook-form
const NewRewardForm = ({
    onSubmit,
    onCancel,
    isLoading,
    roleOptions
}: {
    onSubmit: (data: RoleRewardFormData) => void;
    onCancel: () => void;
    isLoading: boolean;
    roleOptions: RoleSelectOption[];
}) => {
    const methods = useForm<RoleRewardFormData>({
        resolver: zodResolver(roleRewardFormSchema),
        defaultValues: {
            type: 'level' as const,
            roleId: '',
            level: 1
        }
    });

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = methods;
    const rewardType = watch('type');

    const roleSelectStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: 'rgb(17, 24, 39)',
            borderColor: errors.roleId ? 'rgb(239, 68, 68)' : 'rgb(55, 65, 81)',
            '&:hover': {
                borderColor: errors.roleId ? 'rgb(239, 68, 68)' : 'rgb(75, 85, 99)'
            },
            minHeight: '38px'
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: 'rgb(17, 24, 39)',
            border: '1px solid rgb(55, 65, 81)'
        }),
        singleValue: (base: any) => ({
            ...base,
            color: 'rgb(229, 231, 235)',
            margin: 0,
            padding: 0
        }),
        input: (base: any) => ({
            ...base,
            color: 'rgb(229, 231, 235)',
            margin: 0,
            padding: 0
        }),
        placeholder: (base: any) => ({
            ...base,
            color: 'rgb(107, 114, 128)'
        }),
        valueContainer: (base: any) => ({
            ...base,
            padding: '2px 8px',
            margin: 0,
            display: 'flex',
            alignItems: 'center'
        })
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Role Reward</CardTitle>
            </CardHeader>
            <CardContent>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(data => onSubmit(data as RoleRewardFormData))} className="space-y-6">
                        <div>
                            <Label className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded bg-gradient-to-r from-green-500 to-blue-500" />
                                Reward Type <span className="text-red-500">*</span>
                            </Label>
                            <p className="text-muted-foreground mt-1 text-xs">
                                Choose between level-based or TryHackMe achievement rewards
                            </p>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={(value: 'level' | 'tryhackme') => field.onChange(value)}
                                    >
                                        <SelectTrigger className={cn(errors.type && 'border-red-500')}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="level">Level Reward</SelectItem>
                                            <SelectItem value="tryhackme">TryHackMe Reward</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                        </div>

                        <div>
                            <Label className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded bg-gradient-to-r from-blue-500 to-purple-500" />
                                Target Role <span className="text-red-500">*</span>
                            </Label>
                            <p className="text-muted-foreground mt-1 text-xs">
                                Role to assign when requirements are met
                            </p>
                            <Controller
                                name="roleId"
                                control={control}
                                render={({ field }) => (
                                    <ReactSelect
                                        value={roleOptions.find(option => option.value === field.value) || null}
                                        onChange={(newValue: any) => field.onChange(newValue?.value || '')}
                                        options={roleOptions}
                                        components={{
                                            Option: RoleOption,
                                            SingleValue: RoleSingleValue,
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={roleSelectStyles}
                                        placeholder="Select a role"
                                        isClearable
                                        isSearchable={true}
                                        menuPlacement="auto"
                                        isLoading={isLoading}
                                        isDisabled={isLoading}
                                    />
                                )}
                            />
                            {errors.roleId && <p className="text-sm text-red-500">{errors.roleId.message}</p>}
                        </div>

                        {rewardType === 'level' ? (
                            <div>
                                <Label className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    Required Level <span className="text-red-500">*</span>
                                </Label>
                                <p className="text-muted-foreground mt-1 text-xs">
                                    Users must reach this level to receive the role
                                </p>
                                <Controller
                                    name="level"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            min="1"
                                            max="1000"
                                            value={field.value || ''}
                                            onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                                            placeholder="Enter level requirement"
                                            className={cn((errors as any).level && 'border-red-500')}
                                            disabled={isLoading}
                                        />
                                    )}
                                />
                                {(errors as any).level && (
                                    <p className="text-sm text-red-500">{(errors as any).level.message}</p>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-blue-500" />
                                        TryHackMe Rooms
                                    </Label>
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        Number of completed rooms required
                                    </p>
                                    <Controller
                                        name="roomsRequired"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                min="0"
                                                value={field.value || ''}
                                                onChange={e => field.onChange(parseInt(e.target.value) || null)}
                                                placeholder="Number of rooms"
                                                className={cn((errors as any).roomsRequired && 'border-red-500')}
                                                disabled={isLoading}
                                            />
                                        )}
                                    />
                                    {(errors as any).roomsRequired && (
                                        <p className="text-sm text-red-500">{(errors as any).roomsRequired.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-green-500" />
                                        TryHackMe Rank
                                    </Label>
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        Minimum rank required to receive the role
                                    </p>
                                    <Controller
                                        name="rankRequired"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value ? NUMBER_TO_RANK[field.value] || 'none' : 'none'}
                                                onValueChange={value =>
                                                    field.onChange(value === 'none' ? null : RANK_TO_NUMBER[value])
                                                }
                                            >
                                                <SelectTrigger
                                                    className={cn((errors as any).rankRequired && 'border-red-500')}
                                                >
                                                    <SelectValue placeholder="Select rank" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">No rank requirement</SelectItem>
                                                    {TRYHACKME_RANKS.map(rank => (
                                                        <SelectItem key={rank} value={rank}>
                                                            {rank}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {(errors as any).rankRequired && (
                                        <p className="text-sm text-red-500">{(errors as any).rankRequired.message}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {errors.root && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.root.message}</AlertDescription>
                            </Alert>
                        )}

                        {rewardType === 'tryhackme' && (
                            <Alert>
                                <AlertDescription className="text-sm">
                                    <strong>Note:</strong> At least one requirement (rooms or rank) must be specified
                                    for TryHackMe rewards.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isLoading}>
                                Create Reward
                            </Button>
                            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
};

const RoleRewardsForm = ({ guildId, guildData }: RoleRewardsFormProps) => {
    const { createReward, deleteReward, isCreating: isMutating } = useRoleRewards(guildId);

    // Get role rewards from cached guild data instead of separate query
    const roleRewards = guildData?.roleRewards;
    const [isCreating, setIsCreating] = useState(false);

    const roles = guildData?.roles || [];

    // Memoize role options for react-select
    const roleOptions = useMemo(
        () =>
            roles?.map(role => ({
                value: role.id,
                label: role.name,
                color: role.color
            })) || [],
        [roles]
    );

    const handleCreateReward = async (data: RoleRewardFormData) => {
        try {
            await createReward(data);
            setIsCreating(false);
        } catch (error) {
            console.error('Failed to create reward:', error);
        }
    };

    const handleDeleteReward = async (reward: RoleReward) => {
        if (confirm('Are you sure you want to delete this role reward?')) {
            try {
                await deleteReward({
                    type: reward.type,
                    rewardId: reward.id
                });
            } catch (error) {
                console.error('Failed to delete reward:', error);
            }
        }
    };

    const getRoleName = (roleId: string) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : 'Unknown Role';
    };

    const getRoleColor = (roleId: string) => {
        const role = roles.find(r => r.id === roleId);
        return role?.color ? colorIntToHex(role.color) : '#99AAB5';
    };

    const RewardCard = ({
        reward,
        onEdit,
        onDelete
    }: {
        reward: RoleReward;
        onEdit: () => void;
        onDelete: () => void;
    }) => (
        <Card
            className="border-l-4 transition-shadow hover:shadow-md"
            style={{ borderLeftColor: getRoleColor(reward.roleId) }}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {reward.type === 'level' ? (
                            <Trophy className="h-5 w-5 text-yellow-500" />
                        ) : (
                            <Target className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                            <div className="flex items-center gap-2 font-medium">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: getRoleColor(reward.roleId) }}
                                />
                                {getRoleName(reward.roleId)}
                            </div>
                            <div className="text-muted-foreground text-sm">
                                {reward.type === 'level' ? (
                                    `Level ${reward.level}`
                                ) : (
                                    <>
                                        {reward.roomsRequired && `${reward.roomsRequired} rooms`}
                                        {reward.roomsRequired && reward.rankRequired && ' • '}
                                        {reward.rankRequired &&
                                            `${NUMBER_TO_RANK[reward.rankRequired] || reward.rankRequired} rank`}
                                    </>
                                )}
                            </div>
                        </div>
                        <Badge variant={reward.type === 'level' ? 'default' : 'secondary'} className="ml-2">
                            {reward.type === 'level' ? 'Level' : 'TryHackMe'}
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onEdit}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={onDelete}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const allRewards = [...(roleRewards?.level || []), ...(roleRewards?.tryhackme || [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="space-y-6">
            <CardHeader>
                <CardTitle>Role Rewards</CardTitle>
                <CardDescription>
                    Automatically assign roles based on user levels or TryHackMe achievements
                </CardDescription>
                <Separator />
                <div className="flex items-center justify-center gap-2">
                    <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Reward
                    </Button>
                </div>
            </CardHeader>

            <div className="px-4">
                {/* Create New Reward */}
                {isCreating && (
                    <NewRewardForm
                        onSubmit={handleCreateReward}
                        onCancel={() => setIsCreating(false)}
                        isLoading={isMutating}
                        roleOptions={roleOptions}
                    />
                )}
                {/* Existing Rewards */}
                <div className="space-y-3">
                    {allRewards.length === 0 ? (
                        <Card>
                            <CardContent className="text-muted-foreground p-6 text-center">
                                No role rewards configured yet. Create your first reward to get started!
                            </CardContent>
                        </Card>
                    ) : (
                        allRewards.map(reward => (
                            <RewardCard
                                key={reward.id}
                                reward={reward}
                                onEdit={() => console.log('Edit not implemented yet')}
                                onDelete={() => handleDeleteReward(reward)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoleRewardsForm;
