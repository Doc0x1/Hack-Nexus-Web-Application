'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Settings, User, Shield } from 'lucide-react';
import UserSignOut from './LogOut';
import { navigationMenuTriggerStyle } from '../ui';
import { cn } from '../../lib/utils';
import Link from 'next/link';
import { Session } from 'next-auth';

interface UserMenuProps {
    user: Session['user'];
}

export default function UserMenu({ user }: UserMenuProps) {
    return (
        <DropdownMenu
            modal={false}
            onOpenChange={open => {
                document.documentElement.style.setProperty('--displayBlocker', open ? 'block' : 'none');
            }}
        >
            <DropdownMenuTrigger asChild>
                <Button
                    className={cn(
                        navigationMenuTriggerStyle(),
                        'relative size-10 rounded-full border-none bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:ring-0 focus-visible:outline-0 data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent'
                    )}
                >
                    <Avatar className="size-10">
                        <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : user.username
                                  ? user.username.charAt(0).toUpperCase()
                                  : 'U'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none font-medium">{user.name}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.username}`} className="flex w-full cursor-pointer items-center">
                        <User className="mr-2 size-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <Settings className="mr-2 size-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                {user.isAdmin && (
                    <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex w-full cursor-pointer items-center">
                            <Shield className="mr-2 size-4" />
                            <span>Admin</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <UserSignOut />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
