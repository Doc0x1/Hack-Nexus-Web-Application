'use client';

import React, { createContext, useContext, useState } from 'react';

interface CursorContextType {
    isHovering: boolean;
    setIsHovering: (value: boolean) => void;
    isClicking: boolean;
    setIsClicking: (value: boolean) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: React.ReactNode }) {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    return (
        <CursorContext.Provider value={{ isHovering, setIsHovering, isClicking, setIsClicking }}>
            {children}
        </CursorContext.Provider>
    );
}

export function useCursor() {
    const context = useContext(CursorContext);
    if (context === undefined) {
        throw new Error('useCursor must be used within a CursorProvider');
    }
    return context;
}
