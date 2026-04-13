# Hack Nexus

**v0.9.3** — Cybersecurity community platform built with Next.js 15 and React 19.

## About

Hack Nexus is a full-stack cybersecurity community platform that combines Discord server management, community content, and security tooling in a single web application. It provides a Discord bot configuration dashboard, an admin panel for site-wide settings, a TryHackMe leaderboard, image geolocation analysis, user-generated posts, and a public news feed — all backed by a PostgreSQL database and secured with NextAuth.js v5.

## Features

- **Authentication** — Discord OAuth2 and email/password credentials with email verification, rate limiting, and remember-me support
- **Role system** — ADMIN, MODERATOR, MEMBER, and GUEST tiers with server-side enforcement
- **Admin panel** — Manage news posts, guild users, and site-wide settings (bot toggle, registration, theme)
- **Discord bot dashboard (Zira)** — Configure guild settings, leveling, and role rewards per Discord server
- **TryHackMe leaderboard** — Track community members' TryHackMe progress
- **Security tools** — Domain checker, browser fingerprint checker, autofill inspector
- **Image geolocation** — Upload images for EXIF/geo analysis (Sharp preprocessing)
- **Community content** — User-generated posts with 17 categories, nested comments, likes, bookmarks, and shares
- **News feed** — Admin-managed news posts surfaced on the homepage
- **User profiles** — Public profile pages with edit support and Discord account linking
- **IP geolocation logging** — Tracks and displays geo data for analysis

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.4.10 | Framework (App Router) |
| React | 19.1.0 | UI |
| TypeScript | 5.8.3 | Type safety |
| NextAuth.js | 5.0.0-beta.25 | Authentication (JWT strategy) |
| Prisma | 6.12.0 | ORM |
| PostgreSQL | — | Database |
| TailwindCSS | 4.1.7 | Styling |
| ShadCN UI | — | Component library (49 Radix-based components) |
| React Query | 5.75.1 | Client-side data caching |
| Playwright | — | E2E testing |
| pnpm | 9.14.2 | Package manager |

## Prerequisites

- **Node.js** >= 20
- **pnpm** 9.14.2 (`npm install -g pnpm@9.14.2`)
- **PostgreSQL** running locally or remotely
- **Discord application** with OAuth2 and a bot token ([Discord Developer Portal](https://discord.com/developers/applications))
- **mkcert** (optional, for local SSL proxy)

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-org/hacknex.us.git
cd hacknex.us

# 2. Install dependencies (also runs prisma generate automatically)
pnpm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your values

# 4. Push the database schema
npx prisma db push

# 5. Seed initial data
npx prisma db seed

# 6. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Commands

```bash
# Development
pnpm dev          # Start dev server on http://localhost:3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # ESLint (Next.js + TypeScript rules)
pnpm proxy        # SSL proxy via mkcert (https://localhost:3010 → :3000)

# Database
npx prisma generate   # Regenerate Prisma client after schema changes
npx prisma db push    # Push schema changes to the database
npx prisma db seed    # Seed the database (runs prisma/seed.ts)
npx prisma studio     # Open Prisma database browser GUI

# Testing
pnpm test                         # Run all Playwright E2E tests
npx playwright test <file>        # Run a specific test file
```

## Project Structure

```
├── app/                    # Next.js App Router (pages, layouts, API routes, server actions)
│   ├── actions/            # Shared server actions (auth, guild, news, geolocate)
│   ├── admin/              # Admin panel routes (news, users, settings)
│   ├── api/                # API route handlers
│   ├── dashboard/          # Discord bot dashboard (per-guild config)
│   ├── profile/            # User profiles (public view + edit)
│   └── tools/              # Security tools (domainchecker, browserchecker)
├── components/             # React components
│   ├── ui/                 # ShadCN UI primitives (49 components)
│   ├── admin/              # Admin panel components
│   ├── nav/                # Navigation (NavBar, UserMenu, MobileSidebar)
│   ├── user/               # User profile components
│   └── zira-dashboard/     # Discord bot dashboard components
├── hooks/                  # Custom React hooks (React Query, guild data, user management)
├── lib/                    # Utilities (Prisma client, rate limiter, email, utils)
├── prisma/                 # Database schema and seed script
├── tests/                  # Playwright E2E tests
├── types/                  # TypeScript type definitions
├── auth.ts                 # Full NextAuth configuration (providers, callbacks, PrismaAdapter)
├── auth.config.ts          # Middleware-safe auth config (JWT, route guards, role helpers)
└── middleware.ts           # API route protection
```

## Authentication

Authentication uses **NextAuth.js v5** with a JWT strategy (30-day max age).

**Providers:**
- **Discord OAuth** — Scopes: `identify` + `guilds`. Auto-syncs avatar on every login.
- **Credentials** — Email/password with bcrypt. Rate-limited to 5 attempts per 15 minutes.

**Role system** (determined by `SiteSettings.siteAdminUserEmails` / `siteModeratorUserEmails`):

| Role | Access |
|---|---|
| ADMIN | Full access including admin panel |
| MODERATOR | Elevated content moderation access |
| MEMBER | Standard authenticated access |
| GUEST | Limited access |

**Route protection summary:**

| Route | Access |
|---|---|
| `/admin/*` | ADMIN only |
| `/dashboard/*` | Authenticated + bot enabled (or ADMIN) |
| `/profile/edit` | Authenticated |
| `/api/user` | Authenticated (JWT via middleware) |
| `/tools/*`, `/profile/[username]` | Public |

## Database

PostgreSQL accessed via **Prisma ORM**. Always import the client from `lib/prisma.ts`.

Key model groups:
- **Users & Auth**: User, Account, Session, VerificationToken
- **Content**: NewsPost, Post, Comment, PostRevision
- **Security**: IPLog, PostReport
- **Community**: Event, Achievement, ProfileView
- **Engagement**: PostLike, Bookmark, PostShare
- **Config**: SiteSettings

Schema: [`prisma/schema.prisma`](prisma/schema.prisma)

## Testing

E2E tests use **Playwright**. The dev server is auto-started before test runs.

```bash
pnpm test                           # Run all tests
npx playwright test tests/profile.spec.ts   # Run specific test
```

Base URL: `http://localhost:3000` — Tests run in parallel with 2 retries on CI.

## Contributing

1. Fork the repository and create a feature branch
2. Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages (`feat:`, `fix:`, `chore:`, etc.)
3. Run `pnpm lint` and `pnpm test` before opening a pull request
4. Keep PRs focused — one feature or fix per PR

## License

License TBD. All rights reserved until a license is specified.
