import Profile from '@/components/user/Profile';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: {
            username
        }
    });

    if (!user) {
        notFound();
    }

    return <Profile user={user} />;
}
