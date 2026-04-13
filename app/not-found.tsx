import { Button } from '@/components/ui';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-bold">Page Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center">
                        We couldn&apos;t find the page you&apos;re looking for. The page might have been removed,
                        renamed, or doesn&apos;t exist.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
