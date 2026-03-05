# GradConnect — Implementation Plan

## Context

GradConnect is an open-source platform for college graduates who cannot find work after graduating. The core value proposition: AI creates massive opportunity, but you need a diverse team to fully capitalize on it — and it's economically better to collaborate than go solo. Users form teams of up to 20 people (max 5 per major), propose and vote on project ideas, and ship together.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, Shadcn/ui (neutral base, CSS variables) |
| Auth | Auth.js v5 (next-auth@beta) — GitHub, Google, email/password |
| ORM | Prisma + PostgreSQL (Neon for cloud hosting) |
| Email | Resend (sandbox mode initially; custom domain TBD) |
| Validation | Zod (shared client + server) |
| Package manager | Bun |

---

## Packages to Install

```bash
# Runtime
bun add next-auth@beta @auth/prisma-adapter @prisma/client resend zod bcryptjs

# Dev
bun add -d prisma @types/bcryptjs

# Shadcn CLI (interactive)
bunx shadcn@latest init

# Shadcn components
bunx shadcn@latest add button card input label textarea badge avatar dialog select toast separator skeleton tabs progress
```

---

## Environment Variables (`.env.local`)

```env
DATABASE_URL=postgresql://...

NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RESEND_API_KEY=
EMAIL_FROM=onboarding@resend.dev   # Resend sandbox sender until custom domain is set up
```

> **Email domain plan:** Until a custom domain is acquired, Resend's `onboarding@resend.dev` sandbox sender works for development. When a domain is ready: add it to Resend dashboard → verify DNS → update `EMAIL_FROM` to `noreply@yourdomain.com`.

---

## File / Folder Structure

```
src/
├── app/
│   ├── globals.css                        # Tailwind 4 @import + brand color tokens
│   ├── layout.tsx                         # Root layout — SessionProvider, Toaster
│   ├── page.tsx                           # Marketing homepage
│   │
│   ├── (auth)/                            # Route group — no shared chrome
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   │
│   ├── (app)/                             # Route group — authenticated shell
│   │   ├── layout.tsx                     # Navbar + app shell wrapper
│   │   ├── dashboard/page.tsx             # User's groups + activity feed
│   │   ├── profile/
│   │   │   ├── page.tsx                   # View own profile
│   │   │   └── edit/page.tsx              # Edit profile form
│   │   ├── users/[userId]/page.tsx        # Public user profile
│   │   └── groups/
│   │       ├── page.tsx                   # Browse + filter all open groups
│   │       ├── new/page.tsx               # Create group wizard
│   │       └── [groupId]/
│   │           ├── page.tsx               # Group detail: members, ideas, vote
│   │           ├── settings/page.tsx      # Edit group (creator only)
│   │           └── invite/page.tsx        # Join via invite link
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts    # Auth.js catch-all
│       ├── groups/
│       │   ├── route.ts                   # GET list / POST create
│       │   └── [groupId]/
│       │       ├── route.ts               # GET / PATCH / DELETE
│       │       ├── join/route.ts          # POST — join via invite token
│       │       ├── members/route.ts       # GET list / DELETE leave or kick
│       │       ├── ideas/
│       │       │   ├── route.ts           # GET / POST ideas
│       │       │   └── [ideaId]/
│       │       │       ├── route.ts       # DELETE idea
│       │       │       └── vote/route.ts  # POST / DELETE vote
│       │       └── invite/route.ts        # POST — regenerate invite token
│       ├── profile/route.ts               # GET own / PUT update
│       └── users/[userId]/route.ts        # GET public profile
│
├── components/
│   ├── ui/                                # Shadcn generated components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── homepage/
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── WhyTeamSection.tsx
│   │   └── FinalCTA.tsx
│   ├── groups/
│   │   ├── GroupCard.tsx
│   │   ├── GroupList.tsx
│   │   ├── GroupFilters.tsx
│   │   ├── GroupDetail.tsx
│   │   ├── MemberCard.tsx
│   │   ├── CreateGroupForm.tsx            # 3-step wizard
│   │   └── InviteSection.tsx
│   ├── ideas/
│   │   ├── IdeaCard.tsx                   # With optimistic vote toggle
│   │   ├── IdeaList.tsx                   # Sorted by vote count
│   │   └── PostIdeaForm.tsx
│   ├── profile/
│   │   ├── ProfileCard.tsx
│   │   └── ProfileEditForm.tsx
│   └── auth/
│       ├── SignInForm.tsx                  # OAuth buttons + email/password form
│       └── SignUpForm.tsx
│
├── lib/
│   ├── auth.ts                            # Auth.js v5 config (providers + callbacks)
│   ├── db.ts                              # Prisma client singleton
│   ├── email.ts                           # Resend client + email templates
│   ├── validations.ts                     # Zod schemas + MAJOR_OPTIONS constant
│   └── utils.ts                           # cn() helper + misc
│
├── hooks/
│   ├── useVote.ts                         # Optimistic vote toggle
│   └── useGroups.ts                       # Client-side group data hooks
│
├── types/
│   └── index.ts                           # Shared TS types, extended Prisma types
│
└── middleware.ts                          # Auth.js route protection
```

---

## Database Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum CommunicationPlatform {
  DISCORD
  SLACK
  MICROSOFT_TEAMS
  WHATSAPP
  TELEGRAM
}

enum MemberRole {
  CREATOR
  MEMBER
}

// ── Auth.js required models ──────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // null for OAuth users
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts     Account[]
  sessions     Session[]
  profile      Profile?
  groupMembers GroupMember[]
  projectIdeas ProjectIdea[]
  votes        Vote[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

// ── App models ───────────────────────────────────────────────────────────────

model Profile {
  id        String   @id @default(cuid())
  userId    String   @unique
  bio       String?  @db.Text
  major     String
  skills    String[]
  linkedin  String?
  github    String?
  twitter   String?
  website   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Group {
  id                 String                @id @default(cuid())
  name               String
  description        String?               @db.Text
  initialProjectIdea String                @db.Text
  projectType        String?
  platform           CommunicationPlatform
  platformLink       String?
  inviteToken        String                @unique @default(cuid())
  maxMembers         Int                   @default(20)
  maxPerMajor        Int                   @default(5)
  isOpen             Boolean               @default(true)
  filledNotifiedAt   DateTime?             // idempotency guard for email
  createdAt          DateTime              @default(now())
  updatedAt          DateTime              @updatedAt

  members      GroupMember[]
  projectIdeas ProjectIdea[]
}

model GroupMember {
  id       String     @id @default(cuid())
  groupId  String
  userId   String
  role     MemberRole @default(MEMBER)
  joinedAt DateTime   @default(now())

  group Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([groupId, userId])
}

model ProjectIdea {
  id          String   @id @default(cuid())
  groupId     String
  authorId    String
  title       String
  description String   @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  group  Group  @relation(fields: [groupId], references: [id], onDelete: Cascade)
  author User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  votes  Vote[]
}

model Vote {
  id      String   @id @default(cuid())
  ideaId  String
  userId  String
  votedAt DateTime @default(now())

  idea ProjectIdea @relation(fields: [ideaId], references: [id], onDelete: Cascade)
  user User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([ideaId, userId])
}
```

---

## Page Routes

### Public (no auth required)

| Route | Purpose |
|---|---|
| `/` | Marketing homepage |
| `/sign-in` | Sign-in (OAuth buttons + email/password) |
| `/sign-up` | Register (email/password + OAuth) |
| `/groups` | Browse open groups (read-only, no auth needed for viewing) |
| `/groups/[groupId]` | Group detail (read-only for non-members) |

### Authenticated

| Route | Purpose |
|---|---|
| `/dashboard` | User's groups + activity |
| `/profile` | Own profile |
| `/profile/edit` | Edit profile |
| `/users/[userId]` | Another user's public profile |
| `/groups/new` | Create group wizard |
| `/groups/[groupId]/settings` | Edit group (creator only) |
| `/groups/[groupId]/invite` | Join via invite link |

---

## Auth.js v5 Setup Notes

- Export `{ handlers, signIn, signOut, auth }` from `src/lib/auth.ts`
- Use `auth()` in server components and API routes (no `getServerSession` in v5)
- Providers: `GitHub`, `Google`, `Credentials` (email/password with bcrypt)
- `events.createUser` callback → auto-create an empty `Profile` row
- `@auth/prisma-adapter` connects sessions to PostgreSQL

---

## Key Implementation Rules

1. **Major cap enforcement** — On every join attempt: count existing members sharing the same `profile.major`; reject if `>= maxPerMajor`
2. **Email idempotency** — Only send "group full" email if `filledNotifiedAt === null`; set it immediately after sending
3. **Creator guards** — All PATCH/DELETE group routes check `GroupMember.role === "CREATOR"` in the handler, not just middleware
4. **Invite token** — Public URL format: `/groups/[groupId]/invite?token=[inviteToken]`; token can be regenerated by creator
5. **Browse page is public** — `/groups` and `/groups/[groupId]` are readable without auth; only join/post/vote require auth
6. **Optimistic voting** — `useVote.ts` updates local count immediately, reverts + shows toast on API error

---

## Implementation Phases

### Phase 0 — Foundation
- Install all packages
- Initialize Shadcn/ui
- Create Prisma schema + run `prisma db push`
- Set up `lib/db.ts`, `lib/auth.ts`, `lib/utils.ts`
- Create `api/auth/[...nextauth]/route.ts`
- Create `middleware.ts` for route protection

### Phase 1 — Marketing Homepage
- Replace default `page.tsx` with full marketing homepage
- Build all homepage section components
- Navbar (public version) + Footer
- Brand color tokens in `globals.css`

### Phase 2 — Auth & Profiles
- Sign-in and sign-up pages
- GitHub + Google OAuth + email/password
- Profile create/edit/view
- `MAJOR_OPTIONS` constant + Zod schemas

### Phase 3 — Groups CRUD
- Create group wizard (3 steps)
- Browse + filter groups page
- Group detail page (members roster, invite link)
- Join via invite link flow

### Phase 4 — Project Voting
- Post idea form
- Idea list sorted by votes
- Optimistic vote toggle

### Phase 5 — Email Notifications
- Resend client setup
- "Group full" email template
- Trigger on join when capacity reached

### Phase 6 — Dashboard & Polish
- Dashboard: user's groups, quick actions
- Group settings page (creator)
- Leave group / kick member
- Loading skeletons, toasts, mobile responsiveness

---

## Homepage Marketing Copy Guidance

**Headline:** "The AI gold rush is here. You need a team."

**Subheadline:** "Over 40% of recent graduates are unemployed or underemployed. Meanwhile, AI is creating the biggest startup opportunity in history — but only teams can fully harness it."

**How It Works (3 steps):**
1. Build your profile — share your major, skills, and what you want to build
2. Find your team — connect with grads from complementary fields
3. Ship something real — vote on a project idea and build it together

**Why a team beats solo + AI:**
- Diverse majors = better products (tech + business + design)
- Shared costs and effort
- Accountability keeps you moving
- Investors fund teams, not solo builders

---

## Critical Files (implement first)

1. `prisma/schema.prisma` — all data flows from here
2. `src/lib/db.ts` — Prisma singleton (prevents connection exhaustion in dev)
3. `src/lib/auth.ts` — Auth.js v5 config; `auth()` used everywhere
4. `src/middleware.ts` — route protection
5. `src/app/api/groups/[groupId]/join/route.ts` — most complex handler (cap checks + email)
