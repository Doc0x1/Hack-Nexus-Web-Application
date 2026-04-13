export interface PartialGuild {
    id: string;
    name: string;
    icon: null | string;
    banner: null | string;
    owner: boolean;
    permissions: number;
    permissions_new: string;
    features: string[];
}

export interface Guild {
    id: string;
    name: string;
    icon: string;
    description: string;
    home_header: string;
    splash: string;
    discovery_splash: string;
    features: string[];
    banner: string;
    owner_id: string;
    application_id: null;
    region: string;
    afk_channel_id: string;
    afk_timeout: number;
    system_channel_id: string;
    system_channel_flags: number;
    widget_enabled: boolean;
    widget_channel_id: string;
    verification_level: number;
    roles: Role[];
    default_message_notifications: number;
    mfa_level: number;
    explicit_content_filter: number;
    max_presences: null;
    max_members: number;
    max_stage_video_channel_users: number;
    max_video_channel_users: number;
    vanity_url_code: string;
    premium_tier: number;
    premium_subscription_count: number;
    preferred_locale: string;
    rules_channel_id: string;
    safety_alerts_channel_id: string;
    public_updates_channel_id: string;
    hub_type: null;
    premium_progress_bar_enabled: boolean;
    latest_onboarding_question_id: string;
    nsfw: boolean;
    nsfw_level: number;
    emojis: Emoji[];
    stickers: Sticker[];
    incidents_data: null;
    inventory_settings: null;
    embed_enabled: boolean;
    embed_channel_id: string;
}

export interface Emoji {
    id: string;
    name: string;
    roles: any[];
    require_colons: boolean;
    managed: boolean;
    animated: boolean;
    available: boolean;
}

export interface Role {
    id: string;
    name: string;
    description: null;
    permissions: number;
    permissions_new: string;
    position: number;
    color: number;
    hoist: boolean;
    managed: boolean;
    mentionable: boolean;
    icon: null | string;
    unicode_emoji: null | string;
    flags: number;
    tags?: Tags;
}

export interface Tags {
    bot_id?: string;
    premium_subscriber?: null;
    integration_id?: string;
    subscription_listing_id?: string;
    available_for_purchase?: null;
}

export interface Sticker {
    id: string;
    name: string;
    tags: string;
    type: number;
    format_type: number;
    description: string;
    asset: string;
    available: boolean;
    guild_id: string;
}

export interface RateLimitData {
    message: string;
    retry_after: number;
    global: boolean;
    code?: number;
}

export interface RateLimitHeaders {
    'x-ratelimit-limit'?: string;
    'x-ratelimit-remaining'?: string;
    'x-ratelimit-reset'?: string;
    'x-ratelimit-reset-after'?: string;
    'x-ratelimit-bucket'?: string;
    'x-ratelimit-global'?: string;
    'x-ratelimit-scope'?: 'user' | 'global' | 'shared';
}

export type Snowflake = string;

export interface Channel {
    id: Snowflake;
    type: number;
    guild_id?: Snowflake;
    position?: number;
    permission_overwrites?: [];
    name?: string;
    topic?: string;
    nsfw?: boolean;
    last_message_id?: Snowflake;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    recipients?: [];
    icon?: string;
    owner_id?: Snowflake;
    application_id?: Snowflake;
    managed?: boolean;
    parent_id?: Snowflake;
    permissions?: string;
    flags?: number;
    total_message_sent?: number;
}

export interface WelcomeScreen {
    description: string | null;
    welcome_channels: Array<{
        channel_id: Snowflake;
        description: string;
        emoji_id: Snowflake | null;
        emoji_name: string | null;
    }>;
}

export interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    banner?: string;
    accent_color?: number;
    premium_type?: number;
    public_flags?: number;
    avatar_decoration_data?: {
        sku_id: string;
        asset: string;
    };
}

export interface GuildResponse {
    manageable: PartialGuild[];
    unmanageable: PartialGuild[];
    unknown: PartialGuild[];
}

export interface GuildSettingsResponse {
    guildSettings: {
        id: string;
        prefix: string;
        loggingChannelId?: string | null;
        Role?: {
            id: string;
            name: string;
        }[];
        Channel?: {
            id: string;
            name: string;
        }[];
    };
}
