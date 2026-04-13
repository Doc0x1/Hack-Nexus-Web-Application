'use client';

import Image from 'next/image';
import React from 'react';

export const Logo = ({ width, height, className }: { width?: number; height?: number; className?: string }) => (
    <Image src="/logo.png" alt="Hack Nexus Logo" sizes="40px" width={width} height={height} className={className} />
);
