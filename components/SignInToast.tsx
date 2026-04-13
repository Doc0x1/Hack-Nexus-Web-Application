'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export default function SignInToast() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const hasShownToast = useRef(false);

    useEffect(() => {
        const signedIn = searchParams.get('signedIn');

        if (signedIn === 'true' && !hasShownToast.current) {
            hasShownToast.current = true;
            toast({
                title: 'Welcome!',
                description: 'You have successfully signed in.',
                className: 'bg-green-600 text-white',
                duration: 5000
            });
        }

        const newUrl = window.location.pathname;
        router.replace(newUrl, { scroll: false });
    }, [searchParams, router, toast]);

    return null;
}
