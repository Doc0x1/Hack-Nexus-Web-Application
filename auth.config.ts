import { NextAuthConfig } from 'next-auth';

// Helper functions for role checking (no database access)
function isUserAdmin(role?: string): boolean {
    return role === 'ADMIN';
}

function isUserModerator(role?: string): boolean {
    return role === 'MODERATOR' || role === 'ADMIN';
}

export const authConfig: NextAuthConfig = {
    session: {
        strategy: 'jwt', // Use JWT for middleware compatibility
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    callbacks: {
        async authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const pathname = nextUrl.pathname;

            // Admin page access control
            if (pathname.startsWith('/admin')) {
                if (!isLoggedIn || !isUserAdmin(auth.user?.role)) {
                    return Response.redirect(new URL('/login', nextUrl.origin));
                }
                return true;
            }

            // Dashboard access control
            if (pathname.startsWith('/dashboard')) {
                if (!isLoggedIn) {
                    return Response.redirect(new URL('/login', nextUrl.origin));
                }
                return true;
            }

            return true;
        },
        async signIn() {
            // Basic validation - detailed user creation will happen in auth.ts
            return true;
        },
        async jwt({ token, user, account }) {
            // Initial sign in - store user data in token
            if (account && user) {
                token.userId = user.id;
                token.username = user.username;
                token.role = user.role;
                token.isActive = user.isActive;
                token.isBanned = user.isBanned;
                token.discordId = user.discordId || null;
                token.discordTag = user.discordTag || null;
                token.canAccessBot = user.canAccessBot || false;
                token.remember = (user as any).remember || false;
                
                // Store Discord access token for API calls if needed
                if (account.provider === 'discord') {
                    token.accessToken = account.access_token;
                    token.refreshToken = account.refresh_token;
                    token.expiresAt = account.expires_at;
                }
            }
            
            return token;
        },
        async session({ session, token }) {
            // Populate session from token for middleware compatibility
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.userId as string,
                    username: token.username as string,
                    role: token.role as string,
                    isActive: token.isActive as boolean,
                    isBanned: token.isBanned as boolean,
                    discordId: token.discordId as string,
                    discordTag: token.discordTag as string,
                    canAccessBot: token.canAccessBot as boolean,
                    isAdmin: isUserAdmin(token.role as string),
                    isModerator: isUserModerator(token.role as string)
                };
            }
            
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }
    },
    providers: [], // Will be populated in auth.ts
    events: {
        async signIn({ user, account }) {
            console.log(`User ${user.email || user.id} signed in with ${account?.provider}`);
        },
        async signOut() {
            console.log('User signed out');
        }
    }
};