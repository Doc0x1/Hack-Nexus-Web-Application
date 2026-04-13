'use client';

import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGuildData } from '@/hooks/useGuildData';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import SaveChangesButton from '@/components/SaveChanges';
import { useCallback, useEffect, useRef } from 'react';
import { GuildConfig } from '@/types/discord-bot-types';
import LevelingSettingsForm from '@/components/zira-dashboard/LevelingSettingsForm';

const defaultGuildConfig: Partial<GuildConfig> = {
    enableLeveling: false,
    announceLevelUps: false,
    Leveling: {
        baseExpPerLevel: 100,
        levelMultiplier: 25,
        baseMessageExpPerMsg: 1,
        minimumMessageExpCooldown: 15,
        maximumMessageExpCooldown: 20,
        baseVoiceExpPerMin: 2,
        minimumTimeInVoice: 2,
        levelUpMessage: '{user} has leveled up to level {level}!',
        levelUpChannelId: null,
        settings: null,
        diminishingVoiceExpFactor: 0.025,
        voiceUpdateInterval: 60,
        maxVoiceExp: 10
    }
};

const normalizeValue = (value: any): any => {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        return value.trim() || null;
    }
    if (Array.isArray(value)) {
        return value.sort();
    }
    if (typeof value === 'object') {
        return Object.entries(value).reduce(
            (acc: Record<string, any>, [key, val]) => ({
                ...acc,
                [key]: normalizeValue(val)
            }),
            {}
        );
    }
    return value;
};

export default function LevelingPage() {
    const params = useParams<{ guildId: string }>();
    const { guildId } = params;
    const methods = useForm<GuildConfig>({
        defaultValues: defaultGuildConfig
    });
    const {
        reset,
        watch,
        formState: { isDirty }
    } = methods;

    const { guildData, isLoading, error: queryError, updateLeveling } = useGuildData(guildId);

    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    const handleCancel = useCallback(() => {
        if (guildData?.settings) {
            reset(guildData.settings);
        }
    }, [guildData?.settings, reset]);

    useEffect(() => {
        const cancelButton = cancelButtonRef.current;
        if (cancelButton && guildData?.settings && isDirty) {
            cancelButton.addEventListener('click', handleCancel);
            return () => cancelButton.removeEventListener('click', handleCancel);
        }
    }, [guildData?.settings, handleCancel, isDirty]);

    useEffect(() => {
        if (guildData?.settings) {
            // Merge the default values with the guild settings to ensure all fields are defined
            const mergedSettings = {
                ...defaultGuildConfig,
                ...guildData.settings,
                Leveling: {
                    ...defaultGuildConfig.Leveling,
                    ...guildData.settings.Leveling
                }
            };
            reset(mergedSettings);
        }
    }, [guildData?.settings, reset]);

    const onSubmit = useCallback(
        async (formData: GuildConfig) => {
            if (!guildData?.settings) return;
            await updateLeveling(formData);
        },
        [guildData, updateLeveling]
    );

    if (isLoading) {
        return (
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Loading...</CardTitle>
                    <CardDescription>Leveling Settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[306px]" />
                </CardContent>
            </Card>
        );
    }

    if (queryError) {
        return (
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>Failed to load leveling settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertDescription>
                            {queryError instanceof Error ? queryError.message : 'An error occurred'}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Leveling Settings</CardTitle>
                <CardDescription>Configure your guild's leveling system</CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider {...methods}>
                    <form id="levelingSettingsForm" onSubmit={methods.handleSubmit(onSubmit)}>
                        <LevelingSettingsForm isLoading={isLoading} />
                        <SaveChangesButton
                            isVisible={isDirty}
                            cancelButtonRef={cancelButtonRef}
                            title="Settings changed!"
                        />
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
