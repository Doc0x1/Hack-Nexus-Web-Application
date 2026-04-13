'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaDiscord } from 'react-icons/fa';

export default function LinkDiscordAccount() {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLinkDiscord = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Redirect to Discord OAuth with a special state parameter
            const state = btoa(
                JSON.stringify({
                    action: 'link',
                    userId: session?.user?.id
                })
            );

            const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || '')}&response_type=code&scope=identify&state=${state}`;

            window.location.href = discordAuthUrl;
        } catch (error) {
            setError('Failed to initiate Discord linking');
            setIsLoading(false);
        }
    };

    const handleUnlinkDiscord = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/auth/unlink-discord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Discord account unlinked successfully');
                // Update session
                await update();
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Failed to unlink Discord account');
        }
        setIsLoading(false);
    };

    if (!session?.user) {
        return null;
    }

    const isDiscordLinked = !!session.user.discordId;

    return (
        <div className="rounded-lg bg-slate-800 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-white">Discord Account</h3>
                    <p className="mt-1 text-sm text-gray-400">
                        {isDiscordLinked
                            ? `Linked to ${session.user.discordTag || 'Discord account'}`
                            : 'Link your Discord account to access bot features'}
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    {isDiscordLinked ? (
                        <div className="flex items-center space-x-2">
                            <FaDiscord className="text-xl text-[#5865F2]" />
                            <span className="text-sm text-green-400">✓ Linked</span>
                        </div>
                    ) : (
                        <FaDiscord className="text-xl text-gray-500" />
                    )}
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-md border border-red-500 bg-red-900/50 px-3 py-2 text-sm text-red-200">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 rounded-md border border-green-500 bg-green-900/50 px-3 py-2 text-sm text-green-200">
                    {success}
                </div>
            )}

            <div className="mt-4">
                {isDiscordLinked ? (
                    <button
                        onClick={handleUnlinkDiscord}
                        disabled={isLoading}
                        className="inline-flex items-center rounded-md border border-red-600 bg-red-900/50 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-900/70 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                    >
                        {isLoading ? 'Unlinking...' : 'Unlink Discord'}
                    </button>
                ) : (
                    <button
                        onClick={handleLinkDiscord}
                        disabled={isLoading}
                        className="inline-flex items-center rounded-md border border-transparent bg-[#5865F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#4752C4] focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                    >
                        <FaDiscord className="mr-2" />
                        {isLoading ? 'Linking...' : 'Link Discord Account'}
                    </button>
                )}
            </div>

            {!isDiscordLinked && (
                <div className="mt-3 text-xs text-gray-500">
                    Linking your Discord account will enable access to bot dashboard features.
                </div>
            )}
        </div>
    );
}
