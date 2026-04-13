'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

/**
 * Reusable labeled input that works seamlessly with react-hook-form.
 *
 * Usage with register:
 *   <LabelInput label="Email" type="email" {...register("email", { required: true })} />
 *
 * Or with Controller (controlled value):
 *   <Controller name="name" control={control} render={({ field }) => (
 *      <LabelInput label="Name" {...field} />
 *   )}/>
 */
export interface LabelInputProps extends React.ComponentPropsWithoutRef<typeof Input> {
    /** Visible text for the label */
    label: string;
    /** Extra class for wrapping <div> */
    containerClassName?: string;
    /** Extra class for <Label> element */
    labelClassName?: string;
    /** Extra class for <Input> element */
    inputClassName?: string;
}

const LabelInput = React.forwardRef<HTMLInputElement, LabelInputProps>(
    (
        {
            label,
            id,
            name,
            containerClassName,
            labelClassName,
            inputClassName,
            className, // allow legacy prop but we split to inputClassName
            ...inputProps
        },
        ref
    ) => {
        // determine an id so label is associated – preference: provided id → name → slugged label
        const inputId = React.useId();
        const resolvedId = id ?? name ?? `input-${inputId}`;

        return (
            <div className={cn('grid w-full max-w-sm items-center gap-3', containerClassName)}>
                <Label htmlFor={resolvedId} className={labelClassName}>
                    {label}
                </Label>
                <Input
                    id={resolvedId}
                    name={name}
                    ref={ref}
                    className={cn(className, inputClassName)}
                    {...inputProps}
                />
            </div>
        );
    }
);

LabelInput.displayName = 'LabelInput';

export { LabelInput };
