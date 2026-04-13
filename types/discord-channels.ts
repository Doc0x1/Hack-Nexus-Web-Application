export interface GuildChannel {
    id: string;
    type: number;
    flags: number;
    guild_id: string;
    name: string;
    parent_id: null | string;
    position: number;
    permission_overwrites: PermissionOverwrite[];
    last_message_id?: null | string;
    rate_limit_per_user?: number;
    topic?: null | string;
    default_auto_archive_duration?: number;
    nsfw?: boolean;
    last_pin_timestamp?: Date;
    bitrate?: number;
    user_limit?: number;
    rtc_region?: null | string;
    icon_emoji?: IconEmoji | null;
    theme_color?: null;
    voice_background_display?: null;
    available_tags?: AvailableTag[];
    default_reaction_emoji?: DefaultReactionEmoji;
    default_sort_order?: null;
    default_forum_layout?: number;
    template?: string;
}

export interface AvailableTag {
    id: string;
    name: string;
    moderated: boolean;
    emoji_id: null | string;
    emoji_name: null | string;
}

export interface DefaultReactionEmoji {
    emoji_id: string;
    emoji_name: null;
}

export interface IconEmoji {
    id: null;
    name: string;
}

export interface PermissionOverwrite {
    id: string;
    type: Type;
    allow: number;
    deny: number;
    allow_new: string;
    deny_new: string;
}

export enum Type {
    Member = 'member',
    Role = 'role'
}
