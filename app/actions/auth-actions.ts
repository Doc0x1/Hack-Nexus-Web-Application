'use server';

import { signIn, auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('discord', { redirectTo: '/' });
    } catch (error) {
        console.error('Authentication error:', error);
        throw error;
    }
}

export async function signInWithCredentials(email: string, password: string, remember: boolean = false) {
    try {
        const result = await signIn('credentials', {
            email,
            password,
            remember: remember.toString(),
            redirect: false
        });

        return { success: !!result, error: null };
    } catch (error: any) {
        console.error('Sign in error:', error);
        
        // Handle specific error messages from our authorize function
        if (error?.message) {
            return { success: false, error: error.message };
        }
        
        return { success: false, error: 'Authentication failed' };
    }
}

export async function registerUser(prevState: any, formData: FormData) {
    const siteSettings = await prisma.siteSettings.findUnique({
        where: { id: '1' }
    });

    if (!siteSettings?.siteRegistrationEnabled) {
        return { error: 'User registration is disabled' };
    }

    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!username || !email || !password) {
        return { error: 'All fields are required' };
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return { error: 'User with this email or username already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'An error occurred during registration' };
    }
}

export async function updateUserProfile(prevState: any, formData: FormData) {
    const session = await auth();

    if (!session?.user) {
        return { error: 'You must be logged in to update your profile' };
    }

    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const location = formData.get('location') as string;
    const website = formData.get('website') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const twitterUrl = formData.get('twitterUrl') as string;

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                name,
                bio,
                location,
                website,
                githubUrl,
                twitterUrl
            }
        });

        revalidatePath(`/profile/${updatedUser.username}`);
        redirect(`/profile/${updatedUser.username}`);
    } catch (error: any) {
        // Re-throw Next.js redirect errors so that the framework can
        // handle the navigation without logging them as failures.
        if (typeof error?.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Update profile error:', error);
        return { error: 'An error occurred while updating your profile' };
    }
}
