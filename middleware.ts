import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const { nextUrl } = request;

    // Get the JWT token for session validation
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === 'production'
    });

    const isLoggedIn = !!token;

    // Define which API routes need protection
    const protectedApiRoutes = [
        '/api/user'
        // Add more protected routes here as needed
    ];

    // Define public API routes that don't need authentication
    const publicApiRoutes = [
        '/api/auth',
        '/api/geolocate',
        '/api/public-news-posts'
        // Add more public routes here as needed
    ];

    // Check if the current path is an API route
    if (nextUrl.pathname.startsWith('/api/')) {
        // Allow public API routes
        if (publicApiRoutes.some(route => nextUrl.pathname.startsWith(route))) {
            return NextResponse.next();
        }

        // Check if it's a protected API route
        if (protectedApiRoutes.some(route => nextUrl.pathname.startsWith(route))) {
            if (!isLoggedIn) {
                return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
            }
        }

        // For other API routes, you can choose to protect or allow
        // Currently allowing all other API routes - modify as needed
        return NextResponse.next();
    }

    // Admin page access control - removed since auth.config.ts handles this
    // Dashboard access control - removed since auth.config.ts handles this

    return NextResponse.next();
}

// Specify which routes the middleware applies to
export const config = {
    matcher: [
        // Apply to all routes except static files
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
        // Explicitly include API routes
        '/api/(.*)'
    ]
};
