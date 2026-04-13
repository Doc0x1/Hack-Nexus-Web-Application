import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import { fonts } from './fonts';

export default function WelcomeHero() {
    return (
        <Card className="bg-inner-card w-full max-w-4xl rounded-xl shadow-lg">
            <CardHeader>
                <CardTitle>
                    <h1
                        className={`flex items-center gap-2 text-sm text-cyan-400 md:text-lg lg:text-2xl ${fonts.jetBrainsMono.className}`}
                    >
                        <FaRegArrowAltCircleRight /> Welcome To Hack Nexus
                    </h1>
                </CardTitle>
                <Separator />
            </CardHeader>
            <CardContent>
                <div className="text-left lg:text-xl">
                    <p className="pb-3">
                        Hack Nexus is your gateway to starting your cybersecurity journey. Discover cutting-edge tools,
                        in-depth tutorials, and network with a professional community dedicated to learning and
                        innovation.
                    </p>
                    <p className="pb-3">
                        Participate in our challenges, collaborate on projects, and stay updated with the latest in
                        cybersecurity trends.
                    </p>
                    <p>
                        Join our Discord community or support us on Patreon to unlock exclusive content and contribute
                        to our mission.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
