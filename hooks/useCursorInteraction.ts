'use client';

import { useCallback } from 'react';
import { useCursor } from '@/contexts/CursorContext';

export const useCursorInteraction = () => {
    const { setIsHovering, setIsClicking } = useCursor();

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
    }, [setIsHovering]);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
    }, [setIsHovering]);

    const handleMouseDown = useCallback(() => {
        setIsClicking(true);
    }, [setIsClicking]);

    const handleMouseUp = useCallback(() => {
        setIsClicking(false);
    }, [setIsClicking]);

    return {
        handleMouseEnter,
        handleMouseLeave,
        handleMouseDown,
        handleMouseUp
    };
};
