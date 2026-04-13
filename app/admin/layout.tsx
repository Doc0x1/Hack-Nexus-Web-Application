import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user?.isAdmin) {
        redirect('/');
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] pt-16">
            <AdminSidebar />
            <main className="ml-64 flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}
