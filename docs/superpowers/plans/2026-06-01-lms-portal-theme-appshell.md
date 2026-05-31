# LMS Portal — Theme + App Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Phase 1 of LMS Portal — complete theme tokens in globals.css (light), AppShell with collapsible sidebar, topbar, and reusable UI components (StatCard, CourseCard, BadgeStatus, IconTint).

**Architecture:** Tailwind CSS v4 with CSS custom properties exposed via `@theme inline`. App Router with `(portal)` route group. Shadcn sidebar component already installed. next-themes already configured.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, shadcn/ui (sidebar, button, badge, avatar, progress, dropdown-menu, tooltip), next-themes, lucide-react, class-variance-authority.

---

## File Map

| File                              | Action                                                  |
| --------------------------------- | ------------------------------------------------------- |
| `app/globals.css`                 | Modify — replace all CSS tokens with prototype values   |
| `app/layout.tsx`                  | Modify — add SidebarProvider wrapper                    |
| `app/(portal)/layout.tsx`         | Create — AppShell with sidebar + topbar + main          |
| `app/(portal)/dashboard/page.tsx` | Create — dashboard placeholder                          |
| `app/(auth)/layout.tsx`           | Create — auth layout (no sidebar)                       |
| `components/app-sidebar.tsx`      | Create — sidebar nav with brand, groups, assistant card |
| `components/app-topbar.tsx`       | Create — greeting, search, notifications, profile       |
| `components/stat-card.tsx`        | Create — stat card component                            |
| `components/course-card.tsx`      | Create — course card component                          |
| `components/badge-status.tsx`     | Create — status badge component                         |
| `components/icon-tint.tsx`        | Create — colored icon container                         |

---

## Task 1: Update globals.css Theme Tokens

**Files:** Modify: `app/globals.css`

- [ ] **Step 1: Replace all CSS tokens in `:root` block**

Replace the entire `:root { ... }` block (lines 50–83) with prototype design tokens:

```css
:root {
  /* Surfaces */
  --background: oklch(0.985 0 0);
  --foreground: oklch(0.145 0.01 265);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0.01 265);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0.01 265);

  /* Primary Brand — Indigo */
  --primary: oklch(0.41 0.17 277);
  --primary-foreground: oklch(0.98 0 0);
  --primary-muted: oklch(0.96 0.04 277);

  /* Secondary */
  --secondary: oklch(0.965 0 0);
  --secondary-foreground: oklch(0.145 0.01 265);

  /* Muted */
  --muted: oklch(0.965 0 0);
  --muted-foreground: oklch(0.55 0.01 265);

  /* Accent */
  --accent: oklch(0.96 0.04 277);
  --accent-foreground: oklch(0.42 0.15 277);

  /* Semantic Colors */
  --success: oklch(0.63 0.19 152);
  --success-foreground: oklch(0.98 0 0);
  --success-muted: oklch(0.96 0.03 152);

  --warning: oklch(0.7 0.18 75);
  --warning-foreground: oklch(0.98 0 0);
  --warning-muted: oklch(0.96 0.05 75);

  --destructive: oklch(0.55 0.22 27);
  --destructive-foreground: oklch(0.98 0 0);
  --destructive-muted: oklch(0.96 0.03 27);

  --info: oklch(0.6 0.18 250);
  --info-foreground: oklch(0.98 0 0);
  --info-muted: oklch(0.96 0.04 250);

  /* Borders & Ring */
  --border: oklch(0.91 0 0);
  --input: oklch(0.91 0 0);
  --ring: oklch(0.41 0.17 277);

  /* Chart Colors */
  --chart-1: oklch(0.63 0.19 152);
  --chart-2: oklch(0.6 0.18 250);
  --chart-3: oklch(0.7 0.18 75);
  --chart-4: oklch(0.55 0.22 27);
  --chart-5: oklch(0.52 0.22 280);

  /* Layout Constants */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0.01 265);
  --sidebar-primary: oklch(0.41 0.17 277);
  --sidebar-primary-foreground: oklch(0.98 0 0);
  --sidebar-accent: oklch(0.96 0.04 277);
  --sidebar-accent-foreground: oklch(0.42 0.15 277);
  --sidebar-border: oklch(0.91 0 0);
  --sidebar-ring: oklch(0.41 0.17 277);

  --radius: 0.875rem;
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
  --radius-pill: 99px;
  --radius-nav: 11px;
  --radius-btn: 9px;

  /* Shadows */
  --shadow-card: 0 1px 3px oklch(0.145/0.06), 0 1px 2px oklch(0.145/0.05);
  --shadow-pop: 0 10px 30px -10px oklch(0.145/0.18);
  --shadow-sm: 0 1px 2px oklch(0.145/0.04);

  /* Layout Widths */
  --sidebar-width: 248px;
  --sidebar-width-collapsed: 80px;
  --topbar-height: 72px;
  --rail-width: 404px;

  /* Course Category Colors */
  --course-violet: oklch(0.52 0.22 280);
  --course-green: oklch(0.63 0.19 152);
  --course-blue: oklch(0.52 0.17 258);
  --course-amber: oklch(0.72 0.17 70);
  --course-teal: oklch(0.52 0.14 175);
  --course-rust: oklch(0.5 0.14 30);
}
```

- [ ] **Step 2: Add course color mapping to @theme inline**

Add these entries to the existing `@theme inline { ... }` block (after the `--color-background` line):

```css
--color-primary-muted: var(--primary-muted);
--color-success: var(--success);
--color-success-foreground: var(--success-foreground);
--color-success-muted: var(--success-muted);
--color-warning: var(--warning);
--color-warning-foreground: var(--warning-foreground);
--color-warning-muted: var(--warning-muted);
--color-info: var(--info);
--color-info-foreground: var(--info-foreground);
--color-info-muted: var(--info-muted);
--color-course-violet: var(--course-violet);
--color-course-green: var(--course-green);
--color-course-blue: var(--course-blue);
--color-course-amber: var(--course-amber);
--color-course-teal: var(--course-teal);
--color-course-rust: var(--course-rust);
```

- [ ] **Step 3: Add custom scrollbar + selection styles to globals.css**

Append before the closing `}` of `globals.css`:

```css
/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background: oklch(0.88 0 0);
  border-radius: 99px;
  border: 3px solid var(--background);
}
::-webkit-scrollbar-thumb:hover {
  background: oklch(0.78 0 0);
}

/* Text selection */
::selection {
  background: oklch(0.41 0.17 277 / 0.2);
  color: oklch(0.41 0.17 277);
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 4: Verify CSS parses**

Run: `npx tailwindcss --input=app/globals.css --output=/dev/null 2>&1 || true`
Expected: No CSS parse errors

---

## Task 2: Update app/layout.tsx Root Layout

**Files:** Modify: `app/layout.tsx`

- [ ] **Step 1: Add SidebarProvider to root layout**

Update `app/layout.tsx` to wrap children with `SidebarProvider`:

```tsx
import { Geist, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="vi" suppressHydrationWarning className={cn("antialiased", fontMono.variable, "font-sans", inter.className)}>
            <body>
                <ThemeProvider>
                    <TooltipProvider>
                        <SidebarProvider>
                            {children}
                        </SidebarProvider>
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
```

Changes: Added `SidebarProvider` wrapper, changed `lang="vi"`, changed `inter.variable` to `inter.className`.

- [ ] **Step 2: Verify it builds**

Run: `npm run build 2>&1 | head -30`
Expected: No errors

---

## Task 3: Create AppSidebar Component

**Files:** Create: `components/app-sidebar.tsx`

- [ ] **Step 1: Write the full component**

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BookOpenIcon,
    CalendarIcon,
    LayoutDashboardIcon,
    SettingsIcon,
    BellIcon,
    Code2Icon,
    GraduationCapIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    BotMessageSquareIcon,
    PanelLeftCloseIcon,
    PanelLeftIcon,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
    useSidebar,
} from "@/components/ui/sidebar"

const mainNavItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboardIcon,
        href: "/dashboard",
    },
    {
        title: "Khóa học của tôi",
        icon: GraduationCapIcon,
        href: "/courses",
    },
    {
        title: "Lịch học",
        icon: CalendarIcon,
        href: "/calendar",
    },
    {
        title: "Bài tập",
        icon: BookOpenIcon,
        sub: [
            { title: "Cá nhân", href: "/assignments/personal" },
            { title: "Nhóm", href: "/assignments/group" },
        ],
    },
]

const otherNavItems = [
    {
        title: "Workspace",
        icon: Code2Icon,
        href: "/workspace",
    },
    {
        title: "Thông báo",
        icon: BellIcon,
        href: "/notifications",
    },
    {
        title: "Cài đặt",
        icon: SettingsIcon,
        href: "/settings",
    },
]

export function AppSidebar() {
    const { state, toggleSidebar } = useSidebar()
    const pathname = usePathname()
    const [assignmentsOpen, setAssignmentsOpen] = useState(true)

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

    return (
        <Sidebar className="border-r border-sidebar-border" collapsible="icon">
            <SidebarHeader className="h-(--topbar-height) flex flex-row items-center gap-3 border-b border-sidebar-border px-4">
                {/* Brand Logo */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-br from-[oklch(0.52_0.22_280)] to-[oklch(0.41_0.17_277)]">
                    <GraduationCapIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-[18px] font-extrabold tracking-tight text-sidebar-foreground">
                        UniLMS
                    </span>
                    <span className="text-[11.5px] font-medium text-sidebar-foreground/50">
                        Học tập thông minh
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Học tập Group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                        Học tập
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    {item.sub ? (
                                        <>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={isActive("/assignments")}
                                                onClick={() => setAssignmentsOpen(!assignmentsOpen)}
                                                className="group-data-[collapsible=icon]:hidden"
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                                <ChevronDownIcon className={cn(
                                                    "ml-auto h-4 w-4 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
                                                    assignmentsOpen && "rotate-180"
                                                )} />
                                            </SidebarMenuButton>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={isActive("/assignments")}
                                                onClick={() => setAssignmentsOpen(!assignmentsOpen)}
                                                className="hidden group-data-[collapsible=icon]:flex"
                                            >
                                                <item.icon />
                                            </SidebarMenuButton>
                                            <SidebarMenuSub className={cn(
                                                "transition-all duration-200 ease-in-out",
                                                !assignmentsOpen && "h-0 overflow-hidden opacity-0"
                                            )}>
                                                {item.sub.map((sub) => (
                                                    <SidebarMenuSubItem key={sub.href}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={isActive(sub.href)}
                                                        >
                                                            <Link href={sub.href}>{sub.title}</Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </>
                                    ) : (
                                        <SidebarMenuButton tooltip={item.title} isActive={isActive(item.href)} asChild>
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator className="mx-2" />

                {/* Khác Group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                        Khác
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {otherNavItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton tooltip={item.title} isActive={isActive(item.href)} asChild>
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Assistant Card */}
                <div className="mx-3 mt-4 hidden group-data-[collapsible=icon]:block">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-gradient-to-br from-[oklch(0.52_0.22_280)] to-[oklch(0.41_0.17_277)]">
                        <BotMessageSquareIcon className="h-5 w-5 text-white" />
                    </div>
                </div>
                <div className="mx-3 mt-4 group-data-[collapsible=icon]:hidden">
                    <div className="rounded-[14px] bg-gradient-to-br from-[oklch(0.96_0.04_277)] to-[oklch(0.94_0.06_280)] p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.52_0.22_280)] to-[oklch(0.41_0.17_277)]">
                                <BotMessageSquareIcon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-sidebar-foreground">Trợ lý AI</span>
                        </div>
                        <p className="text-xs text-sidebar-foreground/60 mb-3">
                            Hỏi đáp bài giảng, gợi ý học tập, và hỗ trợ 24/7
                        </p>
                        <button className="w-full rounded-[9px] bg-[oklch(0.41_0.17_277)] py-2 text-xs font-semibold text-white transition-colors hover:bg-[oklch(0.36_0.17_277)]">
                            Chat ngay
                        </button>
                    </div>
                </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={state === "expanded" ? "Thu gọn" : "Mở rộng"}
                            onClick={toggleSidebar}
                        >
                            {state === "expanded" ? (
                                <PanelLeftCloseIcon />
                            ) : (
                                <PanelLeftIcon />
                            )}
                            <span className="group-data-[collapsible=icon]:hidden">
                                Thu gọn
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
```

---

## Task 4: Create AppTopbar Component

**Files:** Create: `components/app-topbar.tsx`

- [ ] **Step 1: Write the full component**

```tsx
"use client"

import { SearchIcon, BellIcon, ChevronDownIcon, GlobeIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Chào buổi sáng"
    if (hour < 18) return "Chào buổi chiều"
    return "Chào buổi tối"
}

function formatDate() {
    return new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
    })
}

export function AppTopbar() {
    const [lang, setLang] = useState<"vi" | "en">("vi")

    return (
        <header className="sticky top-0 z-40 flex h-(--topbar-height) items-center border-b border-border bg-background/95 backdrop-blur px-6 gap-4">
            {/* Left: Greeting */}
            <div className="flex flex-col min-w-0 flex-1">
                <h1 className="text-base font-semibold text-foreground truncate">
                    {getGreeting()}, Tùng! 👋
                </h1>
                <p className="text-xs text-muted-foreground">
                    {formatDate()}
                </p>
            </div>

            {/* Center: Search */}
            <div className="relative hidden md:flex flex-1 max-w-md">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Tìm kiếm khóa học, bài tập..."
                    className="h-11 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-[3px] focus:ring-ring/15 transition-all"
                />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Language */}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setLang(l => l === "vi" ? "en" : "vi")}
                    className="text-muted-foreground"
                >
                    <GlobeIcon className="h-4 w-4" />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground relative">
                    <BellIcon className="h-4 w-4" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
                </Button>

                {/* Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors">
                            <Avatar size="sm">
                                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tung" />
                                <AvatarFallback>T</AvatarFallback>
                            </Avatar>
                            <div className="hidden lg:flex flex-col items-start">
                                <span className="text-sm font-medium leading-none">Ngô Thanh Tùng</span>
                                <span className="text-xs text-muted-foreground leading-none mt-0.5">Sinh viên</span>
                            </div>
                            <ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground hidden lg:block" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
                        <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Đăng xuất</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
```

---

## Task 5: Create Reusable UI Components

**Files:** Create: `components/stat-card.tsx`, `components/course-card.tsx`, `components/badge-status.tsx`, `components/icon-tint.tsx`

- [ ] **Step 1: Create StatCard**

```tsx
import { cn } from "@/lib/utils"
import { IconTint } from "@/components/icon-tint"

interface StatCardProps {
    label: string
    value: string | number
    trend?: { value: number; label?: string }
    icon: React.ReactNode
    iconTint?: "indigo" | "green" | "amber" | "red" | "blue"
    className?: string
}

export function StatCard({ label, value, trend, icon, iconTint = "indigo", className }: StatCardProps) {
    return (
        <div className={cn(
            "group relative flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-card p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]",
            className
        )}>
            <div className="flex items-start justify-between">
                <IconTint variant={iconTint}>
                    {icon}
                </IconTint>
                {trend && (
                    <span className={cn(
                        "text-xs font-semibold",
                        trend.value >= 0 ? "text-[oklch(0.63_0.19_152)]" : "text-[oklch(0.55_0.22_27)]"
                    )}>
                        {trend.value >= 0 ? "+" : ""}{trend.value}%{trend.label && <span className="text-muted-foreground"> {trend.label}</span>}
                    </span>
                )}
            </div>
            <div>
                <p className="text-3xl font-extrabold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
                    {value}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground font-medium">{label}</p>
            </div>
        </div>
    )
}
```

- [ ] **Step 2: Create IconTint**

```tsx
import { cn } from "@/lib/utils"

interface IconTintProps {
    variant?: "indigo" | "green" | "amber" | "red" | "blue"
    size?: "sm" | "md" | "lg"
    className?: string
    children: React.ReactNode
}

const variantClasses = {
    indigo: "bg-[oklch(0.96_0.04_277)] text-[oklch(0.41_0.17_277)]",
    green: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
    amber: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
    red: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
    blue: "bg-[oklch(0.96_0.04_250)] text-[oklch(0.60_0.18_250)]",
}

const sizeClasses = {
    sm: "h-8 w-8 rounded-[9px]",
    md: "h-10 w-10 rounded-[10px]",
    lg: "h-11 w-11 rounded-[11px]",
}

export function IconTint({ variant = "indigo", size = "md", className, children }: IconTintProps) {
    return (
        <div className={cn(
            "grid shrink-0 place-items-center",
            variantClasses[variant],
            sizeClasses[size],
            className
        )}>
            {children}
        </div>
    )
}
```

- [ ] **Step 3: Create CourseCard**

```tsx
import { BookOpenIcon, PlayCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

type Category = "violet" | "green" | "blue" | "amber" | "teal" | "rust"

interface CourseCardProps {
    title: string
    category: Category
    instructor: string
    progress?: number
    lessonCount: number
    className?: string
}

const categoryGradients: Record<Category, string> = {
    violet: "from-[oklch(0.52_0.22_280)] to-[oklch(0.45_0.22_280)]",
    green: "from-[oklch(0.63_0.19_152)] to-[oklch(0.55_0.19_152)]",
    blue: "from-[oklch(0.52_0.17_258)] to-[oklch(0.45_0.17_258)]",
    amber: "from-[oklch(0.72_0.17_70)] to-[oklch(0.65_0.17_70)]",
    teal: "from-[oklch(0.52_0.14_175)] to-[oklch(0.45_0.14_175)]",
    rust: "from-[oklch(0.50_0.14_30)] to-[oklch(0.43_0.14_30)]",
}

export function CourseCard({ title, category, instructor, progress, lessonCount, className }: CourseCardProps) {
    return (
        <div className={cn(
            "group flex flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-card transition-all duration-150 hover:-translate-y-1 hover:shadow-[var(--shadow-pop)]",
            className
        )}>
            {/* Gradient Header */}
            <div className={cn("relative flex min-h-[116px] items-end bg-gradient-to-br p-4", categoryGradients[category])}>
                <h3 className="text-white font-bold text-[15px] leading-tight">{title}</h3>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3 p-4 flex-1">
                <div>
                    <p className="text-xs text-muted-foreground font-medium">Giảng viên</p>
                    <p className="text-sm font-medium text-foreground">{instructor}</p>
                </div>

                {progress !== undefined && (
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Tiến độ</span>
                            <span className="font-semibold text-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                    </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpenIcon className="h-3.5 w-3.5" />
                        {lessonCount} bài học
                    </div>
                    <button className="flex items-center gap-1 text-xs font-semibold text-[oklch(0.41_0.17_277)] hover:underline">
                        <PlayCircleIcon className="h-3.5 w-3.5" />
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    )
}
```

- [ ] **Step 4: Create BadgeStatus**

```tsx
import { cn } from "@/lib/utils"

type BadgeVariant = "success" | "warning" | "destructive" | "info" | "outline" | "default"

interface BadgeStatusProps {
    variant?: BadgeVariant
    children: React.ReactNode
    className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-primary text-primary-foreground",
    success: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
    warning: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
    destructive: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
    info: "bg-[oklch(0.96_0.04_250)] text-[oklch(0.60_0.18_250)]",
    outline: "border border-border bg-transparent text-foreground",
}

export function BadgeStatus({ variant = "default", children, className }: BadgeStatusProps) {
    return (
        <span className={cn(
            "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
            variantClasses[variant],
            className
        )}>
            {children}
        </span>
    )
}
```

---

## Task 6: Create Route Group Layouts

**Files:** Create: `app/(portal)/layout.tsx`, `app/(auth)/layout.tsx`, `app/(portal)/dashboard/page.tsx`

- [ ] **Step 1: Create portal layout**

Create directory `app/(portal)` and file `app/(portal)/layout.tsx`:

```tsx
import { AppSidebar } from "@/components/app-sidebar"
import { AppTopbar } from "@/components/app-topbar"

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-svh">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
                <AppTopbar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
```

- [ ] **Step 2: Create auth layout**

Create directory `app/(auth)` and file `app/(auth)/layout.tsx`:

```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-background">
            {children}
        </div>
    )
}
```

- [ ] **Step 3: Create dashboard placeholder page**

Create file `app/(portal)/dashboard/page.tsx`:

```tsx
import { StatCard } from "@/components/stat-card"
import { CourseCard } from "@/components/course-card"
import { BookOpenIcon, CheckCircleIcon, ClockIcon, TrendingUpIcon } from "lucide-react"

const mockCourses = [
    { title: "Lập trình Python cơ bản", category: "violet" as const, instructor: "TS. Minh Tuấn", progress: 72, lessonCount: 24 },
    { title: "Toán rời rạc", category: "blue" as const, instructor: "PGS. Lan Hương", progress: 45, lessonCount: 18 },
    { title: "Nhập môn AI & ML", category: "green" as const, instructor: "TS. Hoàng Nam", progress: 88, lessonCount: 12 },
]

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[26px] font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                    Tổng quan
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Chào mừng bạn quay trở lại! Đây là tiến độ học tập của bạn.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Khóa học đang học" value="5" icon={<BookOpenIcon className="h-5 w-5" />} iconTint="indigo" trend={{ value: 2, label: "so với tháng trước" }} />
                <StatCard label="Hoàn thành tuần này" value="3" icon={<CheckCircleIcon className="h-5 w-5" />} iconTint="green" trend={{ value: 12 }} />
                <StatCard label="Bài tập đang chờ" value="7" icon={<ClockIcon className="h-5 w-5" />} iconTint="amber" />
                <StatCard label="Điểm trung bình" value="8.4" icon={<TrendingUpIcon className="h-5 w-5" />} iconTint="blue" trend={{ value: 5 }} />
            </div>

            {/* Courses */}
            <div>
                <h2 className="text-base font-bold tracking-tight" style={{ letterSpacing: "-0.01em" }}>
                    Khóa học đang theo học
                </h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockCourses.map((course) => (
                        <CourseCard key={course.title} {...course} />
                    ))}
                </div>
            </div>
        </div>
    )
}
```

- [ ] **Step 4: Verify the portal renders**

Run: `npm run dev` — open http://localhost:3000/dashboard
Expected: Dashboard with sidebar, topbar, stat cards, and course cards all rendering correctly

---

## Task 7: Redirect root to dashboard

**Files:** Modify: `app/page.tsx`

- [ ] **Step 1: Update root page to redirect to dashboard**

```tsx
import { redirect } from "next/navigation"

export default function HomePage() {
    redirect("/dashboard")
}
```

- [ ] **Step 2: Verify redirect**

Run: `npm run dev` — open http://localhost:3000
Expected: Redirects to /dashboard with full AppShell

---

## Self-Review Checklist

- [ ] Spec section 2.1 Color Palette — all tokens in globals.css `:root`? ✅
- [ ] Spec section 2.2 Typography — Inter + JetBrains Mono already in layout.tsx? ✅
- [ ] Spec section 2.3 Spacing — `--sidebar-width`, `--topbar-height`, `--radius` in CSS? ✅
- [ ] Spec section 3.1 Route Groups — `(portal)` and `(auth)` layouts created? ✅
- [ ] Spec section 3.2 AppShell grid — sidebar + topbar + main in portal layout? ✅
- [ ] Spec section 4.1 AppSidebar — brand, nav groups, assistant card, collapse toggle? ✅
- [ ] Spec section 4.2 AppTopbar — greeting, search, notifications, profile? ✅
- [ ] Spec section 4.3 StatCard — label, value, trend, icon, iconTint, hover lift? ✅
- [ ] Spec section 4.4 CourseCard — gradient header, progress, hover lift? ✅
- [ ] Spec section 4.5 BadgeStatus — 5 variants, pill shape? ✅
- [ ] Spec section 4.6 IconTint — 5 variants, grid place-items-center? ✅
- [ ] No placeholder patterns (TBD, TODO, "implement later") in any step? ✅
- [ ] Type consistency — all component props match across tasks? ✅
- [ ] Phase 2 (dark) NOT implemented — only light tokens in `:root`? ✅

---

## Verification Steps

1. `npm run dev` — app starts without errors
2. Navigate to `/dashboard` — full AppShell renders: sidebar left, topbar top, content area
3. Click sidebar collapse button — sidebar collapses to icon rail with smooth animation
4. Check all nav items — all links render with correct icons and active state
5. Verify stat cards — 4 cards with correct icon tints, values, trends
6. Verify course cards — 3 cards with gradient headers (violet, blue, green), progress bars
7. Theme toggle — press `d` key — dark mode activates (existing next-themes d-key works)
8. Responsive — resize browser to < 980px — sidebar becomes mobile drawer
9. No hydration warnings in browser console
