import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { FaRobot } from 'react-icons/fa';
import { fonts } from '@/components/fonts';
import { Separator } from '@/components/ui/separator';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';

export default async function BotInDevelopment() {
    const siteSettings = await prisma.siteSettings.findUnique({
        where: { id: '1' }
    });

    if (siteSettings?.siteBotEnabled) {
        redirect('/dashboard');
    }

    return (
        <div className="mt-24 flex flex-col items-center justify-center p-0 px-4 md:px-0">
            <Card className="w-full max-w-2xl rounded-3xl shadow-lg">
                <CardHeader>
                    <CardTitle
                        className={`flex items-center justify-center gap-2 text-sm text-cyan-400 lg:text-2xl ${fonts.jetBrainsMono.className}`}
                    >
                        <FaRobot /> Bot Dashboard in Development
                    </CardTitle>
                    <Separator />
                </CardHeader>
                <CardContent>
                    <div className="text-center text-sm lg:text-lg">
                        <p className="pb-3 text-gray-300">
                            The dashboard for users to configure our bot for other Discord servers is still in
                            development.
                        </p>
                        <p className="pb-3 text-gray-300">
                            We&apos;re working hard to bring this feature to you in the near future.
                        </p>
                        <p className="text-gray-200">
                            Join our{' '}
                            <a href="https://discord.gg/6tSbqvn7K6" className="text-cyan-400 hover:underline">
                                Discord community
                            </a>{' '}
                            for the latest news or check back here later.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
