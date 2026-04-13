import RegisterForm from '@/components/RegisterForm';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';

export default async function RegisterPage() {
    const siteSettings = await prisma.siteSettings.findUnique({
        where: { id: '1' }
    });

    if (!siteSettings?.siteRegistrationEnabled) {
        return redirect('/');
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
                <h1 className="text-center text-2xl font-bold">Register</h1>
                <RegisterForm />
            </div>
        </div>
    );
}
