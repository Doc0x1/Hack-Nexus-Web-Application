import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            username?: string | null;
            role?: string;
            isActive?: boolean;
            isBanned?: boolean;
            discordId?: string | null;
            discordTag?: string | null;
            canAccessBot?: boolean;
            isAdmin?: boolean;
            isModerator?: boolean;
            lastSeenAt?: Date | null;
        };
        accessToken?: string;
        refreshToken?: string;
        error?: string;
        remember?: boolean;
        expiresAt?: number;
        originalExpires?: string;
    }

    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        username?: string | null;
        role?: string;
        isActive?: boolean;
        isBanned?: boolean;
        discordId?: string | null;
        discordTag?: string | null;
        canAccessBot?: boolean;
        lastSeenAt?: Date | null;
        remember?: boolean;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string;
        expiresAt?: number;
        refreshToken?: string;
        error?: string;
        discordId?: string | null;
        discordTag?: string | null;
        userId?: string | null;
        username?: string | null;
        role?: string;
        isActive?: boolean;
        isBanned?: boolean;
        canAccessBot?: boolean;
        remember?: boolean;
        sessionMaxAge?: number;
        picture?: string | null;
    }
}
