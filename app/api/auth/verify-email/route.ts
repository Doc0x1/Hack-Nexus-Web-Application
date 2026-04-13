import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
        }

        // Find the verification token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        });

        if (!verificationToken) {
            return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 });
        }

        // Check if token has expired
        if (verificationToken.expires < new Date()) {
            // Delete expired token
            await prisma.verificationToken.delete({
                where: { token }
            });
            return NextResponse.json({ error: 'Verification token has expired' }, { status: 400 });
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: verificationToken.identifier }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update user to verified and active
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                isActive: true
            }
        });

        // Delete the verification token
        await prisma.verificationToken.delete({
            where: { token }
        });

        return NextResponse.json({ message: 'Email verified successfully. You can now log in.' }, { status: 200 });
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
