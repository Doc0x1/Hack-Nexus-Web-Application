import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import UserMenu from './UserMenu';
import { FaDiscord, FaPatreon } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './MobileSidebar';
import { Button, buttonVariants } from '../ui';
import { auth } from '@/auth';
import { Logo } from '@/components/ui/logo';
import { ListItem } from './NavBarListItem';
import { fonts } from '../fonts';

export default async function NavBar() {
    const session = await auth();

    return (
        <header className="fixed start-0 top-0 z-20 w-full border-b border-b-blue-900/50 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    {/* Mobile - Menu Button */}
                    <div className="lg:hidden">
                        <MobileSidebar Logo={Logo} session={session} />
                    </div>

                    {/* Left side - Logo & Navigation (Desktop) */}
                    <Link href="/" className="flex items-center gap-2">
                        <Logo height={32} width={32} />
                        <span className="hidden font-mono text-2xl text-cyan-400 md:block">Hack Nexus</span>
                    </Link>

                    {/* Navigation Menu - Visible only on desktop */}
                    <NavigationMenu className="hidden lg:block">
                        <NavigationMenuList className="flex items-center gap-2">
                            <NavigationMenuItem>
                                <NavigationMenuTrigger
                                    className={cn(
                                        buttonVariants({ variant: 'ghost' }),
                                        `border-ring cursor-pointer border`
                                    )}
                                >
                                    Get Started
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="flex bg-slate-900/90">
                                    <ul className="grid gap-3 p-4 backdrop-blur-sm md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-slate-800/50 to-indigo-900/75 p-4 no-underline outline-none select-none focus:shadow-md"
                                                    href="/"
                                                >
                                                    <div className="">
                                                        <Logo width={64} height={64} />
                                                    </div>
                                                    <div
                                                        className={`my-1 text-lg font-semibold text-cyan-400 xl:text-xl ${fonts.openSans.className}`}
                                                    >
                                                        Hack Nexus
                                                    </div>
                                                    <p className="text-sm leading-tight text-slate-300">
                                                        We are a community of people interested in all things Cyber
                                                        Security and Ethical Hacking related.
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <ListItem href="/tools" title="Tools">
                                            Tools and links we thought you might find useful.
                                        </ListItem>
                                        <ListItem href="/tools/domainchecker" title="Domain Checker">
                                            Check domains for various information.
                                        </ListItem>
                                        <ListItem
                                            href="https://skill.hacknexus.io"
                                            title="Skill Nexus (WIP)"
                                            target="_blank"
                                        >
                                            Practice Linux, Pentesting commands, and more.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    className={cn(
                                        buttonVariants({ variant: 'ghost' }),
                                        'border-ring bg-background flex flex-row items-center gap-2 border'
                                    )}
                                    asChild
                                >
                                    <Link href="https://discord.gg/6tSbqvn7K6" target="_blank">
                                        <FaDiscord className="text-button-foreground h-4 w-4" />
                                        <span>Discord</span>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    className={cn(
                                        buttonVariants({ variant: 'ghost' }),
                                        'border-ring bg-background flex flex-row items-center gap-2 border'
                                    )}
                                    asChild
                                >
                                    <Link href="https://patreon.com/hacknexus" target="_blank">
                                        <FaPatreon className="text-button-foreground h-4 w-4" />
                                        <span>Patreon</span>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="ml-auto"></NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right side - Sign In/User Profile */}
                <div className="hidden lg:flex lg:items-center lg:gap-2">
                    {session?.user ? (
                        <UserMenu user={session.user} />
                    ) : (
                        <Button className={navigationMenuTriggerStyle()} asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
