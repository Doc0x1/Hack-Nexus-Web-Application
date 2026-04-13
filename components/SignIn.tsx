'use client';

import { signIn } from 'next-auth/react';
import { FaDiscord } from 'react-icons/fa';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui';
import { signInWithCredentials } from '@/app/actions/auth-actions';

export default function SignIn() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [lockedOut, setLockedOut] = useState(false);

    const handleDiscordSignIn = () => {
        setIsLoading(true);
        signIn('discord', { callbackUrl: '/' });
    };

    const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const remember = formData.get('remember') === 'on';

        if (isLogin) {
            // Handle login using server action
            try {
                const result = await signInWithCredentials(email, password, remember);

                if (result.success) {
                    // Successful login - redirect to home
                    window.location.href = '/';
                } else if (result.error) {
                    // Handle specific error types
                    if (result.error.includes('Too many failed')) {
                        setError('Too many failed login attempts. Please wait 15 minutes and try again.');
                        setLockedOut(true);
                    } else if (result.error === 'Invalid credentials') {
                        setError('Invalid email or password');
                    } else if (result.error === 'Account is banned') {
                        setError('Your account has been banned. Contact support for assistance.');
                    } else if (result.error === 'Please verify your email before signing in') {
                        setError('Please verify your email address before signing in.');
                    } else {
                        setError(result.error);
                    }
                } else {
                    setError('Login failed. Please try again.');
                }
            } catch (err) {
                console.error('Login error:', err);
                setError('An unexpected error occurred. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            // Handle registration
            const username = formData.get('username') as string;
            const name = formData.get('name') as string;

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password, username, name })
                });

                const data = await response.json();

                if (response.ok) {
                    setSuccess(data.message);
                    setIsLogin(true); // Switch to login form
                    setError(''); // Clear any previous errors
                } else if (data.details) {
                    // Handle Zod validation errors
                    const errorMessages = data.details.map((detail: any) => detail.message).join(', ');
                    setError(errorMessages);
                } else {
                    setError(data.error || 'Registration failed');
                }
            } catch (err) {
                console.error('Registration error:', err);
                setError('Registration failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Email/Password Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {!isLogin && (
                    <>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required={!isLogin}
                                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                placeholder="johndoe"
                            />
                        </div>
                    </>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="john@example.com"
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                </div>

                {error && (
                    <div className="rounded-md border border-red-500 bg-red-900/50 px-3 py-2 text-sm text-red-200">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-md border border-green-500 bg-green-900/50 px-3 py-2 text-sm text-green-200">
                        {success}
                    </div>
                )}

                {isLogin && (
                    <div className="flex items-center">
                        <input
                            id="remember"
                            name="remember"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-300">
                            Remember me for 30 days
                        </label>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || lockedOut}
                    className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                >
                    {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Register'}
                </button>
            </form>

            {/* Discord OAuth Button */}
            <div className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-slate-900 px-2 text-gray-400">Or</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-1">
                    <Button onClick={handleDiscordSignIn} disabled={isLoading} type="button">
                        <FaDiscord className="size-5" />
                    </Button>
                </div>
            </div>

            {/* Toggle between login and register */}
            <div className="text-center">
                <button
                    type="button"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setSuccess('');
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300"
                >
                    {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
                </button>
            </div>

            {isLogin && (
                <div className="text-center">
                    <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-gray-300">
                        Forgot your password?
                    </Link>
                </div>
            )}
        </div>
    );
}
