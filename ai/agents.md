# AGENTS.md

## Overview

This project is an intelligent scheduling platform similar to Calendly and Cal.com. The goal is to provide seamless appointment booking, calendar synchronization, availability management, automated reminders, and AI-powered scheduling assistance.

Agents should prioritize reliability, security, and a frictionless user experience.

---

# Product Goals

- Simple meeting scheduling
- Multi-calendar synchronization
- Time zone awareness
- Team scheduling
- Round-robin assignment
- Booking links
- Automated reminders
- AI scheduling assistant
- Integrations with third-party services
- Fast and accessible UI

---

# Tech Stack

Example stack (modify as needed):

Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

Backend
- Node.js
- NestJS / Express
- PostgreSQL
- Prisma

Authentication
- Clerk / Auth.js

Infrastructure
- Vercel
- Docker
- GitHub Actions

---

# Coding Standards

## General

- Write clean, readable code.
- Prefer composition over inheritance.
- Keep functions small.
- Avoid duplication.
- Write self-documenting code.
- Favor explicitness over cleverness.

---

## TypeScript

- Strict mode enabled.
- Never use `any` unless absolutely necessary.
- Prefer interfaces for API contracts.
- Use Zod for validation.

---

## React

- Functional components only.
- Prefer Server Components where applicable.
- Keep components focused.
- Extract reusable hooks.
- Avoid unnecessary state.

---

## API

- RESTful endpoints.
- Validate every request.
- Return consistent error formats.
- Never expose internal errors.
- Log server errors.

---

## Database

- Use migrations.
- Never edit production data manually.
- Prefer transactions for multi-step operations.
- Add indexes where appropriate.

---

# Security

Always:

- Validate input
- Sanitize output
- Escape HTML
- Use parameterized queries
- Hash passwords
- Encrypt secrets
- Verify OAuth state
- Verify webhooks
- Protect against CSRF
- Protect against XSS
- Protect against SQL injection

Never:

- Commit secrets
- Log passwords
- Log tokens
- Expose API keys

---

# Calendar Rules

Scheduling logic must:

- Prevent double booking
- Respect working hours
- Respect buffer times
- Respect minimum notice
- Respect booking windows
- Handle time zones correctly
- Handle daylight saving changes
- Support recurring availability

---

# AI Agent Responsibilities

AI agents may assist with:

- Finding available meeting slots
- Summarizing meetings
- Drafting follow-up emails
- Suggesting meeting times
- Detecting scheduling conflicts
- Answering scheduling questions

Agents must never:

- Send emails without permission
- Delete meetings without confirmation
- Modify calendars without authorization
- Share private calendar information

---

# Folder Structure

```
app/
components/
features/
lib/
hooks/
prisma/
public/
types/
tests/
```

---

# Testing

Every feature should include:

- Unit tests
- Integration tests
- Edge cases
- Error handling tests

Critical scheduling logic should achieve high test coverage.

---

# Logging

Log:

- Errors
- Authentication failures
- Webhook failures
- Background job failures

Do not log:

- Access tokens
- Refresh tokens
- Passwords
- Sensitive user information

---

# Pull Request Checklist

Before merging:

- Code builds successfully
- Tests pass
- Lint passes
- Types pass
- Documentation updated
- No console logs
- No secrets committed

---

# Commit Convention

Use Conventional Commits.

Examples:

feat: add Google Calendar sync

fix: resolve timezone conversion bug

docs: update installation guide

refactor: simplify availability calculation

test: add booking API tests

---

# Performance Guidelines

- Lazy load heavy components
- Optimize database queries
- Cache expensive operations
- Minimize API calls
- Avoid unnecessary re-renders

---

# Rules

1. Do not commits changes unless told 
2. If you want to create a UI always check for general components and if changing a module always check if a component exists in that module folder or general folder. If yes, modify or reuse that. Only if it doesn't exist, create a new one.

# Accessibility

All UI should:

- Be keyboard accessible
- Support screen readers
- Meet WCAG AA standards
- Have sufficient color contrast
- Include proper ARIA labels

---

# Definition of Done

A task is complete when:

- Feature works correctly
- Tests pass
- Documentation updated
- Code reviewed
- No known critical bugs
- Performance acceptable
- Accessibility verified

---

# Guiding Principles

1. User privacy comes first.
2. Reliability is more important than cleverness.
3. Simplicity beats complexity.
4. Security is non-negotiable.
5. Every scheduling decision should be deterministic.
6. APIs should remain stable and predictable.
7. Build for maintainability.