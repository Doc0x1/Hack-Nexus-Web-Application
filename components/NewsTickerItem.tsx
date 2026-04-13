import Link from 'next/link';
import { fonts } from './fonts';

interface HackerNewsItem {
    id: number;
    title: string;
    url?: string;
}

interface NewsTickerItemProps {
    item: HackerNewsItem;
}

export default function NewsTickerItem({ item }: NewsTickerItemProps) {
    const link = item.url ?? `https://news.ycombinator.com/item?id=${item.id}`;
    return (
        <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-bold ${fonts.jetBrainsMono.className} text-cyan-400 hover:underline`}
        >
            {(() => {
                const maxLength = 30;
                if (item.title.length <= maxLength) return item.title;
                const slice = item.title.slice(0, maxLength);
                const lastSpace = slice.lastIndexOf(' ');
                return (lastSpace === -1 ? slice : slice.slice(0, lastSpace)).trimEnd() + '...';
            })()}
        </Link>
    );
}
