import { CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui';
import Link from 'next/link';
import { FaDoorOpen, FaMedal, FaTrophy, FaCrown } from 'react-icons/fa';
import { Separator } from './ui/separator';
import { fonts } from './fonts';
import { unstable_cache } from 'next/cache';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface LeaderboardUser {
    id: string;
    username: string;
    tryhackmeUrl: string;
    level: number;
    avatarUrl: string;
    rank: number;
    rooms: number;
    confirmed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const getLeaderboard = unstable_cache(
    async () => {
        try {
            const leaderboardUsers = await fetch(
                `${process.env.DISCORD_BOT_URL}/api/guilds/1175382045623586877/thmleaderboard`,
                { signal: AbortSignal.timeout(5000) }
            );
            if (!leaderboardUsers.ok) return null;
            const leaderboardUsersJson: LeaderboardUser[] = await leaderboardUsers.json();
            return leaderboardUsersJson;
        } catch {
            return null;
        }
    },
    ['tryHackMeDetails'],
    { revalidate: 300, tags: ['tryHackMeDetails'] }
);

export default async function Leaderboard() {
    const users = await getLeaderboard();

    // Crown colors for top 5 users (diamond, gold, silver, bronze, purple)
    const crownColors = ['#b9f2ff', '#ffd700', '#c0c0c0', '#cd7f32', '#9B59B6'];

    return (
        <>
            <CardHeader>
                <CardTitle
                    className={`flex items-center gap-2 text-sm text-cyan-400 sm:text-base md:text-lg lg:text-2xl ${fonts.sourceCodePro.className}`}
                >
                    <FaTrophy />
                    <span className="lg:truncate">TryHackMe Leaderboard</span>
                </CardTitle>
                <CardDescription className="text-sm">
                    This is the THM Leaderboard for Hack Nexus users. To be added to the leaderboard, you must join our
                    Discord server and register your THM username.
                </CardDescription>
                <Separator className="my-2" />
            </CardHeader>
            <CardContent>
                {users === null ? (
                    <p className="text-center text-gray-400">Leaderboard service is temporarily unavailable.</p>
                ) : users.length === 0 ? (
                    <p className="text-center text-gray-400">No leaderboard data available.</p>
                ) : (
                    <ScrollArea className="h-[calc(100vh-32.5rem)]" type="auto">
                        <ScrollBar className="bg-gray-900" />
                        <div className="flex max-h-96 flex-col gap-2 rounded-xl pr-4">
                            {users.map((user, index) => (
                                <div key={user.id} className="relative rounded-lg bg-gray-900">
                                    {index < 5 && (
                                        <FaCrown
                                            className="absolute top-1 left-1 size-4 sm:size-5"
                                            style={{ color: crownColors[index] }}
                                        />
                                    )}
                                    <div className="flex items-center justify-between md:block">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <div className="flex w-full cursor-pointer items-center gap-2 p-4 md:hidden">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                                                        <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm text-cyan-400 hover:underline xl:text-base 2xl:text-lg">
                                                        {user.username}
                                                    </span>
                                                </div>
                                            </SheetTrigger>
                                            <SheetContent side="bottom" className="pb-8">
                                                <SheetHeader>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={user.avatarUrl} alt={user.username} />
                                                            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <SheetTitle className="text-cyan-400">
                                                            {user.username}
                                                        </SheetTitle>
                                                    </div>
                                                </SheetHeader>
                                                <div className="flex flex-col gap-4 px-4">
                                                    <div className="flex items-center gap-3 rounded-lg bg-gray-900/50 p-4">
                                                        <FaMedal className="size-6 text-yellow-500" />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-gray-400">Rank</span>
                                                            <span className="text-lg font-medium">{user.rank}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 rounded-lg bg-gray-900/50 p-4">
                                                        <FaDoorOpen className="size-6 text-cyan-400" />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-gray-400">
                                                                Rooms Completed
                                                            </span>
                                                            <span className="text-lg font-medium">{user.rooms}</span>
                                                        </div>
                                                    </div>
                                                    <Button asChild className="mx-auto w-fit">
                                                        <Link href={user.tryhackmeUrl} target="_blank">
                                                            View Profile on TryHackMe
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </SheetContent>
                                        </Sheet>
                                        <div className="hidden p-4 md:flex md:items-center md:justify-between">
                                            <Link
                                                href={user.tryhackmeUrl}
                                                target="_blank"
                                                className="hidden items-center gap-2 text-sm text-cyan-400 hover:underline md:flex xl:text-base 2xl:text-lg"
                                            >
                                                <Avatar className="h-6 w-6 md:h-8 md:w-8 xl:h-10 xl:w-10">
                                                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                                                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>{user.username}</div>
                                            </Link>
                                            <div className="hidden text-left text-gray-400 md:block">
                                                <p className="flex items-center gap-1 text-xs lg:text-sm xl:text-base">
                                                    <FaMedal /> <span>Rank: {user.rank}</span>
                                                </p>
                                                <p className="flex items-center gap-1 text-xs lg:text-sm xl:text-base">
                                                    <FaDoorOpen /> <span>Rooms: {user.rooms}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </>
    );
}
