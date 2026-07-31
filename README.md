# Cally (Calendly Clone)

A full-stack, enterprise-ready scheduling application built with Bun, React 19, Express, Prisma, BullMQ, and Razorpay.

---

## 🛠 Tech Stack Overview

- **Frontend**: Bun (HTML Bundler & HMR), React 19, React Router v6, Tailwind CSS 4.x, Framer Motion, Axios, Clerk React SDK.
- **Backend**: Bun Runtime, Express 5.x, Prisma ORM (PostgreSQL), Clerk Express SDK, Razorpay Node SDK, GoogleAPIs, Resend.
- **Worker**: Bun, BullMQ (Redis job queue engine), Resend (Email), GoogleAPIs (Calendar Sync), Razorpay (Payment Webhook Worker).
- **Database & Queue**: PostgreSQL, Redis.

For detailed architecture diagrams, environment configurations, and data flows, read [ai/tech-stack.md](file:///Users/rupeshjagtap/projects/calenderly-clone/ai/tech-stack.md).

---

## 🚀 Getting Started

### Prerequisites

- **Bun**: `curl -fsSL https://bun.sh/install | bash`
- **PostgreSQL**: Running locally or hosted (e.g. Supabase).
- **Redis**: Running locally (via Docker or native service).
  ```bash
  docker run -d --name redis -p 6379:6379 redis:alpine
  ```

### Installation

Install dependencies across all workspaces:

```bash
cd frontend && bun install
cd ../backend && bun install
cd ../worker && bun install
```

### Running Locally

Start each component in separate terminal sessions (or using Bun scripts):

```bash
# 1. Start Backend API (Port 5001)
cd backend && bun run dev

# 2. Start Worker Process
cd worker && bun run dev

# 3. Start Frontend App (Port 3000)
cd frontend && bun run dev
```

---

## 📂 Documentation

- 📄 [Tech Stack & Architecture Documentation](file:///Users/rupeshjagtap/projects/calenderly-clone/ai/tech-stack.md)
- 📄 [AI Context & Guidelines](file:///Users/rupeshjagtap/projects/calenderly-clone/ai/context.md)
