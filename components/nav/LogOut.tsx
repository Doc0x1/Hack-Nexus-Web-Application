'use client';

import { LogOut } from 'lucide-react';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { signOut } from 'next-auth/react';

export default function UserSignOut() {
    return (
        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut({ redirectTo: '/' })}>
            <LogOut className="mr-2 size-4" />
            <span>Log out</span>
        </DropdownMenuItem>
    );
}
