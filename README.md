This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Tech Stack

This project utilizes next-auth@beta for authentication, using auth.config.ts and auth.ts files for the main configuration.

The project also makes use of ShadCN UI components.

The project also uses Prisma, with a schema.prisma detailing the database and a lib/prisma.ts file for exporting the prisma variable to be used in other components.

The website is called "Hack Nexus" and is used for providing access to configuring the Discord server's Discord bot, an admin panel that is still in development for configuring site-wide settings, and a TryHackMe leaderboard and image Geolocator featured on the front page of the site.
