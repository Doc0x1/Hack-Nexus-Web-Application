declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_BOT_ENABLED: boolean;
        }
    }
}
