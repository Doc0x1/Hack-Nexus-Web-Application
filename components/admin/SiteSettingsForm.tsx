'use client';

import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import SaveChangesButton from '@/components/SaveChanges';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { updateSiteSettings } from '@/app/admin/settings/actions';
import type { SiteSettings } from '@prisma/client';
import { LabelInput } from '../ui/label-input';
import { TagsInput } from '../ui/tags-input';
import { Separator } from '../ui/separator';

interface SiteSettingsFormProps {
    settings: SiteSettings;
}

interface SiteSettingsFormValues {
    siteName: string;
    siteDescription: string;
    siteLogo: string;
    siteFavicon: string;
    siteTheme: string;
    siteLanguage: string;
    siteBotEnabled: boolean;
    siteRegistrationEnabled: boolean;
    siteAdminUserEmails: string[];
    siteModeratorUserEmails: string[];
}

export default function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
    const methods = useForm<SiteSettingsFormValues>({
        defaultValues: {
            siteName: settings.siteName || '',
            siteDescription: settings.siteDescription || '',
            siteLogo: settings.siteLogo || '',
            siteFavicon: settings.siteFavicon || '',
            siteTheme: settings.siteTheme || 'dark',
            siteLanguage: settings.siteLanguage || 'en',
            siteBotEnabled: settings.siteBotEnabled,
            siteRegistrationEnabled: settings.siteRegistrationEnabled,
            siteAdminUserEmails: settings.siteAdminUserEmails,
            siteModeratorUserEmails: settings.siteModeratorUserEmails
        }
    });

    const {
        handleSubmit,
        watch,
        reset,
        control,
        formState: { isDirty, isSubmitting }
    } = methods;

    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    const onSubmit = useCallback(
        async (data: SiteSettingsFormValues) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                // Boolean values need to be converted
                if (typeof value === 'boolean') {
                    if (value) formData.append(key, 'on');
                } else if (Array.isArray(value)) {
                    formData.append(key, value.join(', '));
                } else {
                    formData.append(key, value);
                }
            });

            const result = await updateSiteSettings(undefined as any, formData);
            if (result.success) {
                toast.success('Settings updated successfully', {
                    dismissible: true,
                    closeButton: true,
                    classNames: { success: '!bg-green-600' }
                });
                reset(data); // reset dirty state
            } else {
                toast.error(result.error ?? 'Failed to update', {
                    dismissible: true,
                    closeButton: true,
                    classNames: { error: '!bg-red-600' }
                });
            }
        },
        [toast, reset]
    );

    // Cancel handler resets to original settings
    const handleCancel = useCallback(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        const btn = cancelButtonRef.current;
        if (btn) {
            btn.addEventListener('click', handleCancel);
            return () => btn.removeEventListener('click', handleCancel);
        }
    }, [handleCancel]);

    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle>For easily configuring different aspects of the site</CardTitle>
            </CardHeader>
            <CardContent>
                <FormProvider {...methods}>
                    <form id="siteSettingsForm" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Text inputs */}
                            <LabelInput label="Site Name" {...methods.register('siteName', { required: true })} />
                            <LabelInput label="Site Language" {...methods.register('siteLanguage')} />
                            <LabelInput
                                containerClassName="md:col-span-2 max-w-full"
                                label="Site Description"
                                {...methods.register('siteDescription')}
                            />
                            <LabelInput label="Site Logo URL" {...methods.register('siteLogo')} />
                            <LabelInput label="Site Favicon URL" {...methods.register('siteFavicon')} />
                            <LabelInput label="Site Theme" {...methods.register('siteTheme')} />

                            {/* Switches */}
                            <div className="flex flex-col gap-3 md:col-span-2">
                                <Label className="text-sm font-medium">Features</Label>
                                <div className="flex items-center gap-4">
                                    <Controller
                                        name="siteBotEnabled"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    id="siteBotEnabled"
                                                    name="siteBotEnabled"
                                                    checked={value}
                                                    onCheckedChange={onChange}
                                                />
                                                <Label htmlFor="siteBotEnabled" className="!mb-0">
                                                    Bot Enabled
                                                </Label>
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name="siteRegistrationEnabled"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    id="siteRegistrationEnabled"
                                                    name="siteRegistrationEnabled"
                                                    checked={value}
                                                    onCheckedChange={onChange}
                                                />
                                                <Label htmlFor="siteRegistrationEnabled" className="!mb-0">
                                                    User Registration
                                                </Label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            <Separator className="md:col-span-2" />
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <Label className="text-sm font-medium">Admin Emails</Label>
                                <Controller
                                    name="siteAdminUserEmails"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TagsInput
                                            value={value}
                                            onChange={onChange}
                                            placeholder="Type email and press [ENTER]"
                                            validate={email => /.+@.+\..+/.test(email)}
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <Label className="text-sm font-medium">Moderator Emails</Label>
                                <Controller
                                    name="siteModeratorUserEmails"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TagsInput
                                            value={value}
                                            onChange={onChange}
                                            placeholder="Type email and press [ENTER]"
                                            validate={email => /.+@.+\..+/.test(email)}
                                        />
                                    )}
                                />
                            </div>
                        </div>
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
