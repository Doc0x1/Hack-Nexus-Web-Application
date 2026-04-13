'use client';

import { Button } from '@/components/ui';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect } from 'react';

export default function DashboardError({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-bold text-red-400">Dashboard Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center">
                        Something went wrong loading the dashboard. This may be due to a temporary service outage.
                        Try refreshing or return to the home page.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center gap-3">
                    <Button onClick={reset} variant="outline">
                        Try again
                    </Button>
                    <Button asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
