import Marquee from 'react-fast-marquee';
import NewsTickerItem from './NewsTickerItem';
import { Separator } from './ui/separator';
import React from 'react';
import { unstable_cache } from 'next/cache';

interface HackerNewsItem {
    id: number;
    title: string;
    url?: string;
}

const fetchHackerNewsItems = unstable_cache(
    async () => {
        try {
            // Fetch list of newest story IDs
            const idsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
                signal: AbortSignal.timeout(5000)
            });
            if (!idsRes.ok) return [];

            const ids: number[] = await idsRes.json();
            const topIds = ids.slice(0, 10);

            // Fetch details for each ID in parallel
            const items = await Promise.all(
                topIds.map(async id => {
                    try {
                        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
                            signal: AbortSignal.timeout(5000)
                        });
                        if (!itemRes.ok) return null;
                        return (await itemRes.json()) as HackerNewsItem;
                    } catch {
                        return null;
                    }
                })
            );

            // Filter out failed fetches or items without a title
            return items.filter(Boolean).filter(item => (item as HackerNewsItem).title) as HackerNewsItem[];
        } catch {
            return [];
        }
    },
    ['hacker-news-ticker'],
    {
        // Refresh every 15 minutes
        revalidate: 900
    }
);

export default async function NewsTicker() {
    const items = await fetchHackerNewsItems();

    if (items.length === 0) {
        return null;
    }

    return (
        <Marquee
            gradient={true}
            gradientColor="black"
            speed={50}
            autoFill={false}
            pauseOnHover={true}
            gradientWidth={75}
            loop={0}
        >
            <div className="relative flex w-full justify-between overflow-hidden py-2 backdrop-blur-sm">
                {items.map((item, index) => (
                    <div className="flex items-center justify-between" key={item.id}>
                        <NewsTickerItem item={item} />
                        {index <= items.length - 1 ? (
                            // Separator between posts
                            <Separator orientation="vertical" className="mx-4 h-5 bg-sky-400" />
                        ) : (
                            // Spacer after the last item so there is a gap before list repeats
                            <span className="inline-block w-4 sm:w-6 md:w-8 lg:w-max" />
                        )}
                    </div>
                ))}
            </div>
        </Marquee>
    );
}
