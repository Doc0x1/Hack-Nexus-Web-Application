'use client';

import React from 'react';
import Link from 'next/link';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserMenu from './UserMenu';
import { FaDiscord, FaPatreon, FaBars, FaTools, FaRobot, FaBlog, FaHome, FaSignInAlt } from 'react-icons/fa';
import type { Session } from 'next-auth';

interface MobileSidebarProps {
    Logo: React.ComponentType<{ height: number; width: number }>;
    session: Session | null;
}

export function MobileSidebar({ Logo, session }: MobileSidebarProps) {
    const domain = process.env.NEXT_PUBLIC_DOMAIN_NAME;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden" aria-label="Open menu">
                    <FaBars size={24} />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 border-r border-slate-800 bg-slate-950/95 p-0 backdrop-blur-sm">
                <div className="flex h-[100dvh] flex-col overflow-y-auto">
                    <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
                        <SheetTitle className="flex items-center justify-center gap-2 py-6 text-2xl font-bold text-cyan-400">
                            <Logo height={32} width={32} />
                            Hack Nexus
                        </SheetTitle>
                        <Separator className="mb-6" />
                    </div>

                    {/* Main Navigation */}
                    <nav className="flex flex-col gap-1 p-4">
                        <SheetClose asChild>
                            <Link
                                href="/"
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-cyan-400"
                            >
                                <FaHome size={20} />
                                Home
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link
                                href="/tools"
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-cyan-400"
                            >
                                <FaTools size={20} />
                                Tools
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-cyan-400"
                            >
                                <FaRobot size={20} />
                                Zira (Discord Bot)
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link
                                href={`https://blog.${domain}`}
                                target="_blank"
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-cyan-400"
                            >
                                <FaBlog size={20} />
                                Blog
                            </Link>
                        </SheetClose>
                    </nav>

                    <Separator className="my-4" />

                    {/* Social Links */}
                    <div className="flex flex-col gap-2 px-4">
                        <SheetClose asChild>
                            <Link
                                href="https://discord.gg/6tSbqvn7K6"
                                target="_blank"
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-cyan-400"
                            >
                                <FaDiscord size={20} /> Discord
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link
                                href="https://patreon.com/hacknexus"
                                target="_blank"
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-cyan-400"
                            >
                                <FaPatreon size={20} /> Patreon
                            </Link>
                        </SheetClose>
                    </div>

                    {/* User Section */}
                    <div className="mt-auto border-t border-slate-800 bg-slate-950/95 p-4 backdrop-blur-sm">
                        {session?.user ? (
                            <UserMenu user={session.user} />
                        ) : (
                            <SheetClose asChild>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-3 rounded-lg border border-slate-800 px-4 py-3 text-lg font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-cyan-400"
                                >
                                    <FaSignInAlt size={20} /> Sign In
                                </Link>
                            </SheetClose>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
