export interface LevelingConfig {
    baseExpPerLevel: number;
    levelMultiplier: number;
    baseMessageExpPerMsg: number;
    minimumMessageExpCooldown: number;
    maximumMessageExpCooldown: number;
    baseVoiceExpPerMin: number;
    minimumTimeInVoice: number;
    levelUpMessage: string;
    levelUpChannelId: string | null;
    diminishingVoiceExpFactor: number | null;
    voiceUpdateInterval: number;
    settings: JsonValue | null;
    maxVoiceExp: number | null;
}

export interface GuildConfig {
    id: string;
    name: string;
    prefix: string;
    welcomeMessage: string | null;
    farewellMessage: string | null;
    muteRoleId: string | null;
    ownerRoles: string[];
    adminRoles: string[];
    moderatorRoles: string[];
    ownerId: string;
    settings: any;
    autoRoleIds: string[];
    loggingChannelId: string;
    phishingLoggingChannelId: string;
    Leveling: LevelingConfig | null;
    announceLevelUps: boolean;
    enableLeveling: boolean;
}

// Role Reward Types
export interface LevelReward {
    id: string;
    guildId: string;
    roleId: string;
    type: 'level';
    level: number;
    createdAt: string;
    updatedAt: string;
}

export interface TryHackMeReward {
    id: string;
    guildId: string;
    roleId: string;
    type: 'tryhackme';
    roomsRequired?: number | null;
    rankRequired?: number | null;
    createdAt: string;
    updatedAt: string;
}

export type RoleReward = LevelReward | TryHackMeReward;
