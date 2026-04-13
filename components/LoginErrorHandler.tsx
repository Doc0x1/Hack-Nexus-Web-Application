'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginErrorHandler() {
    const searchParams = useSearchParams();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const error = searchParams.get('error');
        console.log(error);
        if (!error) return;

        switch (error) {
            case 'OAuthCallbackError':
            case 'cancelled':
                setErrorMessage('You cancelled the login process or there was an issue with Discord authentication.');
                break;
            case 'CredentialsSignin':
            case 'CallbackRouteError':
                setErrorMessage('Invalid email or password.');
                break;
            default:
                setErrorMessage(error);
        }
    }, [searchParams]);

    if (!errorMessage) return null;

    return <div className="rounded-md bg-red-500/10 p-4 text-center text-sm text-red-400">{errorMessage}</div>;
}
