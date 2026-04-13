import { Settings } from 'lucide-react';
import { Skeleton } from '../ui';

export default function LoadingState({ guildsLength }: { guildsLength: number }) {
    return (
        <div className="mt-24 space-y-8 py-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-2xl font-semibold">
                    <Settings className="size-6" />
                    Servers
                </h2>
                <div className="-mx-4 flex flex-wrap">
                    {Array.from({ length: guildsLength }).map((_, index) => (
                        <div
                            key={index}
                            className="m-4 w-64 overflow-hidden rounded-lg bg-gray-900 shadow-lg ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent"
                        >
                            <Skeleton className="h-[180px] w-64" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
