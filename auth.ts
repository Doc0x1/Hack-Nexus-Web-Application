import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Discord, { DiscordProfile } from 'next-auth/providers/discord';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { checkBruteForce, recordFailedAttempt, resetAttempts } from '@/lib/rateLimiter';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Role } from '@prisma/client';

// Helper function to determine user role based on email
async function getUserRole(email: string): Promise<Role> {
    try {
        const siteSettings = await prisma.siteSettings.findUnique({
            where: { id: '1' }
        });

        if (!siteSettings) return 'MEMBER';

        if (siteSettings.siteAdminUserEmails.includes(email)) return 'ADMIN';
        if (siteSettings.siteModeratorUserEmails.includes(email)) return 'MODERATOR';

        return 'MEMBER';
    } catch (error) {
        console.error('Error determining user role:', error);
        return 'MEMBER';
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt', // Use JWT for middleware compatibility
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, account, profile }) {
            // Initial sign in or when user data is available
            if (user) {
                token.userId = user.id;
                token.username = user.username;
                token.role = user.role;
                token.isActive = user.isActive;
                token.isBanned = user.isBanned;
                token.discordId = user.discordId || null;
                token.discordTag = user.discordTag || null;
                token.canAccessBot = user.canAccessBot || false;
                token.remember = (user as any).remember || false;
                
                // For Discord, get the image from the profile directly  
                if (account?.provider === 'discord' && profile) {
                    const discordProfile = profile as DiscordProfile;
                    token.picture = discordProfile.image_url || user.image;
                } else {
                    token.picture = user.image;
                }

                // Store Discord access token for API calls if needed
                if (account?.provider === 'discord') {
                    token.accessToken = account.access_token;
                    token.refreshToken = account.refresh_token;
                    token.expiresAt = account.expires_at;
                }
            }
            // If no user data but we have a token with userId, get fresh user data
            else if (token.userId && !token.role) {
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: token.userId as string },
                        select: {
                            id: true,
                            username: true,
                            role: true,
                            isActive: true,
                            isBanned: true,
                            discordId: true,
                            discordTag: true,
                            canAccessBot: true,
                            image: true // Include image for token refresh
                        }
                    });

                    if (dbUser) {
                        token.username = dbUser.username;
                        token.role = dbUser.role;
                        token.isActive = dbUser.isActive;
                        token.isBanned = dbUser.isBanned;
                        token.discordId = dbUser.discordId;
                        token.discordTag = dbUser.discordTag;
                        token.canAccessBot = dbUser.canAccessBot;
                        token.picture = dbUser.image; // Update image in token
                    }
                } catch (error) {
                    console.error('Failed to fetch user data for token:', error);
                }
            }

            return token;
        },
        async signIn({ user, account, profile }) {
            // Allow credentials sign-in to proceed normally
            if (account?.provider === 'credentials') {
                return true;
            }

            // Handle Discord OAuth with database operations
            if (account?.provider === 'discord' && user.email && profile) {
                try {
                    const discordProfile = profile as DiscordProfile;
                    const role = await getUserRole(user.email);
                    const discordUsername = discordProfile.username || discordProfile.global_name;
                    const avatarUrl = discordProfile.image_url || user.image;

                    // Always update the user's Discord info including avatar on each login
                    await prisma.user.upsert({
                        where: { email: user.email },
                        update: {
                            name: discordUsername,
                            image: avatarUrl,
                            discordId: discordProfile.id,
                            discordTag: discordUsername,
                            canAccessBot: true,
                            lastLoginAt: new Date(),
                            lastSeenAt: new Date(),
                            role: role,
                            isActive: true
                        },
                        create: {
                            email: user.email,
                            name: discordUsername,
                            username: discordUsername?.toLowerCase().replace(/[^a-z0-9]/g, '') || null,
                            image: avatarUrl,
                            discordId: discordProfile.id,
                            discordTag: discordUsername,
                            canAccessBot: true,
                            role: role,
                            isActive: true
                        }
                    });

                    return true;
                } catch (error) {
                    console.error('Error during Discord sign-in:', error);
                    return false;
                }
            }

            return true;
        },
        async session({ session, token }) {
            // Populate session from token (JWT strategy)
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.userId as string,
                    name: session.user?.name,
                    image: token.picture || session.user?.image,
                    username: token.username as string,
                    role: token.role as string,
                    isActive: token.isActive as boolean,
                    isBanned: token.isBanned as boolean,
                    discordId: token.discordId as string,
                    discordTag: token.discordTag as string,
                    canAccessBot: token.canAccessBot as boolean,
                    isAdmin: token.role === 'ADMIN',
                    isModerator: token.role === 'MODERATOR' || token.role === 'ADMIN'
                };

                // Add Discord tokens to session for API calls
                session.accessToken = token.accessToken as string;
                session.refreshToken = token.refreshToken as string;
                session.expiresAt = token.expiresAt as number;

                // Update last seen in background (non-blocking)
                if (token.userId) {
                    prisma.user
                        .update({
                            where: { id: token.userId as string },
                            data: { lastSeenAt: new Date() }
                        })
                        .catch(error => {
                            console.error('Failed to update last seen:', error);
                        });
                }
            }

            return session;
        }
    },
    providers: [
        Discord({
            authorization: {
                url: 'https://discord.com/api/oauth2/authorize',
                params: {
                    scope: 'identify guilds'
                }
            }
        }),
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                remember: { label: 'Remember Me', type: 'checkbox' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const email = (credentials.email as string).toLowerCase();

                // Rate limiting
                try {
                    checkBruteForce(email);
                } catch (err) {
                    throw new Error((err as Error).message);
                }

                const user = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        name: true,
                        image: true,
                        password: true,
                        role: true,
                        isActive: true,
                        isBanned: true,
                        emailVerified: true,
                        discordId: true,
                        discordTag: true,
                        canAccessBot: true
                    }
                });

                if (!user || !user.password) {
                    recordFailedAttempt(email);
                    throw new Error('Invalid credentials');
                }

                if (user.isBanned) {
                    throw new Error('Account is banned');
                }

                if (!user.isActive) {
                    throw new Error('Please verify your email before signing in');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

                if (!isPasswordValid) {
                    recordFailedAttempt(email);
                    throw new Error('Invalid credentials');
                }

                // Successful login
                resetAttempts(email);

                // Update last login
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        lastLoginAt: new Date(),
                        lastSeenAt: new Date()
                    }
                });

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    image: user.image,
                    role: user.role,
                    isActive: user.isActive,
                    isBanned: user.isBanned,
                    discordId: user.discordId,
                    discordTag: user.discordTag,
                    canAccessBot: user.canAccessBot,
                    remember: credentials.remember === 'true'
                };
            }
        })
    ]
});
