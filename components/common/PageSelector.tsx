'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PageSelectorProps {
    value: number;
    onChange: (value: number) => void;
    options?: number[];
    label?: string;
    className?: string;
}

export default function PageSelector({
    value,
    onChange,
    options = [20, 40, 60, 80, 100],
    label = 'Items per page',
    className
}: PageSelectorProps) {
    return (
        <div className={cn('space-y-2', className)}>
            <Label htmlFor="page-selector">{label}</Label>
            <Select value={value.toString()} onValueChange={val => onChange(parseInt(val))}>
                <SelectTrigger id="page-selector" className="w-20">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="end">
                    {options.map(option => (
                        <SelectItem key={option} value={option.toString()}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
