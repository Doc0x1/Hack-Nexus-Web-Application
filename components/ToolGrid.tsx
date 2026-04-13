import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from './ui/button';

interface ToolCardItem {
    cardTitle: string;
    cardDescription: string;
    cardContent: string;
    cardFooterText: string;
    cardFooterHref: string;
    cardHrefTarget: '_blank' | '_self';
    prefetch: true | false;
}

const topRowCards: ToolCardItem[] = [
    {
        cardTitle: 'Domain Checker',
        cardDescription: 'Get a list of tools useful for checking domains.',
        cardContent: 'Find various tools to analyze domain information.',
        cardFooterText: 'Check Domains',
        cardFooterHref: '/tools/domainchecker',
        cardHrefTarget: '_self',
        prefetch: true
    },
    {
        cardTitle: 'Browser Checker',
        cardDescription: 'Check what your browser reveals about you.',
        cardContent: 'Analyze the data your browser sends to websites.',
        cardFooterText: 'Run Browser Test',
        cardFooterHref: '/tools/browserchecker',
        cardHrefTarget: '_self',
        prefetch: true
    },
    {
        cardTitle: 'Doctor Bot Dashboard (WIP)',
        cardDescription: 'Configure Doctor Bot for your Discord server.',
        cardContent: 'Use this to configure the Hack Nexus Discord bot.',
        cardFooterText: 'Manage Doctor Bot',
        cardFooterHref: '/dashboard',
        cardHrefTarget: '_self',
        prefetch: false
    },
    {
        cardTitle: 'Skill Nexus',
        cardDescription: 'Note: Site is a WIP',
        cardContent: 'Practice Linux commands, Pentesting commands, and more.',
        cardFooterText: 'Practice Commands',
        cardFooterHref: 'https://skill.hacknexus.io',
        cardHrefTarget: '_blank',
        prefetch: false
    }
];

const bottomRowCards: ToolCardItem[] = [
    {
        cardTitle: 'Join us on Discord',
        cardDescription: 'Join our community on Discord.',
        cardContent: 'Connect with other users, get help, and stay updated on the latest news.',
        cardFooterText: 'Join Server',
        cardFooterHref: 'https://discord.gg/6tSbqvn7K6', // Replace with your actual Discord invite link
        cardHrefTarget: '_blank',
        prefetch: false
    },
    {
        cardTitle: 'Support us on Patreon',
        cardDescription: 'Help us continue providing these tools.',
        cardContent: 'Support the development of these tools and get access to exclusive content.',
        cardFooterText: 'Become a Patron',
        cardFooterHref: 'https://patreon.com/hacknexus', // Replace with your actual Patreon link
        cardHrefTarget: '_blank',
        prefetch: false
    }
];

export default async function ToolGrid() {
    const renderCard = (card: ToolCardItem, index: number) => (
        <Card key={index} className="flex flex-col backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex justify-center">{card.cardTitle}</CardTitle>
                <CardDescription className="text-center">{card.cardDescription}</CardDescription>
            </CardHeader>
            <CardContent className="grow justify-center text-center">
                <div>{card.cardContent}</div>
            </CardContent>
            <CardFooter className="justify-center">
                <Button asChild>
                    <Link
                        href={card.cardFooterHref}
                        prefetch={card.prefetch}
                        className="font-sans font-semibold"
                        target={card.cardHrefTarget}
                    >
                        {card.cardFooterText}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <div className="flex flex-col gap-4">
            {/* Top row - responsive grid that shows all 4 on larger screens */}
            <div className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {topRowCards.map(renderCard)}
            </div>

            {/* Bottom row - centered cards with equal width */}
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
                {bottomRowCards.map((card, index) => (
                    <div key={index} className="flex">
                        {renderCard(card, index)}
                    </div>
                ))}
            </div>
        </div>
    );
}
