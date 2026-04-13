export interface GuildUser {
    id: string;
    userId: string;
    guildId: string;
    username: string;
    guildOwner: boolean;
    currency: number;
    messagesSent: bigint;
    timeInVoice: number;
    level: number;
    exp: number;
    hearts: number;
    tryHackMeDetailsUsername: string | null;
    TryHackMeDetails?: TryHackMeDetails | null;
}

export interface Guild {
    id: string;
    name: string;
}

export interface TryHackMeDetails {
    id: string;
    username: string;
    rank: number;
    rooms: number;
    confirmed: boolean;
}
