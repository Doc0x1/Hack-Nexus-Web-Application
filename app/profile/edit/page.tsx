import EditProfileForm from '@/components/user/EditProfileForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function EditProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    });

    if (!user) {
        console.log('redirecting to login');
        redirect('/login');
    }

    return (
        <div className="container mx-auto">
            <EditProfileForm user={user} />
        </div>
    );
}
