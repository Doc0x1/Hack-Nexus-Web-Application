import './globals.css';
import '@radix-ui/themes/styles.css';
import { fonts } from '@/components/fonts';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import Providers from '@/components/Providers';
import type { Session } from 'next-auth';
import NavBar from '@/components/nav/NavBar';
import { Toaster } from '@/components/ui/sonner';
import CyberBackground from '@/components/CyberBackground';

interface RootLayoutProps {
    children: React.ReactNode;
    params: {
        session: Session | null;
        [key: string]: any;
    };
}

export const metadata: Metadata = {
    title: 'Hack Nexus',
    description: 'Welcome to Hack Nexus'
};

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className={`${fonts.openSans.className} h-dvh`}>
            <body className={`dark relative flex h-full w-full flex-col`}>
                <Providers>
                    <NavBar />
                    {children}
                    <div className="fixed inset-0 -z-10">
                        <CyberBackground />
                    </div>
                    <Toaster />
                </Providers>
            </body>
            <Analytics mode="auto" />
        </html>
    );
}
