# LMS Portal — Theme + App Shell Design Spec

## 1. Context

Build Phase 1 of the LMS Portal frontend: a full theme system (light, with dark reserved for Phase 2) and the application shell layout with sidebar navigation. The goal is a production-ready CSS foundation and AppShell that mirrors the prototype's visual language while using Next.js App Router + shadcn/ui.

## 2. Design Language

### 2.1 Color Palette

**Primary Brand**
| Token | oklch | Usage |
|---|---|---|
| `--primary` | `oklch(0.41 0.17 277)]` (≈`#4f46e5` indigo) | CTAs, active nav, focus rings |
| `--primary-foreground` | `oklch(0.98 0 0)` | Text on primary |
| `--primary-muted` | `oklch(0.96 0.04 277)` | Active nav background wash |

**Semantic Colors** (each with base / foreground / muted triplet)
| Token | oklch | Usage |
|---|---|---|
| `--success` | `oklch(0.63 0.19 152)` | Passed, green states |
| `--success-foreground` | `oklch(0.98 0 0)` | |
| `--success-muted` | `oklch(0.96 0.03 152)` | |
| `--warning` | `oklch(0.70 0.18 75)` | Amber-500, pending |
| `--warning-foreground` | `oklch(0.98 0 0)` | |
| `--warning-muted` | `oklch(0.96 0.05 75)` | |
| `--destructive` | `oklch(0.55 0.22 27)` | Red-600, overdue |
| `--destructive-foreground` | `oklch(0.98 0 0)` | |
| `--destructive-muted` | `oklch(0.96 0.03 27)` | |
| `--info` | `oklch(0.60 0.18 250)` | Blue-500 |
| `--info-foreground` | `oklch(0.98 0 0)` | |
| `--info-muted` | `oklch(0.96 0.04 250)` | |

**Course Category Palette**
| Token | oklch | Name |
|---|---|---|
| `--course-violet` | `oklch(0.52 0.22 280)` | Violet |
| `--course-green` | `oklch(0.63 0.19 152)` | Green |
| `--course-blue` | `oklch(0.52 0.17 258)` | Blue |
| `--course-amber` | `oklch(0.72 0.17 70)` | Amber |
| `--course-teal` | `oklch(0.52 0.14 175)` | Teal |
| `--course-rust` | `oklch(0.50 0.14 30)` | Rust |

**Surfaces**
| Token | oklch |
|---|---|
| `--background` | `oklch(0.985 0 0)` |
| `--foreground` | `oklch(0.145 0.01 265)` |
| `--card` | `oklch(1 0 0)` |
| `--muted` | `oklch(0.965 0 0)` |
| `--muted-foreground` | `oklch(0.55 0.01 265)` |
| `--border` | `oklch(0.91 0 0)` |
| `--input` | `oklch(0.91 0 0)` |
| `--accent` | `oklch(0.96 0.04 277)` |
| `--accent-foreground` | `oklch(0.42 0.15 277)` |

**Chart Colors**
| Token | oklch |
|---|---|
| `--chart-1` | `oklch(0.63 0.19 152)` (success) |
| `--chart-2` | `oklch(0.60 0.18 250)` (info) |
| `--chart-3` | `oklch(0.70 0.18 75)` (warning) |
| `--chart-4` | `oklch(0.55 0.22 27)` (destructive) |

### 2.2 Typography

- **Font**: Inter (Google Fonts) — weights 400, 500, 600, 700, 800
- **Base**: 14px / line-height 1.5
- **Features**: `font-feature-settings: "cv11", "ss01"` (stylistic sets)

**Type Scale**
| Element | Size | Weight | Letter-spacing |
|---|---|---|---|
| Page H1 | 26px | 800 | `-0.02em` |
| Section H2 | 16.5px | 700 | `-0.01em` |
| Card title | 15.5px | 700 | — |
| Body | 14px | 400 | — |
| Nav item | 14px | 500 | — |
| Small/meta | 13px | 500 | — |
| Label/caption | 11.5px | 600 | — |
| Badge | 11px | 700 | — |

**Monospace** (workspace pages): `JetBrains Mono`

### 2.3 Spacing & Layout Constants

| Token                   | Value             | Usage                      |
| ----------------------- | ----------------- | -------------------------- |
| `--sidebar-w`           | `248px`           | Sidebar expanded width     |
| `--sidebar-collapsed-w` | `80px`            | Sidebar collapsed width    |
| `--topbar-h`            | `72px`            | Topbar height              |
| `--rail-w`              | `404px`           | Right rail width (future)  |
| `--radius`              | `0.875rem` (14px) | Default card corner radius |
| `--radius-nav`          | `11px`            | Nav item radius            |
| `--radius-btn`          | `9px`             | Button radius              |
| `--radius-pill`         | `99px`            | Badge/pill radius          |

**Shadows**
| Token | Value |
|---|---|
| `--shadow-card` | `0 1px 3px oklch(0.145/0.06), 0 1px 2px oklch(0.145/0.05)` |
| `--shadow-pop` | `0 10px 30px -10px oklch(0.145/0.18)` |

### 2.4 Motion

- Sidebar collapse: `.26s cubic-bezier(.4,0,.2,1)`
- Card hover lift: `transform: translateY(-2px)`, `.12-.15s ease`
- Dropdown: `.16s ease`, opacity + scale transform
- Nav hover: `.15s ease`

## 3. App Shell Architecture

### 3.1 Route Groups

```
app/
├── (auth)/                 # No sidebar — login, register
│   └── layout.tsx
└── (portal)/               # LMS portal with sidebar
    ├── layout.tsx          # AppShell
    ├── dashboard/page.tsx
    ├── courses/page.tsx
    ├── courses/[id]/page.tsx
    ├── assignments/
    │   ├── personal/page.tsx
    │   └── group/page.tsx
    ├── calendar/page.tsx
    ├── workspace/page.tsx
    ├── notifications/page.tsx
    └── settings/page.tsx
```

- `(auth)` layout: clean centered layout (login page scaffold)
- `(portal)` layout: AppShell with sidebar + topbar + main content

### 3.2 AppShell Layout (portal/layout.tsx)

Grid-based shell:

```css
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  grid-template-rows: var(--topbar-h) 1fr;
  min-height: 100vh;
}
.app-shell.collapsed {
  grid-template-columns: var(--sidebar-collapsed-w) 1fr;
}

/* Desktop: sidebar spans full height, topbar spans full width */
.app-sidebar {
  grid-row: 1 / -1;
}
.app-topbar {
  grid-column: 2;
  grid-row: 1;
}
.app-content {
  grid-column: 2;
  grid-row: 2;
  overflow-y: auto;
}
```

### 3.3 Responsive

| Breakpoint       | Behavior                                           |
| ---------------- | -------------------------------------------------- |
| `> 1320px`       | Full layout, sidebar expanded                      |
| `980px – 1320px` | Sidebar auto-collapsed (icon rail), rail hidden    |
| `< 980px`        | Sidebar hidden, hamburger menu opens mobile drawer |

## 4. Components

### 4.1 AppSidebar (`components/app-sidebar.tsx`)

- `"use client"` — needs interactive state
- Uses `components/ui/sidebar` (shadcn)
- Props: `user` (name, avatar, role), `collapsed` state
- Sections:
  1. **Brand** — logo icon (gradient indigo box, 42×42) + "UniLMS" name + "Học tập thông minh" sub
  2. **Nav Group: Học tập** — Dashboard, My Courses, Calendar, Assignments (expandable → Personal / Group)
  3. **Nav Group: Khác** — Workspace, Notifications, Settings
  4. **Assistant Card** — gradient background card with AI avatar, "Trợ lý AI" label, "Chat ngay" button
  5. **Collapse Toggle** — chevron icon at bottom

### 4.2 AppTopbar (`components/app-topbar.tsx`)

- `"use client"`
- Left: Greeting ("Chào buổi sáng, [Name]! 👋" + today's date)
- Center: Search input (magnifier icon, 44px height, rounded-12)
- Right: Language toggle, Notification bell (with badge), Profile avatar + dropdown

### 4.3 StatCard (`components/stat-card.tsx`)

- Props: `label`, `value`, `trend` (±%), `icon`, `iconTint` (red/blue/amber/green/indigo)
- 44×44 icon container (rounded-12)
- Value: 30px / 800 weight / -0.02em
- Hover: lift + shadow-pop
- Tint background: `bg-{tint}-muted`, icon: `text-{tint}`

### 4.4 CourseCard (`components/course-card.tsx`)

- Props: `title`, `category` (violet/green/blue/amber/teal), `instructor`, `progress` (%), `lessonCount`, `imageUrl`
- Top: gradient header (116px min-height) with category color
- Body: title, instructor, progress bar
- Footer: lesson count + action link
- Hover: lift + shadow-pop

### 4.5 BadgeStatus (`components/badge-status.tsx`)

- Variants: `success` (green), `warning` (amber), `destructive` (red), `info` (blue), `outline`
- Pill shape (rounded-99), 11px / 700 weight

### 4.6 IconTint wrapper

- Reusable colored-icon container
- Variants map to semantic colors: `red`, `amber`, `blue`, `indigo`, `green`
- Pattern: `div.ico-tint-{variant}` → `w-10 h-10 rounded-10 bg-{variant}-muted text-{variant} grid place-items-center`

## 5. Implementation Notes

- All theme tokens defined in `app/globals.css` via CSS custom properties, exposed to Tailwind via `@theme inline`
- Use `cn()` from `lib/utils.ts` for conditional class merging
- Use shadcn `button`, `input`, `badge`, `avatar`, `dropdown-menu`, `tooltip`, `scroll-area`
- Shadcn sidebar: run `npx shadcn@latest add sidebar` to scaffold
- `next-themes` already configured in `components/theme-provider.tsx` with `attribute="class"`, `defaultTheme="system"`
- Dark theme (Phase 2): add `.dark` overrides in `globals.css`, primarily surface/background changes
- Font loading: `Inter` + `JetBrains Mono` already in `app/layout.tsx`

## 6. Verification

1. Run `npm run dev` — app loads without hydration errors
2. Theme toggles (light ↔ dark) work via existing `d` key shortcut
3. Sidebar expands/collapses correctly with smooth animation
4. All pages render in the portal route group with consistent AppShell
5. Course cards, stat cards render with correct colors from theme tokens
6. Responsive: sidebar auto-collapses at 1320px, becomes drawer at 980px
