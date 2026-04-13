import { Button, Alert, AlertTitle, AlertDescription } from '../ui';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default function NoGuildsState() {
    return (
        <div className="mt-24 space-y-8 py-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Alert>
                <Info className="size-4" />
                <AlertTitle>No Manageable Servers</AlertTitle>
                <AlertDescription>
                    You don't have permission to manage any servers with Zira. Invite Zira to a server where you have
                    the <strong>Manage Server</strong> permission to add the bot. After adding Zira, you'll be
                    redirected back here to manage your servers.
                    <div className="mt-4 flex gap-4">
                        <Button asChild>
                            <Link
                                href={`https://discord.com/oauth2/authorize?client_id=1175425721355730956&scope=bot%20applications.commands&permissions=2489443910&redirect_uri=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/dashboard`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Invite Zira to a Server
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Refresh Dashboard
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    );
}
