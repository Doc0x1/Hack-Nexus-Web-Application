import SignInToast from '@/components/SignInToast';
import UnauthenticatedToast from '@/components/UnauthenticatedToast';
import NewsTicker from '@/components/NewsTicker';
import WelcomeHero from '@/components/WelcomeHero';
import ToolsTabs from '@/components/ToolsTabs';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

export const experimental_ppr = true;

export default function Home() {
    return (
        <main className="container mx-auto w-full pt-[65px]">
            <div className="relative left-1/2 flex w-[100dvw] -translate-x-1/2 items-center justify-center">
                <Suspense
                    fallback={
                        <div className="flex w-full items-center justify-center gap-2">
                            <span className="mr-2 text-xs md:text-sm">Loading news posts...</span>
                            <LoadingSpinner />
                        </div>
                    }
                >
                    <NewsTicker />
                </Suspense>
            </div>
            <div className="flex w-full flex-col items-center p-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:px-8">
                {/* Left: Hero Text */}
                <div className="w-full max-w-md pb-6 lg:w-1/2 lg:pb-0">
                    <WelcomeHero />
                </div>
                {/* Right: Tools Tabs */}
                <div className="w-full max-w-xl lg:w-1/2">
                    <Suspense fallback={<LoadingSpinner />}>
                        <ToolsTabs />
                    </Suspense>
                </div>
            </div>
            <SignInToast />
            <UnauthenticatedToast />
        </main>
    );
}
