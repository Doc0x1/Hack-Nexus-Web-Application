import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../ui/input';
import { Channel, Role } from '@/types/discord';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useMemo } from 'react';
import { GuildConfig } from '@/types/discord-bot-types';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

interface GuildSettingsFormProps {
    channels: Channel[] | undefined;
    roles: Role[] | undefined;
    onSubmit: (data: GuildConfig) => void;
    isLoading: boolean;
}

const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',
    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10
    }
});

// Convert Discord color integer to hex
const colorIntToHex = (color: number): string => {
    if (!color) return '#000000';
    return `#${color.toString(16).padStart(6, '0')}`;
};

// Custom option component with color circle
const RoleOption = ({ data, ...props }: any) => (
    <div {...props.innerProps} className="flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-gray-700">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colorIntToHex(data.color) }} />
        <span>{data.label}</span>
    </div>
);

// Custom single value component for roles
const RoleSingleValue = ({ data, ...props }: any) => (
    <div {...props.innerProps} className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colorIntToHex(data.color) }} />
        <span>{data.label}</span>
    </div>
);

const GuildSettingsForm = ({ channels, roles, onSubmit, isLoading }: GuildSettingsFormProps) => {
    const {
        register,
        control,
        formState: { errors }
    } = useFormContext<GuildConfig>();
    const animatedComponents = makeAnimated();

    // Memoize channel options
    const channelOptions = useMemo(
        () =>
            channels?.map(channel => ({
                value: channel.id,
                label: channel.name
            })) || [],
        [channels]
    );

    // Memoize role options
    const roleOptions = useMemo(
        () =>
            roles?.map(role => ({
                value: role.id,
                label: role.name,
                color: role.color
            })) || [],
        [roles]
    );

    const channelStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: 'rgb(17, 24, 39)',
            borderColor: errors.prefix ? 'rgb(239, 68, 68)' : 'rgb(55, 65, 81)',
            '&:hover': {
                borderColor: errors.prefix ? 'rgb(239, 68, 68)' : 'rgb(75, 85, 99)'
            },
            minHeight: '38px'
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: 'rgb(17, 24, 39)',
            border: '1px solid rgb(55, 65, 81)'
        }),
        option: (base: any) => ({
            ...base,
            backgroundColor: 'rgb(17, 24, 39)',
            '&:hover': {
                backgroundColor: 'rgb(31, 41, 55)'
            }
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
        valueContainer: (base: any) => ({
            ...base,
            padding: '2px 8px',
            margin: 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px'
        }),
        multiValue: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.data.color
                ? `${colorIntToHex(state.data.color)}33` // 20% opacity of role color
                : 'rgb(59, 130, 246)',
            margin: '2px',
            borderRadius: '4px'
        }),
        multiValueLabel: (base: any) => ({
            ...base,
            color: 'white',
            padding: '2px 6px'
        }),
        multiValueRemove: (base: any) => ({
            ...base,
            color: 'rgb(147, 197, 253)',
            padding: '0 4px',
            ':hover': {
                backgroundColor: 'transparent',
                color: 'rgb(191, 219, 254)'
            }
        })
    };

    const roleStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: 'rgb(17, 24, 39)',
            borderColor: 'rgb(55, 65, 81)',
            '&:hover': {
                borderColor: 'rgb(75, 85, 99)'
            },
            minHeight: '38px'
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: 'rgb(17, 24, 39)',
            border: '1px solid rgb(55, 65, 81)'
        }),
        singleValue: (styles: any, { data }: any) => ({
            ...styles,
            color: 'rgb(229, 231, 235)',
            margin: 0,
            padding: 0,
            ...dot(colorIntToHex(data.color))
        })
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="prefix">Command Prefix</Label>
                <Input
                    id="prefix"
                    {...register('prefix')}
                    placeholder="Command Prefix"
                    className={cn('w-full', errors.prefix && 'border-red-500')}
                    disabled={isLoading}
                />
                {errors.prefix && <p className="text-sm text-red-500">{errors.prefix.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Input
                    id="welcomeMessage"
                    {...register('welcomeMessage')}
                    placeholder="Welcome Message"
                    className="w-full"
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="farewellMessage">Farewell Message</Label>
                <Input
                    id="farewellMessage"
                    {...register('farewellMessage')}
                    placeholder="Farewell Message"
                    className="w-full"
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="loggingChannelId">Logging Channel</Label>
                <Controller
                    name="loggingChannelId"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <Select
                            {...field}
                            inputId="loggingChannelId"
                            value={channelOptions.find(option => option.value === value) || null}
                            onChange={(newValue: any) => onChange(newValue?.value)}
                            options={channelOptions}
                            components={animatedComponents}
                            styles={channelStyles}
                            placeholder="Select a channel"
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        />
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phishingLoggingChannelId">Phishing Message Logging Channel</Label>
                <Controller
                    name="phishingLoggingChannelId"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <Select
                            {...field}
                            inputId="phishingLoggingChannelId"
                            value={channelOptions.find(option => option.value === value) || null}
                            onChange={(newValue: any) => onChange(newValue?.value)}
                            options={channelOptions}
                            components={animatedComponents}
                            styles={channelStyles}
                            placeholder="Select a channel"
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        />
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="muteRoleId">Mute Role</Label>
                <Controller
                    name="muteRoleId"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <Select
                            {...field}
                            inputId="muteRoleId"
                            value={roleOptions.find(option => option.value === value) || null}
                            onChange={(option: any) => onChange(option?.value || null)}
                            options={roleOptions}
                            components={{
                                ...animatedComponents,
                                Option: RoleOption
                            }}
                            styles={roleStyles}
                            placeholder="Select mute role"
                            isClearable
                            menuPlacement="auto"
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        />
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="ownerRoles">Owner Roles</Label>
                <Controller
                    name="ownerRoles"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <Select
                            {...field}
                            inputId="ownerRoles"
                            value={roleOptions.filter(option => value?.includes(option.value))}
                            onChange={(newValue: any) => {
                                onChange(newValue?.map((option: any) => option.value) || []);
                            }}
                            options={roleOptions}
                            components={{
                                ...animatedComponents,
                                Option: RoleOption,
                                SingleValue: RoleSingleValue
                            }}
                            styles={channelStyles}
                            placeholder="Select owner roles"
                            isMulti
                            closeMenuOnSelect={false}
                            menuPlacement="auto"
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        />
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="adminRoles">Admin Roles</Label>
                <Controller
                    name="adminRoles"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <Select
                            {...field}
                            inputId="adminRoles"
                            value={roleOptions.filter(option => value?.includes(option.value))}
                            onChange={(newValue: any) => {
                                onChange(newValue?.map((option: any) => option.value) || []);
                            }}
                            options={roleOptions}
                            components={{
                                ...animatedComponents,
                                Option: RoleOption,
                                SingleValue: RoleSingleValue
                            }}
                            styles={channelStyles}
                            placeholder="Select admin roles"
                            isMulti
                            closeMenuOnSelect={false}
                            menuPlacement="auto"
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        />
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="moderatorRoles">Moderator Roles</Label>
                <Controller
                    name="moderatorRoles"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <Select
                            {...field}
                            inputId="moderatorRoles"
                            value={roleOptions.filter(option => value?.includes(option.value))}
                            onChange={(newValue: any) => {
                                onChange(newValue?.map((option: any) => option.value) || []);
                            }}
                            options={roleOptions}
                            components={{
                                ...animatedComponents,
                                Option: RoleOption,
                                SingleValue: RoleSingleValue
                            }}
                            styles={channelStyles}
                            placeholder="Select moderator roles"
                            isMulti
                            closeMenuOnSelect={false}
                            menuPlacement="auto"
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default GuildSettingsForm;
