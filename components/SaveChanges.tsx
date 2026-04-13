'use client';

import { Button } from '@/components/ui/button';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { LoadingSpinner } from '@/components/ui/spinner';

interface SaveChangesButtonProps {
    title: string;
    isVisible: boolean;
    cancelButtonRef: React.RefObject<HTMLButtonElement>;
}

const SaveChangesButton = forwardRef<HTMLButtonElement, SaveChangesButtonProps>(
    ({ isVisible, cancelButtonRef, title }, ref) => {
        const {
            formState: { isSubmitting }
        } = useFormContext();

        return (
            <div
                className={`fixed right-0 bottom-0 z-60 max-w-[90vw] min-w-fit transition-all duration-300 ease-in-out md:max-w-[70vw] ${
                    isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
                }`}
            >
                <div className="flex min-w-fit flex-col items-center justify-center pr-6 pb-4 md:pr-12 md:pb-8">
                    <div className="border-base-100 bg-opacity/60 bottom-2 flex flex-row items-center justify-between gap-4 rounded-md bg-green-900 px-4 py-2 shadow-md backdrop-blur-xs">
                        <div className="hidden text-xl text-white md:block">{title}</div>
                        <div className="flex flex-row items-center justify-center gap-2">
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-slate-900 text-sm hover:bg-slate-800"
                                type="button"
                                ref={cancelButtonRef}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                className="flex items-center justify-center gap-2 bg-green-600 transition-colors hover:bg-green-700"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting && <LoadingSpinner size={16} className="mr-1" />} Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

SaveChangesButton.displayName = 'SaveChangesButton';

export default SaveChangesButton;
