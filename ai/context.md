You can use the following as a comprehensive project context (PRD + system overview) when giving this project to another AI (Claude, Cursor, GitHub Copilot, Gemini, etc.). It explains the business goals, features, architecture, constraints, and expectations.

---

# Project Context: Calendly-like Scheduling Platform

## Overview

Build a production-ready scheduling platform similar to Calendly where service providers (hosts) can create booking pages, define their availability, accept payments, sync with external calendars, and allow customers (bookers) to schedule appointments without manual coordination.

The project should focus on real-world backend engineering challenges including:

* Availability computation
* Timezone management
* Calendar synchronization
* Payment processing
* Background workers
* Concurrency-safe booking
* Event-driven architecture
* Audit logging
* Scalability

This is intended to be a portfolio-quality full-stack project demonstrating mid-level to senior software engineering skills.

---

# Primary Users

## 1. Host (Service Provider)

Examples:

* Consultant
* Doctor
* Tutor
* Freelancer
* Recruiter
* Coach
* Sales Representative

The host creates booking pages and manages their schedule.

---

## 2. Booker (Customer)

Anyone who wants to schedule an appointment with a host.

---

# Core Goal

Allow a customer to book an available time slot while ensuring:

* No double bookings
* Accurate timezone handling
* External calendar conflict detection
* Reliable payment processing
* Automatic notifications
* High scalability

---

# Functional Requirements

## Authentication

Hosts can:

* Register
* Login
* Logout
* Reset password
* Verify email
* OAuth Login (Google)

Each user has

* profile
* timezone
* locale
* notification preferences

---

# Host Dashboard

Hosts should be able to

### Manage Event Types

Example

* 30-minute Consultation
* 60-minute Interview
* Discovery Call
* Coaching Session

Each event contains

* title
* description
* duration
* price
* location
* meeting platform
* booking questions
* cancellation policy

---

### Availability Rules

Hosts define recurring schedules.

Example

Monday

9:00 AM – 5:00 PM

Tuesday

10:00 AM – 6:00 PM

etc.

---

### Availability Overrides

Hosts can add exceptions.

Examples

Unavailable

* Vacation
* Public holiday

Available

* Saturday special hours

---

### Booking Rules

Support

* minimum notice
* maximum days ahead
* buffer before appointment
* buffer after appointment
* booking limits
* daily meeting limit

---

### Booking Page

Each host receives

```
/john-doe
```

or

```
/book/john
```

Public users can access without login.

---

# Booker Experience

Bookers should

View

* available dates
* available time slots

Select

* date
* time

Fill

* name
* email
* phone
* answers to booking questions

Pay if required

Receive confirmation

---

# Availability Engine

This is the heart of the application.

Slots should **NOT** be stored.

Slots are generated dynamically from

Recurring Rules

*

Overrides

*

Existing Bookings

*

External Calendar Events

*

Buffer Times

*

Booking Constraints

The availability engine should behave like a pure function.

---

# Timezone Handling

Store

All timestamps in UTC.

Each host stores

```
timezone
```

Example

```
America/New_York
```

Bookers see slots in their own timezone.

Handle

* DST transitions
* timezone conversion
* browser timezone detection

---

# Booking Engine

Booking flow

```
Choose slot

↓

Validate slot

↓

Start transaction

↓

Lock slot

↓

Create booking

↓

Commit

↓

Publish events

↓

Return success
```

Must prevent

* race conditions
* duplicate bookings
* concurrent reservations

Use

* DB transaction
* unique constraints
* row locking (SELECT ... FOR UPDATE) or advisory locks

---

# Booking State Machine

Booking lifecycle

```
Pending Payment

↓

Confirmed

↓

Completed
```

Alternative transitions

```
Pending

↓

Cancelled
```

```
Confirmed

↓

Rescheduled
```

Every transition should be validated.

Maintain audit history.

Never lose booking history.

---

# Payments

Stripe Integration

Support

* paid bookings
* free bookings

Implement

Payment Intent

↓

Webhook

↓

Booking confirmation

Worker processes

* payment success
* payment failure
* refunds

Webhook handling must be idempotent.

---

# Google Calendar Integration

Host connects Google account.

Platform should

Read calendar

↓

Detect conflicts

↓

Create booking event

↓

Update event

↓

Delete event on cancellation

Support

* OAuth
* token refresh
* webhook/polling sync

---

# Meeting Providers

Support

* Google Meet
* Zoom
* Microsoft Teams

Meeting links generated automatically.

---

# Notifications

Email

* booking confirmation
* cancellation
* reminders
* reschedule

SMS

Optional

Push Notifications

Optional

---

# Background Workers

Use workers for asynchronous tasks.

Workers include

### Calendar Worker

* create calendar events
* update events
* delete events
* sync calendars

---

### Email Worker

* confirmations
* reminders
* cancellations

---

### Notification Worker

* SMS
* Push Notifications

---

### Payment Worker

* process Stripe webhooks
* update booking status
* retries

---

### Cleanup Worker

Runs periodically.

Responsibilities

* release expired reservations
* remove stale locks
* clean temporary data

---

### Analytics Worker

Generate

* reports
* statistics
* dashboards

---

# Queue

Use

Redis

*

BullMQ

(or RabbitMQ)

Flow

```
API

↓

Queue

↓

Workers

↓

External Services
```

---

# Services

Backend should be modular.

Suggested services

```
User Service

Availability Service

Booking Service

Payment Service

Calendar Service

Meeting Service

Notification Service

Audit Service

Analytics Service
```

---

# External Integrations

Google Calendar

Outlook Calendar

Stripe

Zoom

Google Meet

Microsoft Teams

SendGrid

Twilio

AWS S3

---

# Database

Primary Database

PostgreSQL

Cache

Redis

Storage

AWS S3

Analytics

ClickHouse or PostgreSQL Analytics Tables

---

# API

REST API

(or GraphQL)

Public endpoints

Booking page

Private endpoints

Dashboard

Authentication

Admin

---

# Admin Panel

Admin should manage

Users

Bookings

Payments

Refunds

System Logs

Analytics

Feature Flags

Audit Logs

---

# Reports

Dashboard metrics

Bookings

Revenue

Conversion Rate

Cancellation Rate

Most Popular Event Types

Host Performance

Customer Activity

---

# Security

JWT Authentication

OAuth

RBAC

Rate Limiting

CSRF Protection

Input Validation

Secure Cookies

HTTPS

Encrypted Secrets

Audit Logging

---

# Infrastructure

Frontend

* Next.js
* React
* Tailwind CSS

Backend

* NestJS (preferred) or Express.js

Database

* PostgreSQL

Cache & Queue

* Redis + BullMQ

ORM

* Prisma

Storage

* AWS S3

Deployment

* Docker
* Kubernetes (optional)
* GitHub Actions CI/CD

Monitoring

* Prometheus
* Grafana
* ELK Stack

---

# Non-Functional Requirements

* Scalable architecture
* Modular services
* High availability
* Event-driven communication
* Background job processing
* Horizontal scaling
* Fault tolerance
* Retry mechanisms
* Idempotent operations
* Clean code architecture
* SOLID principles
* Comprehensive logging
* Production-ready error handling

---

# Future Enhancements

* Multi-host organizations
* Team scheduling
* Round-robin booking
* Group events
* Waitlists
* Recurring meetings
* AI scheduling assistant
* Booking recommendations
* Custom domains
* White-label branding
* Multi-language support
* Mobile application
* Video recording integration
* CRM integrations (HubSpot, Salesforce)
* Webhook API for third-party integrations

---

## Expected Architecture

```
                           Clients
         (Web App | Mobile App | Public Booking Page)
                                  │
                                  ▼
                            API Gateway
                                  │
      ┌──────────────┬────────────┴────────────┬──────────────┐
      ▼              ▼                         ▼              ▼
 User Service   Availability Service    Booking Service   Payment Service
      │              │                         │              │
      ├──────────────┼──────────────┬──────────┼──────────────┤
      ▼              ▼              ▼          ▼
 Calendar      Notification     Meeting    Audit Service
 Service          Service       Service
                                  │
                                  ▼
                     PostgreSQL + Redis + S3
                                  │
                                  ▼
                        Message Queue (BullMQ)
                                  │
        ┌──────────────┬──────────────┬──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
 Calendar Worker  Email Worker  Payment Worker  Cleanup Worker
        │              │              │              │
        └──────────────┴──────────────┴──────────────┘
                                  │
                                  ▼
     Google Calendar • Stripe • SendGrid • Twilio • Zoom • Teams
```

This context defines the complete vision for the application and can serve as the single source of truth for development, system design discussions, implementation planning, and interview presentations.
