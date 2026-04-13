import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { discordId, discordTag } = await request.json();

        if (!discordId || !discordTag) {
            return NextResponse.json({ error: 'Discord ID and tag are required' }, { status: 400 });
        }

        // Check if Discord account is already linked to another user
        const existingDiscordUser = await prisma.user.findUnique({
            where: { discordId }
        });

        if (existingDiscordUser && existingDiscordUser.id !== session.user.id) {
            return NextResponse.json(
                { error: 'This Discord account is already linked to another user' },
                { status: 409 }
            );
        }

        // Update user with Discord info
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                discordId,
                discordTag,
                canAccessBot: true // Enable bot access when Discord is linked
            }
        });

        return NextResponse.json(
            {
                message: 'Discord account linked successfully',
                user: {
                    id: updatedUser.id,
                    discordId: updatedUser.discordId,
                    discordTag: updatedUser.discordTag,
                    canAccessBot: updatedUser.canAccessBot
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Link Discord error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
