# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Vietnamese-language LMS (Learning Management System) student portal built with **Next.js 16 App Router**, **shadcn/ui** (radix-nova style), and **Tailwind CSS v4**. Currently in active development with route placeholders and mock data.

## Dev Commands

```sh
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
npm run format    # Format all .ts/.tsx with Prettier
npm run typecheck # TypeScript check (noEmit)
```

## Architecture

### App Router Structure

- `app/layout.tsx` — Root layout with ThemeProvider (dark mode support), TooltipProvider, Vietnamese locale (`lang="vi"`)
- `app/(auth)/` — Auth routes (login, register, forgot-password)
- `app/(student)/` — Authenticated student portal with layout wrapping all student pages

### Student Portal Layout (`app/(student)/layout.tsx`)

Fixed two-column app shell (not using Next.js layout groups for sidebar persistence):

```text
AppSidebar (248px) | AppTopbar (sticky, 72px)
                    | main.content (CSS Grid: 1fr 404px rail)
```

### Feature-Based Architecture (`features/`)

Domain features live under `features/<domain>/` with internal `components/`, `hooks/`, and `mock/` subdirectories. Pages in `app/` compose feature components rather than owning them.

Current features: activities, assignments, calendars, courses, dashboard, documents, learning-results, notifications, projects, results, support, tasks, tuitions.

### Shared Components (`components/`)

- `app-sidebar.tsx`, `app-topbar.tsx` — Portal shell chrome
- `ui/` — shadcn/ui components (added via `npx shadcn@latest add <component>`)
- Custom utilities: `badge-status.tsx`, `icon-tint.tsx`, `quick-actions.tsx`, `stat-card.tsx`

### Styling System

- **Tailwind v4** with `@import "tailwindcss"` (no tailwind.config.js)
- **CSS custom properties** for semantic colors in `app/globals.css`
- Custom properties include: `--success`, `--warning`, `--danger` (in addition to standard shadcn vars), `--course-violet/green/blue/amber/teal/rust` for course category gradients
- **Custom layout classes** (not Tailwind utility classes): `.app`, `.sidebar`, `.nav-item`, `.content`, `.col-main`, `.rail`, `.course-*`, etc. — these are hand-written in globals.css
- dark mode via `.dark` class on `<html>`

### Path Aliases

Path aliases resolve from the project root via `tsconfig.json` paths:

```text
@/      → project root
@/components   → components/
@/components/ui → components/ui/
@/features     → features/
@/lib          → lib/
@/hooks        → hooks/
```

### Key Libraries

- `date-fns` + `dayjs` — date manipulation
- `recharts` — charts (used in results feature)
- `lucide-react` — icons (iconLibrary in shadcn config)
- `next-themes` — dark mode
- `sonner` — toast notifications

## Patterns

### Adding a shadcn/ui component

```sh
npx shadcn@latest add button
```

### Adding a new feature

1. Create `features/<name>/components/*.tsx`
2. Compose in the appropriate `app/(student)/<name>/page.tsx`
3. Use mock data in `features/<name>/mock/` until API is available

### Responsive Breakpoints (in globals.css)

- `< 680px` — mobile (hide search, single column)
- `< 980px` — tablet (hide sidebar, single column content)
- `< 1320px` — small desktop (2-col grid instead of 3)
