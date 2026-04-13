import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface GuildCardProps {
    id: string;
    name: string;
    icon: string | null;
    onActionClick?: () => void;
}

const GuildCard = ({ id, name, icon, onActionClick }: GuildCardProps) => {
    const iconUrl = icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.webp?size=128` : null;

    return (
        <div
            className="relative m-4 w-64 overflow-hidden rounded-lg bg-gray-900 shadow-lg ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent"
            style={
                iconUrl
                    ? {
                          backgroundImage: `url("${iconUrl}")`,
                          backgroundPosition: 'center center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover'
                      }
                    : undefined
            }
        >
            <Link
                href={`/dashboard/guilds/${id}`}
                className="flex size-full flex-col items-center justify-center overflow-hidden bg-gray-700/30 p-4 backdrop-blur-xl"
            >
                <div className="mb-2">
                    {iconUrl ? (
                        <Image
                            className="size-24 rounded-full object-cover object-center"
                            src={iconUrl}
                            alt={`${name} icon`}
                            width={96}
                            height={96}
                        />
                    ) : (
                        <div className="flex size-24 items-center justify-center rounded-full bg-gray-700">
                            <span className="text-2xl text-gray-400">{name.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </div>
                <div className="rounded-md bg-black/30 px-4 py-2 backdrop-contrast-100">
                    <span className="text-center text-lg font-medium text-white">{name}</span>
                </div>
            </Link>
            {onActionClick && (
                <div className="absolute top-1 right-1">
                    <button
                        onClick={onActionClick}
                        className="w-auto rounded-md bg-gray-800 p-1 text-white transition-colors hover:bg-gray-700"
                    >
                        <ExternalLink className="size-6 xl:size-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default GuildCard;
