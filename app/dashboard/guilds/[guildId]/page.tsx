// app/[guildId]/page.tsx
'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import GuildSettingsForm from '@/components/zira-dashboard/GuildSettingsForm';
import SaveChangesButton from '@/components/SaveChanges';
import { GuildConfig } from '@/types/discord-bot-types';
import { useCallback, useEffect, useRef } from 'react';
import { useGuildData } from '@/hooks/useGuildData';

export default function GuildPage() {
    const params = useParams<{ guildId: string }>();
    const { guildId } = params;
    const methods = useForm<GuildConfig>({
        defaultValues: {
            ownerRoles: [],
            adminRoles: [],
            moderatorRoles: [],
            welcomeMessage: null,
            farewellMessage: null,
            muteRoleId: null
        }
    });
    const {
        reset,
        watch,
        formState: { isDirty }
    } = methods;

    const { guildData, isLoading, error: queryError, updateSettings } = useGuildData(guildId);

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
            reset(guildData.settings);
        }
    }, [guildData?.settings, reset]);

    const onSubmit = useCallback(
        async (formData: GuildConfig) => {
            await updateSettings(formData);
        },
        [updateSettings]
    );

    if (isLoading) {
        return (
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Loading...</CardTitle>
                    <CardDescription>Guild Settings</CardDescription>
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
                    <CardDescription>Failed to load guild settings</CardDescription>
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
                <CardTitle>Guild Settings</CardTitle>
                <CardDescription>Configure your guild settings</CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider {...methods}>
                    <form id="guildSettingsForm" onSubmit={methods.handleSubmit(onSubmit)}>
                        <GuildSettingsForm
                            channels={guildData?.channels}
                            roles={guildData?.roles}
                            onSubmit={onSubmit}
                            isLoading={isLoading}
                        />
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
