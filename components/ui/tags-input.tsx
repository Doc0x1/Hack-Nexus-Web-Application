'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface TagsInputProps extends Omit<React.ComponentPropsWithoutRef<typeof Input>, 'value' | 'onChange'> {
    value: string[];
    onChange: (value: string[]) => void;
    /** Optional validation function; return true to accept tag */
    validate?: (tag: string) => boolean;
}

export const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
    ({ value, onChange, validate, className, placeholder, ...props }, ref) => {
        const [inputValue, setInputValue] = React.useState('');

        const addTag = React.useCallback(
            (tag: string) => {
                const trimmed = tag.trim();
                if (!trimmed) return false;
                if (validate && !validate(trimmed)) return false;
                if (value.includes(trimmed)) return false;
                onChange([...value, trimmed]);
                return true;
            },
            [onChange, validate, value]
        );

        const removeTag = (tag: string) => {
            onChange(value.filter(t => t !== tag));
        };

        const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
            // Only add tag when Enter is pressed (comma should be treated as regular input)
            if (e.key === 'Enter') {
                e.preventDefault();
                const added = addTag(inputValue);
                if (added) {
                    setInputValue('');
                }
            } else if (e.key === 'Backspace' && !inputValue) {
                // Optional: remove last tag on backspace
                onChange(value.slice(0, -1));
            }
        };

        return (
            <div className={cn('border-input flex flex-col gap-2 rounded-md border bg-transparent p-2', className)}>
                <div className="flex flex-wrap items-center gap-2">
                    {value.map(tag => (
                        <Badge key={tag} className="flex items-center gap-1">
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-destructive ml-1 rounded-sm transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
                <Input
                    {...props}
                    ref={ref}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="border-0 bg-transparent px-2 py-1 focus-visible:ring-0"
                />
            </div>
        );
    }
);
TagsInput.displayName = 'TagsInput';
