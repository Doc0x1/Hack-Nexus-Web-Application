// app/login/page.tsx
import SignIn from '@/components/SignIn';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginErrorHandler from '@/components/LoginErrorHandler';

export default async function LoginPage() {
    const session = await auth();

    if (session) {
        redirect('/');
    }

    return (
        <div className="flex grow flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-slate-900/90 p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-white">Hack Nexus Login</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Login to your Hack Nexus account, or sign in with Discord to continue
                    </p>
                </div>

                <LoginErrorHandler />

                <div className="mt-8 space-y-6">
                    <SignIn />
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
