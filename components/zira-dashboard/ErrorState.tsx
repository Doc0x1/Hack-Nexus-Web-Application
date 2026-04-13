import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui';

export default function ErrorState({ error }: { error: string }) {
    return (
        <div className="mt-24 py-8">
            <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
            <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
}
