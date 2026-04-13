'use client';

import { NavigationMenuLink } from '../ui/navigation-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';

export const ListItem = React.forwardRef<React.ElementRef<typeof Link>, React.ComponentPropsWithoutRef<typeof Link>>(
    ({ className, title, children, target, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <Link
                        target={target || '_self'}
                        ref={ref}
                        className={cn('block space-y-1 rounded-md p-3 leading-none transition-colors', className)}
                        {...props}
                    >
                        <div className="text-sm font-medium text-cyan-400">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-300">{children}</p>
                    </Link>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = 'ListItem';
