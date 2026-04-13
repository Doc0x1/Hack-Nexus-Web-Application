import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update user to remove Discord info
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                discordId: null,
                discordTag: null,
                canAccessBot: false // Disable bot access when Discord is unlinked
            }
        });

        return NextResponse.json(
            {
                message: 'Discord account unlinked successfully',
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
        console.error('Unlink Discord error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
