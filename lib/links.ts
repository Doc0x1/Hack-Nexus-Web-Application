import type { Link } from '@/types/app-types';

export const navLinks: Link[] = [
    { name: 'Tools', href: '/tools' },
    { name: 'Zira', href: '/dashboard' },
    { name: 'Blog', href: `https://blog.${process.env.NEXT_PUBLIC_DOMAIN_NAME}`, target: '_blank' },
    { name: 'Discord', href: 'https://discord.gg/6tSbqvn7K6', target: '_blank' },
    { name: 'Patreon', href: 'https://patreon.com/hacknexus', target: '_blank' }
];
