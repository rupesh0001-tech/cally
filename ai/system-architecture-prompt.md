# System Architecture Generation Prompt for AI

Use the following prompt with any AI (such as Claude, ChatGPT, DeepSeek, or Eraser.io) to generate a complete visual system architecture diagram and specification for **Cally**.

---

```markdown
You are a Principal Software Architect and Systems Engineer. 

Generate a comprehensive System Architecture Specification and visual diagrams (using Mermaid.js syntax) for **Cally**, an enterprise-grade Calendly clone built on a modern distributed micro-monolith / worker queue architecture.

---

### 🌐 System Overview & Context

**Cally** is an automated scheduling and event management platform. It allows hosts to define availability, event types, integrations (Google Calendar, Razorpay payments), and allows invitees to book appointments with real-time slot conflict checking, automated calendar sync, email notifications, and webhook processing.

### 🏗 Tech Stack Blueprint

1. **Frontend (SPA)**:
   - **Runtime / Bundler**: Bun Native HTML Bundler (HMR enabled)
   - **Framework**: React 19, React Router v6, Tailwind CSS 4.x, Framer Motion
   - **Authentication**: Clerk React SDK (`@clerk/clerk-react`)
   - **HTTP Client**: Axios with Bearer token interceptors

2. **Backend API**:
   - **Runtime**: Bun Runtime (`bun run index.ts`)
   - **Framework**: Express.js 5.x REST API
   - **Database ORM**: Prisma ORM v6 with PostgreSQL (`@prisma/client`)
   - **Auth Verification**: Clerk Express Middleware (`@clerk/express`)
   - **Job Queue Producer**: BullMQ v5 with Redis (`ioredis`)
   - **Integrations**: Google APIs Client (`googleapis`), Razorpay SDK (`razorpay`)

3. **Asynchronous Worker Service**:
   - **Runtime**: Bun Worker Process
   - **Queue Engine**: BullMQ v5 (Redis-backed)
   - **Job Processors**:
     - `email`: Resend SDK (Booking Confirmations, Cancellations, Reminders)
     - `calendar`: Google Calendar API (OAuth2 refresh tokens, event creation, updates, deletes)
     - `payment`: Razorpay Webhooks (Order verification, status updates, refund logic)
     - `analytics`: Usage tracking & audit logging

4. **Data & Queue Layer**:
   - **Database**: PostgreSQL (Entities: `User`, `Availability`, `EventType`, `Booking`, `Payment`, `CalendarSync`, `Integration`)
   - **In-Memory Store / Broker**: Redis 7.x (BullMQ job state, rate limiting, availability caching)

---

### 🎨 Required Deliverables in Output

Please generate the following structured architectural artifacts:

#### 1. High-Level Architecture Diagram (Mermaid `graph TD` or `C4Context`)
- Show all external actors: **Host / User**, **Invitee / Public**, **Clerk Auth Provider**, **Google Calendar API**, **Razorpay Gateway**, **Resend Email Service**.
- Clearly delineate boundaries: Frontend Client, Backend API Gateway/Server, Redis Queue Broker, Async Workers, PostgreSQL Database.

#### 2. C4 Model Breakdown
- **Level 1: System Context Diagram** (Systems, Actors, Integrations)
- **Level 2: Container Diagram** (React SPA, Express API, BullMQ Workers, Postgres, Redis)
- **Level 3: Component Diagram for Workers & API** (Controller -> Service -> Queue -> Processor -> Integration)

#### 3. Core Data Flow & Sequence Diagrams (Mermaid `sequenceDiagram`)
Generate sequence diagrams for these 3 critical user journeys:
1. **Paid Event Booking Flow**: Invitee selects slot -> API verifies conflict & creates Razorpay Order -> Invitee pays -> Webhook fires -> Worker processes payment & enqueues Email + Calendar Sync jobs.
2. **Real-time Slot Availability Calculation**: Request -> Load Weekly Rules + Overrides + Fetch Google Calendar Busy Times -> Intersect & Subtract -> Return Available Slots.
3. **Google Calendar OAuth2 & Background Sync**: Host connects OAuth -> Token saved encrypted -> Booking event enqueued -> Worker refreshes access token -> Insert/Update Google Calendar event.

#### 4. Data Topology & Entity-Relationship Overview (Mermaid `erDiagram`)
- Diagram primary tables and relationships (`User` 1:N `EventType`, `EventType` 1:N `Booking`, `Booking` 1:1 `Payment`, `User` 1:N `Availability`, `User` 1:1 `CalendarSync`).

#### 5. Network & Security Topology
- Outline Authentication & Authorization flow (Clerk JWTs, session tokens).
- Define webhook signature verification (Razorpay HMAC-SHA256).
- Worker resilience (retry policies, dead-letter queue / failed job strategy, exponential backoff).

---

### 🎯 Tone & Output Requirements
- Use clean, standard, syntactically valid **Mermaid.js** syntax for all diagrams so they render directly in Markdown viewers.
- Provide detailed architectural explanations alongside each diagram.
```
