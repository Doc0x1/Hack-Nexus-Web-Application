'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    placeholder?: string;
    label?: string;
    className?: string;
}

export default function SearchBar({
    value,
    onChange,
    onRefresh,
    isRefreshing = false,
    placeholder = 'Search...',
    label = 'Search',
    className
}: SearchBarProps) {
    return (
        <div className={cn('space-y-2', className)}>
            <Label htmlFor="search">{label}</Label>
            <div className="flex gap-2">
                <Input id="search" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
                {onRefresh && (
                    <Button variant="outline" size="icon" onClick={onRefresh} disabled={isRefreshing}>
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                )}
            </div>
        </div>
    );
}
