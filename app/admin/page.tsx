import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/auth';
import Link from 'next/link';
import { Newspaper, Users, Settings } from 'lucide-react';

export default async function AdminPage() {
    const session = await auth();

    if (!session?.user?.isAdmin) {
        throw new Error('Unauthorized');
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/news">
                    <Card className="hover:bg-accent transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>News Management</CardTitle>
                            <Newspaper className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-400">Manage news posts and announcements</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/users">
                    <Card className="hover:bg-accent transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>User Management</CardTitle>
                            <Users className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-400">Manage user accounts and permissions</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/settings">
                    <Card className="hover:bg-accent transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Settings</CardTitle>
                            <Settings className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-400">Configure site settings and preferences</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
