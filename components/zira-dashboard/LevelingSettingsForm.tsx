import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { GuildConfig } from '@/types/discord-bot-types';
import { cn } from '@/lib/utils';

interface LevelingSettingsFormProps {
    isLoading: boolean;
}

const LevelingSettingsForm = ({ isLoading }: LevelingSettingsFormProps) => {
    const {
        control,
        formState: { errors }
    } = useFormContext<GuildConfig>();

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: number) => void) => {
        const value = e.target.value === '' ? 0 : Number(e.target.value);
        onChange(value);
    };

    return (
        <div className="space-y-6">
            {/* Feature Toggles */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Feature Toggles</h3>

                <div className="space-y-2">
                    <Label htmlFor="enableLeveling">Enable Leveling System</Label>
                    <Controller
                        name="enableLeveling"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Switch
                                id="enableLeveling"
                                checked={value}
                                onCheckedChange={onChange}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        Enable or disable the leveling system for this guild
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="announceLevelUps">Announce Level Ups</Label>
                    <Controller
                        name="announceLevelUps"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Switch
                                id="announceLevelUps"
                                checked={value}
                                onCheckedChange={onChange}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        Announce when users level up in the level up channel
                    </p>
                </div>
            </div>

            {/* Leveling Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Leveling Settings</h3>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.baseExpPerLevel">Base Experience per Level</Label>
                    <Controller
                        name="Leveling.baseExpPerLevel"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <Input
                                {...field}
                                type="number"
                                id="Leveling.baseExpPerLevel"
                                placeholder="100"
                                value={value ?? ''}
                                onChange={e => handleNumberChange(e, onChange)}
                                className={cn('w-full', errors.Leveling?.baseExpPerLevel && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        The base amount of experience points required to level up
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.levelMultiplier">Level Multiplier</Label>
                    <Controller
                        name="Leveling.levelMultiplier"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <Input
                                {...field}
                                type="number"
                                id="Leveling.levelMultiplier"
                                step="0.1"
                                placeholder="1.5"
                                value={value ?? ''}
                                onChange={e => handleNumberChange(e, onChange)}
                                className={cn('w-full', errors.Leveling?.levelMultiplier && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        Multiplier applied to experience requirements for each level (e.g., 1.5 means each level
                        requires 50% more XP)
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.baseMessageExpPerMsg">Base Message Experience</Label>
                    <Controller
                        name="Leveling.baseMessageExpPerMsg"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <Input
                                {...field}
                                type="number"
                                id="Leveling.baseMessageExpPerMsg"
                                placeholder="15"
                                value={value ?? ''}
                                onChange={e => handleNumberChange(e, onChange)}
                                className={cn('w-full', errors.Leveling?.baseMessageExpPerMsg && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">Base experience points awarded for each message</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.minimumMessageExpCooldown">Minimum Message Cooldown (seconds)</Label>
                    <Controller
                        name="Leveling.minimumMessageExpCooldown"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <Input
                                {...field}
                                type="number"
                                id="Leveling.minimumMessageExpCooldown"
                                placeholder="30"
                                value={value ?? ''}
                                onChange={e => handleNumberChange(e, onChange)}
                                className={cn('w-full', errors.Leveling?.minimumMessageExpCooldown && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        Minimum time in seconds between messages that can earn experience
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.maximumMessageExpCooldown">Maximum Message Cooldown (seconds)</Label>
                    <Controller
                        name="Leveling.maximumMessageExpCooldown"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <Input
                                {...field}
                                type="number"
                                id="Leveling.maximumMessageExpCooldown"
                                placeholder="60"
                                value={value ?? ''}
                                onChange={e => handleNumberChange(e, onChange)}
                                className={cn('w-full', errors.Leveling?.maximumMessageExpCooldown && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        Maximum time in seconds between messages that can earn experience
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.baseVoiceExpPerMin">Base Voice Experience per Minute</Label>
                    <Controller
                        name="Leveling.baseVoiceExpPerMin"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <Input
                                {...field}
                                type="number"
                                id="Leveling.baseVoiceExpPerMin"
                                placeholder="10"
                                value={value ?? ''}
                                onChange={e => handleNumberChange(e, onChange)}
                                className={cn('w-full', errors.Leveling?.baseVoiceExpPerMin && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        Base experience points awarded per minute in voice channels
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.minimumTimeInVoice">Minimum Time in Voice (minutes)</Label>
                    <Controller
                        name="Leveling.minimumTimeInVoice"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <Input
                                {...field}
                                type="number"
                                id="Leveling.minimumTimeInVoice"
                                placeholder="1"
                                value={value ?? ''}
                                onChange={e => handleNumberChange(e, onChange)}
                                className={cn('w-full', errors.Leveling?.minimumTimeInVoice && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        Minimum time in minutes required in voice to earn experience
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.diminishingVoiceExpFactor">Diminishing Voice Experience Factor</Label>
                    <Controller
                        name="Leveling.diminishingVoiceExpFactor"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <Input
                                {...field}
                                type="number"
                                id="Leveling.diminishingVoiceExpFactor"
                                step="0.001"
                                placeholder="0.025"
                                value={value ?? ''}
                                onChange={e => handleNumberChange(e, onChange)}
                                className={cn('w-full', errors.Leveling?.diminishingVoiceExpFactor && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        Factor by which voice experience diminishes over time (e.g., 0.025 means 2.5% reduction per
                        interval)
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.voiceUpdateInterval">Voice Update Interval (seconds)</Label>
                    <Controller
                        name="Leveling.voiceUpdateInterval"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <Input
                                {...field}
                                type="number"
                                id="Leveling.voiceUpdateInterval"
                                placeholder="60"
                                value={value ?? ''}
                                onChange={e => handleNumberChange(e, onChange)}
                                className={cn('w-full', errors.Leveling?.voiceUpdateInterval && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        How often (in seconds) voice experience is calculated and updated
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.maxVoiceExp">Maximum Voice Experience per Interval</Label>
                    <Controller
                        name="Leveling.maxVoiceExp"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <Input
                                {...field}
                                type="number"
                                id="Leveling.maxVoiceExp"
                                placeholder="10"
                                value={value ?? ''}
                                onChange={e => handleNumberChange(e, onChange)}
                                className={cn('w-full', errors.Leveling?.maxVoiceExp && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        Maximum experience points that can be earned per voice update interval
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.levelUpMessage">Level Up Message</Label>
                    <Controller
                        name="Leveling.levelUpMessage"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="Leveling.levelUpMessage"
                                placeholder="🎉 {user} has reached level {level}!"
                                className={cn('w-full', errors.Leveling?.levelUpMessage && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        Message sent when a user levels up. Use {'{user}'} for username and {'{level}'} for the new
                        level
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Leveling.levelUpChannelId">Level Up Channel</Label>
                    <Controller
                        name="Leveling.levelUpChannelId"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="Leveling.levelUpChannelId"
                                placeholder="Channel ID for level up messages"
                                value={field.value ?? ''}
                                className={cn('w-full', errors.Leveling?.levelUpChannelId && 'border-red-500')}
                                disabled={isLoading}
                            />
                        )}
                    />
                    <p className="text-muted-foreground text-sm">
                        Channel where level up messages will be sent (leave empty to use the same channel)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LevelingSettingsForm;
