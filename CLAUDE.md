# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Vietnamese-language LMS (Learning Management System) portal built with **Next.js 16 App Router**, **shadcn/ui** (radix-nova style), and **Tailwind CSS v4**. Uses **Firebase Firestore** for data storage and **NextAuth v5** (beta) for JWT-based authentication.

## Dev Commands

```sh
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
npm run format    # Format all .ts/.tsx with Prettier
npm run typecheck # TypeScript check (noEmit)
```

## Architecture

### Role-Based Routing

The app serves multiple user roles, each with its own layout and shell components:

- `app/(student)/` — Adult student portal (uses `student-shell.tsx`)
- `app/elementary-student/` — Elementary student portal (uses `elementary-student-shell.tsx`)
- `app/elementary-teacher/` — Elementary teacher portal (uses `teacher-shell.tsx`)
- `app/staff/` — Staff/admin portal (uses `staff-shell.tsx`)
- `app/(auth)/` — Auth routes (login, login-student, register, forgot-password)
- `app/admin/seed` — Firestore seed data endpoint
- `app/instructor/` — Instructor portal

### Auth & Middleware

- **`auth.ts`** (root) — NextAuth v5 config with Google + Credentials providers. Credentials provider queries `users` collection in Firestore directly (no password hashing — plain text comparison).
- **`proxy.ts`** — NextAuth middleware: redirects authenticated users away from public routes (`/login`, `/register`, `/forgot-password`), redirects unauthenticated users to `/login` with callbackUrl.
- JWT session strategy: token carries `roles[]` and `schoolId`.

### Firebase / Firestore

- `lib/firebase/client.ts` — Firebase app initialization + lazy analytics
- `lib/firebase/firestore.ts` — Exports `db` (Firestore instance)
- Required env vars: `NEXT_PUBLIC_FIREBASE_*` (apiKey, appId, authDomain, projectId, etc.)
- Firestore collections used: `users`, `classes`, `groups`, `lessons`, `quizzes`, `students`

### App Router Structure

```text
app/
├── (auth)/login, login-student, register, forgot-password
├── (student)/dashboard, courses/[id], attendance, calendar, ai-assistant, assignment-personal
├── elementary-student/dashboard, classes, groups, quiz
├── elementary-teacher/dashboard, classes, groups, quizzes
├── staff/classes
├── admin/seed
├── api/auth/[...nextauth]
├── instructor/  (empty)
```

### Student Portal Layout (`app/(student)/layout.tsx`)

Fixed two-column app shell (not using Next.js layout groups for sidebar persistence):

```text
AppSidebar (248px) | AppTopbar (sticky, 72px)
                    | main.content (CSS Grid: 1fr 404px rail)
```

### Feature-Based Architecture (`features/`)

Domain features live under `features/<domain>/` with internal `components/`, `hooks/`, `mock/` subdirectories. Pages in `app/` compose feature components rather than owning them.

Current features: `admin`, `ai-assistant`, `activities`, `assignment-personal`, `attendance`, `auth`, `calendars`, `courses`, `dashboard`, `elementary`, `notifications`, `results`, `staff`, `tasks`.

### Shared Components (`components/`)

- Role shell components: `student-shell.tsx`, `elementary-student-shell.tsx`, `elementary-teacher-shell.tsx`, `staff-shell.tsx`
- Portal chrome: `app-sidebar.tsx`, `app-topbar.tsx`, `staff-sidebar.tsx`
- UI: `ui/` — shadcn/ui components (added via `npx shadcn@latest add <component>`)
- Utilities: `badge-status.tsx`, `icon-tint.tsx`, `quick-actions.tsx`, `stat-card.tsx`, `page-header.tsx`

### Styling System

- **Tailwind v4** with `@import "tailwindcss"` (no tailwind.config.js) — PostCSS via `@tailwindcss/postcss`
- **CSS custom properties** for semantic colors in `app/globals.css`
- Custom properties include: `--success`, `--warning`, `--danger` (in addition to standard shadcn vars), `--course-violet/green/blue/amber/teal/rust` for course category gradients
- **Custom layout classes** (not Tailwind utility classes): `.app`, `.sidebar`, `.nav-item`, `.content`, `.col-main`, `.rail`, `.course-*`, etc. — hand-written in globals.css
- Dark mode via `.dark` class on `<html>`
- `app/elementary.css` — separate stylesheet for elementary student portal styles

### Path Aliases

All resolve from the project root via `tsconfig.json`:

```text
@/*  → ./* (all root-relative paths)
```

### Key Libraries

- `firebase` (v12) — Firestore database + analytics
- `next-auth` (v5 beta) — Authentication
- `date-fns` + `dayjs` — Date manipulation
- `recharts` — Charts (used in results feature)
- `lucide-react` — Icons
- `next-themes` — Dark mode
- `sonner` — Toast notifications
- `react-hook-form` + `zod` — Form handling + validation

## Patterns

### Adding a shadcn/ui component

```sh
npx shadcn@latest add button
```

### Adding a new feature

1. Create `features/<name>/components/*.tsx`
2. Compose in the appropriate `app/<role>/<name>/page.tsx`
3. Use mock data in `features/<name>/mock/` until API is available
4. Shell components handle layout chrome — page components are thin wrappers

### Data Pattern

Pages import mock data from `features/<name>/mock/` and pass it as props to feature components. When transitioning to Firestore, replace mock imports with Firestore reads (see dashboard and elementary-teacher patterns using `useStudentProfile` or direct Firestore queries).

### Responsive Breakpoints (in globals.css)

- `< 680px` — mobile (hide search, single column)
- `< 980px` — tablet (hide sidebar, single column content)
- `< 1320px` — small desktop (2-col grid instead of 3)
