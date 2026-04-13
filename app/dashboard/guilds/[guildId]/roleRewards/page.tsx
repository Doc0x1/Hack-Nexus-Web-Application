'use client';

import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGuildData } from '@/hooks/useGuildData';
import RoleRewardsForm from '@/components/zira-dashboard/RoleRewardsForm';

export default function RoleRewardsPage() {
    const params = useParams<{ guildId: string }>();
    const { guildId } = params;
    const { guildData, isLoading, error: queryError } = useGuildData(guildId);

    if (isLoading) {
        return (
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Loading...</CardTitle>
                    <CardDescription>Role Rewards Settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[400px]" />
                </CardContent>
            </Card>
        );
    }

    if (queryError) {
        return (
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>Failed to load role rewards settings</CardDescription>
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
            <RoleRewardsForm guildId={guildId} guildData={guildData} />
        </Card>
    );
}
