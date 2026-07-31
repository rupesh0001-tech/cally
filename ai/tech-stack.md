# Cally — Tech Stack & Architecture Reference

> A full-stack Calendly clone built with Bun, React 19, Express, Prisma, BullMQ, and Razorpay.

---

## Project Structure

```
calenderly-clone/
├── frontend/          # Bun HTML bundler + React 19 SPA
├── backend/           # Bun + Express REST API
├── worker/            # BullMQ background job workers
└── ai/                # AI-generated context, audits, and docs
```

All three workspaces are **independent Bun projects** — each has its own `package.json`, `bun.lock`, and `.env`. They communicate via HTTP (frontend → backend) and Redis queues (backend → worker).

---

## Runtime & Tooling

| Tool | Version | Role |
|------|---------|------|
| **Bun** | 1.3.x | JavaScript runtime, package manager, bundler, and dev server across all three workspaces |
| **TypeScript** | 7.x (backend), 5.x (worker) | Static typing throughout |
| **Docker** | — | Redis container for local development (`docker start redis`) |

### Why Bun everywhere?
- Single tool replaces Node.js + npm/yarn + ts-node + esbuild
- Native `.env` file loading via `--env-file=.env`
- Hot reloading via `--hot` flag in development
- Built-in HTML bundler (frontend) that handles JSX, CSS imports, and HMR natively

---

## Frontend (`/frontend`)

### Runtime & Bundler

| Package | Purpose |
|---------|---------|
| **Bun HTML Bundler** | Bundles `src/index.html` → serves JSX/TSX/CSS natively. No Vite/webpack needed. |
| **`src/index.ts`** | Bun HTTP server (`serve()`) — serves `index.html` for all routes (SPA shell), with HMR in dev |

> ⚠️ Because this is Bun's bundler (not Vite), `import.meta.env` is **not** available. Env vars are injected via `window.process.env` in `index.html`'s inline `<script>` shim.

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| **`react`** | 19 | UI component library (concurrent features, new compiler) |
| **`react-dom`** | 19 | React DOM renderer |
| **`react-router-dom`** | 6.x | Client-side routing — SPA navigation |

### Authentication

| Package | Purpose |
|---------|---------|
| **`@clerk/react`** | Clerk React SDK — provides `<ClerkProvider>`, `useAuth()`, `useUser()`, `<SignIn>`, `<UserButton>` etc. Handles all auth UI and session tokens. |

### HTTP

| Package | Purpose |
|---------|---------|
| **`axios`** | HTTP client — used for all API calls to the backend. The `useApi()` hook (`src/lib/api.ts`) wraps axios and auto-attaches Clerk JWT Bearer tokens. |

### Styling

| Package | Purpose |
|---------|---------|
| **`tailwindcss`** | 4.x — Utility-first CSS. Configured via `bun-plugin-tailwind` directly in the Bun bundler pipeline (no PostCSS config needed). |
| **`bun-plugin-tailwind`** | Bun bundler plugin that processes Tailwind CSS at build time |
| **`clsx`** | Utility for conditional class name composition |

### Animations & UI

| Package | Purpose |
|---------|---------|
| **`framer-motion`** | 12.x — Declarative animations and page transitions |
| **`dayjs`** | Lightweight date/time library — used for formatting booking times, date arithmetic |
| **`lucide-react`** *(inlined)* | Icon set — used throughout dashboard and booking UI |

### Key Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | `Landing` | Marketing landing page |
| `/login` | `Login` | Clerk sign-in |
| `/register` | `Register` | Clerk sign-up |
| `/onboarding` | `Onboarding` | New user username + timezone setup |
| `/dashboard/*` | `Dashboard` | Host dashboard (event types, bookings, analytics, settings) |
| `/:username/:slug` | `Booking` | Public booking page for attendees |
| `/preview/:eventTypeId` | `Preview` | Live preview of booking page for hosts |

### Component Structure

```
src/
├── App.tsx              # ClerkProvider + RouterProvider root
├── frontend.tsx         # React hydration entry point
├── index.ts             # Bun serve() HTTP server
├── index.html           # HTML shell with window.process.env shim
├── index.css            # Global Tailwind base styles + custom fonts
├── components/
│   ├── ui/              # Design system: Button, Select, Input, Modal, etc.
│   └── layout/          # Header, Sidebar, PublicLayout, DashboardLayout
├── layouts/             # Route-level layout wrappers
├── lib/
│   └── api.ts           # useApi() hook — authenticated axios client
├── pages/               # Feature pages (see table above)
└── routes/              # React Router route tree definitions
```

---

## Backend (`/backend`)

### Runtime & Framework

| Package | Version | Purpose |
|---------|---------|---------|
| **Bun** | 1.3.x | Runtime — runs Express app natively without Node.js |
| **`express`** | 5.x | HTTP web framework — REST API |
| **`cors`** | 2.x | CORS middleware — allows frontend (port 3000) to call API (port 5001) |

### Authentication

| Package | Purpose |
|---------|---------|
| **`@clerk/express`** | Express middleware (`clerkMiddleware()`) — verifies Clerk JWTs on every request, populates `req.auth` |
| **`@clerk/backend`** | Low-level Clerk API client — used for webhook verification and user management operations |
| **`svix`** | Svix webhook verification — used to validate incoming Clerk webhook events (`user.created`, `user.updated` etc.) |

### Database

| Package | Purpose |
|---------|---------|
| **`@prisma/client`** | Auto-generated type-safe ORM client for all database operations |
| **`@prisma/adapter-pg`** | Prisma adapter for raw `pg` connections |
| **`pg`** | Native PostgreSQL client driver |
| **`prisma`** *(dev)* | CLI — schema migrations and client generation |

#### Database Schema (PostgreSQL)

| Model | Table | Description |
|-------|-------|-------------|
| `User` | `users` | Host profiles — synced from Clerk via webhook. Uses Clerk User ID as PK. |
| `EventType` | `event_types` | Scheduling link templates — title, duration, location, availability, limits, payment, seats |
| `Booking` | `bookings` | Individual meeting bookings — attendee info, time slot, status, custom field answers |
| `HostAnalytics` | `host_analytics` | Aggregate stats per host — total bookings and revenue |
| `GoogleAccount` | `google_accounts` | OAuth tokens for Google Calendar integration per user |

### Background Queues

| Package | Purpose |
|---------|---------|
| **`bullmq`** | Redis-backed job queue — backend **enqueues** jobs; worker **processes** them |
| **`ioredis`** | Redis client — connects to Redis for BullMQ queue transport |

#### Queues defined in `queues/booking-queues.ts`

| Queue | Jobs | Description |
|-------|------|-------------|
| `email` | `booking-confirmation`, `booking-cancellation` | Trigger transactional emails |
| `calendar` | `create-event`, `update-event`, `delete-event` | Sync events with Google Calendar |
| `analytics` | `update-stats` | Update host analytics aggregates |
| `payment` | *(inbound via webhook)* | Process Razorpay payment webhook events |

### Payments

| Package | Purpose |
|---------|---------|
| **`razorpay`** | Official Razorpay Node SDK — creates orders, verifies payment signatures via HMAC-SHA256 |

### Email

| Package | Purpose |
|---------|---------|
| **`resend`** | Transactional email API — sends booking confirmation / cancellation emails |

### Google Calendar

| Package | Purpose |
|---------|---------|
| **`googleapis`** | Google APIs client — OAuth2 flow and Google Calendar API calls |

### API Route Structure

```
/api
├── /auth          # Google OAuth connect + callback
├── /users         # User profile CRUD (protected)
├── /events        # Event type CRUD (protected)
├── /bookings      # Booking creation (public) + management (protected/token)
└── /webhooks
    ├── /clerk     # Clerk user lifecycle webhooks (svix verification)
    └── /razorpay  # Razorpay payment webhooks (HMAC → BullMQ)
```

### Module Structure

```
backend/
├── app.ts                      # Express app setup (CORS, middleware, routes)
├── index.ts                    # Server entry — binds to port 5001
├── config/
│   ├── env.ts                  # Env var loading + startup warnings
│   └── database.ts             # Prisma client singleton
├── common/
│   ├── middleware/
│   │   └── auth.middleware.ts  # requireAuth() guard
│   └── utils/
│       └── security.ts         # HMAC booking token generation + verification
├── modules/
│   ├── auth/                   # Google OAuth routes + controller
│   ├── users/                  # User profile routes + service + repository
│   ├── events/                 # Event type routes + service + repository
│   └── bookings/               # Booking routes + service + repository
├── queues/
│   └── booking-queues.ts       # BullMQ queue definitions
└── routes/
    ├── index.ts                # Top-level router
    └── webhooks.routes.ts      # Clerk + Razorpay webhook handlers
```

---

## Worker (`/worker`)

An independent **long-running process** that consumes jobs from Redis queues. Keeps API response times fast by offloading slow operations to the background.

### Workers

| File | Queue | Jobs Handled |
|------|-------|-------------|
| `email.worker.ts` | `email` | Sends confirmation/cancellation emails via Resend |
| `calendar.worker.ts` | `calendar` | Creates/updates/deletes Google Calendar events |
| `payment.worker.ts` | `payment` | Verifies Razorpay webhooks, confirms bookings, enqueues downstream jobs |
| `analytics.worker.ts` | `analytics` | Increments total bookings and revenue in `HostAnalytics` |
| `cron.worker.ts` | *(scheduled)* | Recurring maintenance jobs |

---

## Infrastructure & External Services

| Service | Provider | Purpose |
|---------|----------|---------|
| **Database** | PostgreSQL | Primary data store |
| **Cache / Queue** | Redis (Docker) | BullMQ job queue transport |
| **Auth** | [Clerk](https://clerk.com) | User auth, session management, JWTs |
| **Email** | [Resend](https://resend.com) | Transactional booking emails |
| **Payments** | [Razorpay](https://razorpay.com) | Indian payment gateway |
| **Image CDN** | [ImageKit](https://imagekit.io) | Profile image storage and CDN |
| **Calendar** | Google Calendar API | Two-way calendar event sync |

---

## Data Flow: Booking Creation

```
Attendee (browser)
  │  POST /api/bookings (public, no auth required)
  ▼
Backend (Express)
  ├─ Validates: notice period, availability, overlap, seats, buffers
  ├─ Creates Booking record (status: confirmed | pending_payment)
  ├─ If paid → creates Razorpay order → returns to browser
  ├─ If free → enqueues email + calendar + analytics jobs
  └─ Returns booking + HMAC token (for cancel/reschedule authorization)

  [Paid flow]
  Attendee completes Razorpay checkout
  │  POST /api/bookings/payment/verify
  ▼
Backend verifies HMAC signature → confirms booking → enqueues jobs

  [OR via Razorpay webhook]
  POST /api/webhooks/razorpay → enqueues payment job
  ▼
Worker (payment.worker) — verifies signature → confirms booking → enqueues downstream
Worker (email.worker)    → Resend API → confirmation email
Worker (calendar.worker) → Google Calendar API → creates event
Worker (analytics.worker)→ updates HostAnalytics totals in DB
```

---

## Security Model

| Concern | Implementation |
|---------|---------------|
| **Host auth** | Clerk JWT verified by `@clerk/express` on all protected routes |
| **Cancel/Reschedule auth** | HMAC-SHA256 token (bookingId + CLERK_SECRET_KEY) returned at booking time. Verified in `isAuthorizedForBooking()`. |
| **Payment verification** | HMAC-SHA256 of `orderId|paymentId` using `RAZORPAY_KEY_SECRET` |
| **Webhook verification** | HMAC-SHA256 of raw request body using `RAZORPAY_WEBHOOK_SECRET` — mandatory, no bypass |
| **Clerk webhook verification** | Svix signature verification on `/api/webhooks/clerk` |

---

## Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (injected via `window.process.env` shim in `index.html`) |
| `VITE_API_URL` | Backend base URL — `http://localhost:5001/api` |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key — JWT verification + booking HMAC |
| `REDIS_URL` | Redis connection URL |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook signing secret |
| `RESEND_API_KEY` | Resend email API key |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL |

### Worker (`worker/.env`)

Same as backend, plus:

| Variable | Description |
|----------|-------------|
| `EMAIL_FROM` | Sender address for Resend emails |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit CDN public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit CDN private key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit CDN endpoint URL |
