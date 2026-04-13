'use client';

import { motion } from 'motion/react';
import { useMemo, useEffect, useState } from 'react';

const CyberBackground = () => {
    const [windowHeight, setWindowHeight] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Mark as mounted on client
        if (typeof window !== 'undefined') {
            setWindowHeight(window.innerHeight);

            const handleResize = () => setWindowHeight(window.innerHeight);
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Generate particles for background effect
    const particles = useMemo(() => {
        return Array.from({ length: 100 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            delay: Math.random() * 10
        }));
    }, []);

    // Generate grid lines
    const gridLines = useMemo(() => {
        const vertical = Array.from({ length: 8 }, (_, i) => ({
            id: `v-${i}`,
            x: (i + 1) * 12.5,
            delay: i * 0.2
        }));
        const horizontal = Array.from({ length: 6 }, (_, i) => ({
            id: `h-${i}`,
            y: (i + 1) * 16.66,
            delay: i * 0.3
        }));
        return { vertical, horizontal };
    }, []);

    // Avoid rendering windowHeight-dependent elements during SSR
    if (!isMounted) {
        return null; // Or a fallback UI that doesn't depend on windowHeight
    }

    return (
        <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-800">
            {/* Animated gradient overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-green-500/10"
                animate={{
                    background: [
                        'linear-gradient(45deg, rgba(6, 182, 212, 0.1) 0%, transparent 50%, rgba(34, 197, 94, 0.1) 100%)',
                        'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 50%, rgba(6, 182, 212, 0.1) 100%)',
                        'linear-gradient(225deg, rgba(6, 182, 212, 0.1) 0%, transparent 50%, rgba(34, 197, 94, 0.1) 100%)',
                        'linear-gradient(315deg, rgba(34, 197, 94, 0.1) 0%, transparent 50%, rgba(6, 182, 212, 0.1) 100%)'
                    ]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: 'reverse'
                }}
            />

            {/* Circuit-like grid lines */}
            <div className="absolute inset-0 opacity-20">
                {/* Vertical lines */}
                {gridLines.vertical.map(line => (
                    <motion.div
                        key={line.id}
                        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                        style={{ left: `${line.x}%` }}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{
                            opacity: [0, 0.5, 0],
                            scaleY: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3,
                            delay: line.delay,
                            repeat: Infinity,
                            repeatDelay: 5
                        }}
                    />
                ))}

                {/* Horizontal lines */}
                {gridLines.horizontal.map(line => (
                    <motion.div
                        key={line.id}
                        className="absolute right-0 left-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"
                        style={{ top: `${line.y}%` }}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{
                            opacity: [0, 0.5, 0],
                            scaleX: [0, 1, 0]
                        }}
                        transition={{
                            duration: 4,
                            delay: line.delay,
                            repeat: Infinity,
                            repeatDelay: 6
                        }}
                    />
                ))}
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0">
                {particles.map((particle, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-cyan-400/60"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`
                        }}
                        animate={{
                            y: [-20, 20, -20],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 8 + Math.random() * 4,
                            delay: particle.delay,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                ))}
            </div>

            {/* Matrix rain effect */}
            <div className="absolute inset-0 opacity-10">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={`rain-${i}`}
                        className="absolute w-px bg-gradient-to-b from-green-400 to-transparent"
                        style={{
                            left: `${i * 5}%`,
                            height: '200px'
                        }}
                        animate={{
                            y: [-200, windowHeight + 200],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    />
                ))}
            </div>

            {/* Scanning line effect */}
            <motion.div
                className="absolute right-0 left-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40"
                animate={{
                    y: [0, windowHeight, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 2
                }}
            />

            {/* Hexagonal pattern overlay */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />
        </div>
    );
};

export default CyberBackground;
