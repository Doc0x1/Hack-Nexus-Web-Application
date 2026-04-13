import GuildDashboardWrapper from '@/components/zira-dashboard/GuildDashboardWrapper';
import { getGuilds } from '@/app/actions/dashboard-actions';

export default async function GuildDashboard() {
    // Fetch guilds using the cached server action.
    const guilds = await getGuilds();

    return <GuildDashboardWrapper guilds={guilds} />;
}
