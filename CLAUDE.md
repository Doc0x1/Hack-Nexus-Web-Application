# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hack Nexus (v0.9.3) is a Next.js 15 cybersecurity community platform built with React 19, TypeScript, and PostgreSQL. It provides Discord bot configuration, an admin panel, TryHackMe leaderboard integration, security analysis tools, user-generated content, and community features.

## Development Commands

```bash
# Package manager: pnpm (v9.14.2)
pnpm dev                     # Start development server (port 3000)
pnpm build                   # Production build
pnpm start                   # Start production server
pnpm lint                    # ESLint with Next.js + TypeScript rules
pnpm test                    # Run all Playwright E2E tests
npx playwright test <file>   # Run specific test (e.g., profile.spec.ts)

# Database (PostgreSQL + Prisma 6.12)
npx prisma generate          # Regenerate client after schema changes
npx prisma db push           # Push schema changes to database
npx prisma studio            # Open database browser GUI
npx prisma db seed           # Seed database (runs tsx prisma/seed.ts)

# SSL development proxy
pnpm proxy                   # SSL proxy via mkcert + local-ssl-proxy (3010 → 3000)
```

**Post-install hook**: `prisma generate` runs automatically after `pnpm install`.

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── actions/              # Server actions (auth, dashboard, guild, news, geolocate)
│   ├── admin/                # Admin panel (news, users, settings - each with actions.ts)
│   │   ├── news/             # News post CRUD management
│   │   ├── settings/         # Site-wide settings (bot toggle, registration, theme)
│   │   └── users/            # Guild user management via bot API
│   ├── api/                  # API routes
│   │   ├── auth/             # NextAuth + register, verify-email, link/unlink Discord
│   │   ├── geolocate/        # Image geolocation (sharp preprocessing)
│   │   ├── public-news-posts/# Public news feed
│   │   └── user/             # Authenticated user Discord data
│   ├── dashboard/            # Discord bot dashboard
│   │   └── guilds/[guildId]/ # Guild config (general, leveling, roleRewards)
│   ├── login/                # Sign-in page (Discord OAuth + credentials)
│   ├── profile/              # User profiles ([username] view + edit)
│   ├── register/             # Registration form
│   ├── tools/                # Security tools (domainchecker, browserchecker)
│   ├── verify-email/         # Email verification handler
│   ├── bot-in-development/   # Shown when bot is disabled for non-admins
│   ├── layout.tsx            # Root layout (Providers, NavBar, background, Toaster)
│   ├── page.tsx              # Homepage (WelcomeHero, NewsTicker, ToolsTabs)
│   ├── not-found.tsx         # Custom 404
│   ├── robots.ts             # SEO robots config
│   └── sitemap.ts            # Sitemap generation
├── components/               # React components (~108 total)
│   ├── ui/                   # ShadCN UI primitives (49 components, Radix-based)
│   ├── admin/                # Admin panel (Sidebar, SiteSettingsForm, dialogs)
│   ├── common/               # Shared (DataTable, SearchBar, PageSelector)
│   ├── dialogs/              # Action dialogs (news CRUD, guild user entry)
│   ├── modals/               # Security tool modals (domain/browser/autofill)
│   ├── nav/                  # Navigation (NavBar, UserMenu, MobileSidebar, LogOut)
│   ├── posts/                # Post forms (NewPostForm, EditPostForm)
│   ├── user/                 # User components (Profile, EditProfileForm, UserFilters)
│   └── zira-dashboard/       # Discord bot UI (10 components: guild settings, leveling, role rewards)
├── contexts/                 # React context providers
│   └── CursorContext.tsx     # Global cursor hover/click state
├── hooks/                    # Custom React hooks
│   ├── useGuildData.ts       # Guild settings/channels/roles (React Query, 30min cache)
│   ├── useRoleRewards.ts     # Role reward CRUD (React Query mutations)
│   ├── useUserManagement.ts  # Admin user management (search, filter, pagination)
│   ├── useCursorInteraction.ts # Mouse event handlers for cursor context
│   └── use-mobile.ts         # Mobile viewport detection (768px breakpoint)
├── lib/                      # Utility modules
│   ├── prisma.ts             # Prisma client singleton (always import from here)
│   ├── utils.ts              # cn() class merger, getLinks() for 30+ analysis tools
│   ├── nodemailer.ts         # Email verification sending
│   ├── rateLimiter.ts        # Brute-force protection (5 attempts / 15 min)
│   ├── animation-words.ts    # Cybersecurity word list for animations
│   └── links.ts              # Navigation link configuration
├── prisma/
│   ├── schema.prisma         # Database schema (all models)
│   └── seed.ts               # Database seeding script
├── types/                    # TypeScript type definitions
│   ├── next-auth.d.ts        # Extended NextAuth types (Session, User, JWT)
│   ├── discord.ts            # Discord API types (30+ types)
│   ├── discord-bot-types.d.ts # Bot config types (leveling, rewards)
│   ├── discord-channels.ts   # Channel/permission types
│   ├── discord-db-types.ts   # Guild/user DB types
│   ├── app-types.d.ts        # App navigation types
│   └── toolTypes.d.ts        # Security tool data types
├── tests/                    # Playwright E2E tests
│   ├── profile.spec.ts
│   └── signin.spec.ts
├── auth.ts                   # Full NextAuth implementation (providers, callbacks)
├── auth.config.ts            # Middleware-safe auth config (JWT, cookies, route guards)
├── middleware.ts             # API route protection + NextAuth middleware
└── public/                   # Static assets
```

## Architecture Overview

### Authentication System

- **NextAuth.js v5 beta** (`next-auth@5.0.0-beta.25`) with JWT strategy (30-day max age)
- **Two providers**:
  - **Discord OAuth**: Scopes `identify` + `guilds`, auto-syncs avatar on every login, upserts user
  - **Credentials**: Email/password with bcrypt, remember-me flag, rate limiting
- **Configuration split**:
  - `auth.config.ts` — Middleware-safe: JWT/cookie settings, `authorized()` callback for route guards, `isUserAdmin()` / `isUserModerator()` helpers
  - `auth.ts` — Full auth: PrismaAdapter, provider configs, sign-in/JWT/session callbacks, Discord profile sync
- **Role system**: ADMIN, MODERATOR, MEMBER, GUEST (determined by `SiteSettings.siteAdminUserEmails` / `siteModeratorUserEmails`)
- **Security**: Rate limiting (5 failed logins per 15 min), email verification tokens, ban/active checks

### Authentication Flow

1. User signs in via Discord OAuth or credentials form
2. `signIn` callback validates, upserts user in Prisma, syncs Discord avatar
3. `jwt` callback populates token with user data + Discord access/refresh tokens
4. Middleware validates JWT for protected API routes (`/api/user`)
5. `session` callback builds client session from JWT, updates `lastSeenAt` in background
6. Discord account linking sets `canAccessBot = true` for dashboard access

### Database Layer

- **PostgreSQL** with **Prisma ORM v6.12** (with `@prisma/adapter-pg`)
- **Client singleton**: Always import from `lib/prisma.ts`
- **Key model groups**:
  - **Users & Auth**: User, Account, Session, VerificationToken
  - **Content**: NewsPost (admin), Post (user-generated with 17 categories), Comment (nested), PostRevision
  - **Security**: IPLog (geo tracking), PostReport (8 report reasons), vulnerability metadata (CVE, severity)
  - **Community**: Event (6 types: CTF, workshop, etc.), Achievement, ProfileView
  - **Engagement**: PostLike, Bookmark, PostShare
  - **Config**: SiteSettings (site name, theme, bot enable, admin/mod emails)

### Route Protection

| Route Pattern | Access Level | Enforcement |
|---|---|---|
| `/admin/*` | ADMIN role only | `auth.config.ts` `authorized()` callback |
| `/dashboard/*` | Authenticated + `siteBotEnabled` or ADMIN | Dashboard `layout.tsx` server check |
| `/profile/edit` | Authenticated | Page-level redirect |
| `/api/user` | Authenticated | `middleware.ts` JWT validation |
| `/api/auth/*`, `/api/geolocate`, `/api/public-news-posts` | Public | Middleware bypass |
| `/login`, `/register`, `/tools/*`, `/profile/[username]` | Public | No protection |

### State Management

- **Server Actions** (`app/actions/`): Auth flows, guild operations, news management, geolocation
- **React Query** (`@tanstack/react-query`): Client-side caching in hooks (30-min cache, 5-min stale time)
- **Context**: `CursorContext` for global cursor interaction state
- **Session**: `UserSessionProvider` wrapping NextAuth `SessionProvider`
- **Custom Hooks**: `useGuildData`, `useRoleRewards`, `useUserManagement` for complex stateful logic

### Component Architecture

- **UI Foundation**: 49 ShadCN UI components (Radix primitives) in `components/ui/` with centralized exports via `components/ui/index.tsx`
- **Design System**: Custom Tailwind v4 config with cybersecurity theme (neon-green/blue gradients, hacker-dark backgrounds, pulse/glow animations)
- **Component Organization**: Feature folders (`admin/`, `nav/`, `user/`, `zira-dashboard/`) with shared utilities in `common/`
- **Icon Library**: Lucide React (`lucide-react`) + React Icons (`react-icons`)

## Key Configuration

### TypeScript Path Aliases

```
@/*            → root directory
@components/*  → components/
@ui/*          → components/ui/
@api/*         → app/api/
@types/*       → types/
@lib/*         → lib/
@/hooks/*      → hooks/
```

### Next.js Config

- **Image domains**: `hacknex.io`, `*.hacknex.io`, `cdn.discordapp.com`
- **Server actions**: 50MB body size limit
- **Experimental**: `experimental_ppr` enabled on homepage

### Tailwind Theme

- Custom color system: primary, secondary, destructive, success, muted, accent, card, sidebar, button
- Animations: `accordion-down/up`, `caret-blink`, `pulse-circle`, `spin-slow`
- Gradients: `hacker-dark`, `hacker-green`, `hacker-blue`
- Shadows: `neon-green`, `neon-blue`
- Plugins: `tailwindcss-animate`, `@tailwindcss/container-queries`

### Code Formatting (Prettier)

- 4-space indentation, no trailing commas, single quotes
- Print width: 120 characters
- Tailwind class sorting via `prettier-plugin-tailwindcss`
- Import order: React → Next → third-party → types → internal (`@ui`, `@lib`, app paths)

### Testing (Playwright)

- E2E tests in `tests/` directory
- Base URL: `http://localhost:3000`, viewport: 1280x720
- Auto-starts dev server, parallel execution, 2 retries on CI

## Development Patterns

### Database Operations
- Always import Prisma client from `lib/prisma.ts` (never instantiate directly)
- User roles determined by email match against `SiteSettings.siteAdminUserEmails` / `siteModeratorUserEmails`
- Use `npx prisma generate` after any schema change, then `npx prisma db push`

### Server Actions
- Located in `app/actions/` for shared actions, or co-located `actions.ts` in admin route directories
- Admin actions validate role before executing
- Use `unstable_cache` / `revalidateTag` for caching (e.g., news posts cached 3600s, guilds cached 60s)

### Component Development
- Build on ShadCN UI primitives from `components/ui/`
- Use `cn()` from `lib/utils.ts` for conditional class merging (clsx + tailwind-merge)
- Follow the established Tailwind theme — use design tokens (`hsl(var(--primary))`) not raw colors
- Server components by default; add `"use client"` only when needed for interactivity
- Forms: server actions for mutations, React Hook Form + Zod for validation
- Data fetching: React Query hooks for client-side, direct Prisma queries in server components

### Adding New Routes
1. Create directory under `app/` matching the desired URL path
2. Add `page.tsx` (required) and optionally `layout.tsx`, `loading.tsx`
3. If protected, add checks in the layout or use the middleware pattern from existing routes
4. For API routes, create `route.ts` and update middleware if auth is needed

### Discord Bot Integration
- Bot config managed through `zira-dashboard/` components
- Guild data flows through `useGuildData` hook (React Query)
- Role rewards via `useRoleRewards` hook
- All bot API calls go through server actions in `app/actions/guild-actions.ts`
- Dashboard requires `canAccessBot = true` (set when Discord account is linked)

### Environment Variables
- Auth secrets, Discord OAuth credentials, database URL, email service config
- `DISCORD_BOT_ENABLED` feature flag (typed in `process-env.d.ts`)
- All `.env` files are gitignored — never commit secrets
