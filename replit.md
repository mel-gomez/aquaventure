# Aquaventure Swim School

## Overview

Full-stack web application for Aquaventure Swim School (est. 2019) — a children-focused swim school in Angono, Rizal, Philippines. Includes a public landing page, parent/swimmer portal, and admin dashboard.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (App Router-style with wouter), Tailwind CSS, Framer Motion
- **Backend**: Express.js v5
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: JWT (access + refresh tokens via jsonwebtoken + bcryptjs)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## App Structure

### Frontend (`artifacts/aquaventure`)
- `/` — Public landing page with ocean theme, wave animations, school logo
- `/programs` — Browse all swim programs
- `/login`, `/register` — Authentication pages
- `/portal` — Parent/swimmer portal (protected): enrollments, announcements
- `/portal/enroll` — Enrollment form (protected)
- `/admin` — Admin dashboard (protected, admin-only): stats, charts
- `/admin/swimmers` — Manage swimmers/parents
- `/admin/enrollments` — Manage all enrollments with status updates
- `/admin/programs` — Create and view swim programs
- `/admin/sessions` — Create and view sessions
- `/admin/announcements` — Post announcements

### Backend (`artifacts/api-server`)
Routes:
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Refresh JWT tokens
- `GET/PATCH /api/profile` — User profile
- `GET /api/programs`, `GET /api/programs/:id` — Programs
- `GET /api/sessions`, `GET /api/sessions/:id` — Sessions
- `POST /api/enrollments` — Enroll in a session
- `GET /api/enrollments/my` — User's enrollments
- `DELETE /api/enrollments/:id` — Cancel enrollment
- `GET /api/announcements` — Public announcements
- `GET /api/admin/stats` — Admin dashboard stats
- `GET /api/admin/swimmers` — All users
- `GET /api/admin/enrollments` — All enrollments
- `PATCH /api/admin/enrollments/:id/status` — Update enrollment status
- `POST /api/admin/programs` — Create program
- `POST /api/admin/sessions` — Create session
- `POST /api/admin/announcements` — Post announcement

## Database Schema (`lib/db`)
Tables: `users`, `programs`, `sessions`, `enrollments`, `announcements`

## Seed Accounts
- **Admin**: admin@aquaventure.com / admin123
- **Parent**: maria.santos@gmail.com / parent123
- **Parent**: jose.reyes@gmail.com / parent123

## Design
- Ocean gradient palette: deep navy (#0a1628) → aqua (#00c4cc)
- Glassmorphism card accents
- CSS wave animations in hero section
- Framer Motion scroll animations
- Aquaventure Giants logo prominently featured

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
