'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Newspaper, Settings, Users, Shield, LayoutDashboard } from 'lucide-react';

const sidebarNavItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard
    },
    {
        title: 'News',
        href: '/admin/news',
        icon: Newspaper
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings
    }
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="fixed top-16 left-0 z-0 h-[calc(100vh-4rem)] w-64 border-r bg-slate-950/95 backdrop-blur-sm">
            <div className="flex h-14 items-center border-b border-slate-800 px-4">
                <Shield className="mr-2 h-6 w-6 text-cyan-400" />
                <span className="font-semibold text-cyan-400">Admin Panel</span>
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-1 p-2">
                    {sidebarNavItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? 'secondary' : 'ghost'}
                                className={cn(
                                    'w-full justify-start text-slate-300 hover:text-cyan-400',
                                    pathname === item.href && 'bg-slate-800/50 font-medium text-cyan-400'
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <Icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
