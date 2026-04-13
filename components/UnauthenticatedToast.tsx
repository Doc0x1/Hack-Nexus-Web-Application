'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export default function UnauthenticatedToast() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const hasShownToast = useRef(false);

    useEffect(() => {
        const unauthenticated = searchParams.get('unauthenticated');

        if (unauthenticated === 'true' && !hasShownToast.current) {
            hasShownToast.current = true;
            toast({
                title: 'Access Denied',
                description: 'Please sign in with Discord to access that page.',
                className: 'bg-red-600 text-white',
                duration: 5000
            });
        }
        const newUrl = window.location.pathname;
        router.replace(newUrl, { scroll: false });
    }, [searchParams, router, toast]);

    return null;
}
