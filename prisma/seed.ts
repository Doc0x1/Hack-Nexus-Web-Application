import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const siteSettings = await prisma.siteSettings.create({
        data: {
            id: '1',
            siteName: 'Hack Nexus',
            siteDescription: 'A community for hackers and developers',
            siteLogo: 'https://hacknexus.io/logo.png',
            siteFavicon: 'https://hacknexus.io/favicon.ico',
            siteTheme: 'dark',
            siteLanguage: 'en',
            siteBotEnabled: false,
            siteAdminUserEmails: ['admin@hacknexus.io', 'itsdoctordoc@gmail.com'],
            siteModeratorUserEmails: ['moderator@hacknexus.io']
        }
    });
    console.log('Site settings created:', siteSettings);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
