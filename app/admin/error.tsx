'use client';

import { Button } from '@/components/ui';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-bold text-red-400">Admin Panel Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center">
                        Something went wrong in the admin panel. Check the server logs for details, or try again.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center gap-3">
                    <Button onClick={reset} variant="outline">
                        Try again
                    </Button>
                    <Button asChild>
                        <Link href="/admin">Back to Admin</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
