import Leaderboard from './Leaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Card } from '@components/ui/card';
import { cn } from '@/lib/utils';
import GeolocateSection from './GeolocateSection';

export default function ToolsTabs() {
    return (
        <Tabs defaultValue="leaderboard" className="w-full gap-0 rounded-b-none border-none">
            <TabsList className="grid w-full grid-cols-2 rounded-b-none border bg-slate-900 p-0">
                <TabsTrigger
                    className={cn(
                        'dark:data-[state=active]:bg-background dark:data-[state=active]:border-ring rounded-r-none rounded-b-none text-[10px] sm:text-xs lg:text-sm dark:data-[state=active]:text-cyan-400'
                    )}
                    value="leaderboard"
                >
                    THM Leaderboard
                </TabsTrigger>
                <TabsTrigger
                    className={cn(
                        'dark:data-[state=active]:bg-background dark:data-[state=active]:border-ring rounded-l-none rounded-b-none text-[10px] sm:text-xs lg:text-sm dark:data-[state=active]:text-cyan-400'
                    )}
                    value="geolocate"
                >
                    Geolocator
                </TabsTrigger>
            </TabsList>
            <Card className="bg-inner-card text-inner-card-foreground w-full max-w-4xl rounded-t-none rounded-b-xl shadow-lg">
                <TabsContent value="leaderboard" forceMount className="data-[state=inactive]:hidden">
                    <section className="w-full">
                        <Leaderboard />
                    </section>
                </TabsContent>
                <TabsContent value="geolocate" forceMount className="data-[state=inactive]:hidden">
                    <section className="w-full">
                        <GeolocateSection />
                    </section>
                </TabsContent>
            </Card>
        </Tabs>
    );
}
