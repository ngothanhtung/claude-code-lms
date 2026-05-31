# LMS Portal — Full Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]) syntax for tracking.

**Goal:** Replace the current placeholder dashboard with a pixel-perfect clone of `docs/prototype/index.html`, using Next.js + shadcn/ui + existing components (IconTint, StatCard, CourseCard, BadgeStatus).

**Architecture:** All sections built as reusable components. Dashboard page composes them. Right rail is a single `dashboard-rail.tsx` component. Mock data hardcoded in dashboard page to match prototype exactly.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, shadcn/ui, existing `IconTint`, `BadgeStatus`, `Progress`, `Avatar`, `Button`.

---

## File Map

| File                                   | Action                                                |
| -------------------------------------- | ----------------------------------------------------- |
| `components/app-sidebar.tsx`           | Modify — add 8 more nav items from prototype          |
| `components/greeting-card.tsx`         | Create — gradient greeting card                       |
| `components/announcement-banner.tsx`   | Create — dismissible amber banner                     |
| `components/stat-card-dashboard.tsx`   | Create — dashboard-specific stat (GPA, credits, etc.) |
| `components/todo-item.tsx`             | Create — single task row                              |
| `components/schedule-slot.tsx`         | Create — timeline slot row                            |
| `components/course-card-dashboard.tsx` | Create — 6-variant course card with footer stats      |
| `components/donut-chart.tsx`           | Create — SVG donut for grade distribution             |
| `components/quick-actions.tsx`         | Create — 8-item quick actions grid                    |
| `components/notification-item.tsx`     | Create — single notification row                      |
| `components/activity-item.tsx`         | Create — single activity row                          |
| `components/dashboard-rail.tsx`        | Create — right rail wrapper (4 sections)              |
| `app/(portal)/dashboard/page.tsx`      | Replace — full dashboard                              |
| `app/globals.css`                      | Append — responsive dashboard styles                  |

---

## Task 1: Expand AppSidebar Navigation

**Files:** Modify: `components/app-sidebar.tsx`

- [ ] **Step 1: Add prototype nav items**

Replace the `mainNavItems` array with (keep Dashboard, Khóa học, Lịch học, Bài tập, add new items):

```tsx
const mainNavItems = [
    { title: "Trang chủ", icon: HomeIcon, href: "/dashboard" },
    { title: "Khóa học của tôi", icon: GraduationCapIcon, href: "/courses" },
    { title: "Lịch học", icon: CalendarIcon, href: "/calendar" },
    {
        title: "Bài tập",
        icon: BookOpenIcon,
        sub: [
            { title: "Bài tập cá nhân", href: "/assignments/personal" },
            { title: "Bài tập nhóm", href: "/assignments/group" },
            { title: "Đồ án cuối kỳ", href: "/final-project" },
        ],
    },
    { title: "Kết quả học tập", icon: BarChartIcon, href: "/results" },
    { title: "Điểm danh", icon: UserCheckIcon, href: "/attendance" },
    { title: "Lịch thi", icon: CalendarClockIcon, href: "/exams" },
    {
        title: "Tài liệu",
        icon: FolderOpenIcon,
        sub: [
            { title: "Tài liệu tham khảo", href: "/documents" },
            { title: "Tài liệu luyện thi", href: "/exam-materials" },
        ],
    },
    { title: "Thông báo", icon: BellIcon, href: "/notifications", badge: "6" },
    { title: "Học phí", icon: CircleDollarSignIcon, href: "/tuition" },
    { title: "Đăng ký môn học", icon: ClipboardCheckIcon, href: "/registration" },
    { title: "Hỗ trợ", icon: LifeBuoyIcon, href: "/support" },
    { title: "Cài đặt", icon: SettingsIcon, href: "/settings" },
]

const otherNavItems = [] // empty, all items above are main
```

Add new imports for the extra icons:

```tsx
import {
    HomeIcon,
    BarChart3Icon,
    UserCheckIcon,
    CalendarClockIcon,
    FolderOpenIcon,
    CircleDollarSignIcon,
    ClipboardCheckIcon,
    LifeBuoyIcon,
} from "lucide-react"
```

- [ ] **Step 2: Handle nav badge**

In the SidebarMenuButton rendering, add badge support after the nav item:

```tsx
{item.badge && (
    <span className="ml-auto min-w-[20px] h-5 px-1.5 grid place-items-center bg-[oklch(0.55_0.22_27)] text-white text-[11px] font-bold rounded-full">
        {item.badge}
    </span>
)}
```

- [ ] **Step 3: Commit**

```bash
git add components/app-sidebar.tsx
git commit -m "feat(sidebar): add all prototype nav items with badges

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Create Greeting Card

**Files:** Create: `components/greeting-card.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { CalendarCheck2Icon } from "lucide-react"

interface GreetingCardProps {
    userName: string
    semester: string
}

function formatDate() {
    const d = new Date()
    const thu = ["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"]
    const p = (n: number) => String(n).padStart(2, "0")
    return `${thu[d.getDay()]}, ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function GreetingCard({ userName, semester }: GreetingCardProps) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-[var(--radius)] border border-[hsl(243_50%_91%)] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjE0MDAiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxNDAwIiBmaWxsPSIjZmZmIi8+PHJhZGlhbEdyYWRpZW50IGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwMCwwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iaHNsKDI0MyA3NSUgOTYpIi8+PHN0b3Agb2Zmc2V0PSI1NSUiIHN0b3AtY29sb3I9InRyYW5zcGFyZW50Ii8+PC9yYWRpYWxHcmFkaWVudD48L3N2Zz4=')] bg-[length:100%_100%] bg-no-repeat px-6 py-5 overflow-hidden">
            <div>
                <h1 className="m-0 text-[25px] font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                    Xin chào, {userName}!
                </h1>
                <p className="mt-[5px] text-[14px] text-muted-foreground">{semester}</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-sm)] text-primary">
                <CalendarCheck2Icon className="h-[18px] w-[18px]" />
                <div>
                    <div className="text-[11.5px] font-medium text-muted-foreground">Hôm nay</div>
                    <div className="text-[14px] font-bold text-foreground whitespace-nowrap">{formatDate()}</div>
                </div>
            </div>
        </div>
    )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/greeting-card.tsx
git commit -m "feat(dashboard): add GreetingCard component

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Create Announcement Banner

**Files:** Create: `components/announcement-banner.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client"

import { useState } from "react"
import { MegaphoneIcon, XIcon } from "lucide-react"

interface AnnouncementBannerProps {
    title: string
    message: string
    href?: string
}

export function AnnouncementBanner({ title, message, href }: AnnouncementBannerProps) {
    const [visible, setVisible] = useState(true)

    if (!visible) return null

    return (
        <div className="flex items-start gap-3.5 rounded-[var(--radius)] border border-[hsl(45_90%_80%)] bg-[linear-gradient(100deg,hsl(48_96%_94%),hsl(45_96%_90%))] px-4 py-4">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[hsl(38_92%_50%)] text-white">
                <MegaphoneIcon className="h-[18px] w-[18px]" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="m-0 mb-0.5 text-[14.5px] font-bold text-[hsl(32_70%_28%)]">{title}</h3>
                <p className="m-0 text-[13px] text-[hsl(32_45%_35%)]">
                    {href ? (
                        <>
                            {message.split("tại đây")[0]}
                            <a href={href} className="font-semibold text-primary">tại đây</a>
                            {message.split("tại đây")[1]}
                        </>
                    ) : message}
                </p>
            </div>
            <button
                onClick={() => setVisible(false)}
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] border-0 bg-transparent text-[hsl(32_40%_45%)] transition-colors hover:bg-[hsl(45_70%_84%)]"
            >
                <XIcon className="h-[18px] w-[18px]" />
            </button>
        </div>
    )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/announcement-banner.tsx
git commit -m "feat(dashboard): add AnnouncementBanner component

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Create Dashboard Stat Cards (4 stats matching prototype)

**Files:** Create: `components/stat-card-dashboard.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { cn } from "@/lib/utils"
import { IconTint } from "@/components/icon-tint"
import { TrendingUpIcon, DatabaseIcon, LayersIcon, ClipboardListIcon } from "lucide-react"

interface StatCardDashboardProps {
    variant: "gpa" | "credits" | "semester" | "todos"
    className?: string
}

export function StatCardDashboard({ variant, className }: StatCardDashboardProps) {
    const configs = {
        gpa: {
            icon: TrendingUpIcon,
            iconTint: "indigo" as const,
            label: "GPA hiện tại",
            value: "3.45",
            sub: null,
            spark: true,
        },
        credits: {
            icon: DatabaseIcon,
            iconTint: "green" as const,
            label: "Tín chỉ tích lũy",
            value: "96",
            sub: { prefix: "/ 140", detail: "Hoàn thành 68.6%", progress: 68.6 },
            spark: false,
        },
        semester: {
            icon: LayersIcon,
            iconTint: "blue" as const,
            label: "Tín chỉ học kỳ này",
            value: "18",
            sub: { prefix: null, detail: "6 môn học", progress: null },
            spark: false,
        },
        todos: {
            icon: ClipboardListIcon,
            iconTint: "amber" as const,
            label: "Việc cần làm",
            value: "4",
            sub: { prefix: null, detail: "Bài tập sắp đến hạn", progress: null },
            spark: false,
        },
    }

    const c = configs[variant]

    return (
        <div className={cn(
            "flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-card p-[18px] shadow-[var(--shadow-card)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]",
            className
        )}>
            <div className="flex items-start justify-between">
                <IconTint variant={c.iconTint} size="lg">
                    <c.icon className="h-5 w-5" />
                </IconTint>
                {c.spark && variant === "gpa" && (
                    <svg className="h-[34px] w-[64px]" viewBox="0 0 64 34" fill="none">
                        <polyline
                            points="0,28 12,22 22,25 34,14 44,17 56,6 64,9"
                            stroke="oklch(0.41 0.17 277)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>
            <div className={cn("text-[13px] font-medium", "text-muted-foreground")}>
                {c.label}
            </div>
            <div className="text-[30px] font-extrabold tracking-tight leading-[1.05]" style={{ letterSpacing: "-0.02em" }}>
                {c.value}
                {c.sub?.prefix && <span className="text-[18px] text-muted-foreground font-semibold"> {c.sub.prefix}</span>}
            </div>
            {c.sub?.detail && (
                variant === "credits" ? (
                    <>
                        <div className="mt-[10px] text-[12.5px] text-muted-foreground mb-[5px]">{c.sub.detail}</div>
                        <div className="h-[7px] rounded-full bg-[oklch(0.965_0_0)] overflow-hidden mt-[4px]">
                            <div className="h-full rounded-full bg-[linear-gradient(90deg,hsl(142_71%_50%),hsl(142_71%_42%))]" style={{ width: `${c.sub.progress}%` }} />
                        </div>
                    </>
                ) : (
                    <div className={cn("text-[12.5px] mt-[10px]", variant === "todos" ? "text-[oklch(0.55_0.22_27)] font-semibold" : "text-muted-foreground")}>
                        {c.sub.detail}
                    </div>
                )
            )}
        </div>
    )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/stat-card-dashboard.tsx
git commit -m "feat(dashboard): add StatCardDashboard (4 prototype variants)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Create TodoItem Component

**Files:** Create: `components/todo-item.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { FileQuestionIcon, TerminalIcon, HelpCircleIcon, BookOpenIcon, CalendarClockIcon, CircleDollarSignIcon, FolderGit2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BadgeStatus } from "@/components/badge-status"

type BadgeVariant = "destructive" | "warning" | "info" | "success"

interface TodoItemProps {
    icon: React.ReactNode
    iconTint: "red" | "amber" | "blue" | "indigo" | "green"
    title: string
    subtitle: string
    badge: { label: string; variant: BadgeVariant }
    dueTime: string
    action: string
    actionVariant?: "primary" | "default"
}

const tintToIconClass: Record<TodoItemProps["iconTint"], string> = {
    red: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
    amber: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
    blue: "bg-[oklch(0.96_0.04_250)] text-[oklch(0.60_0.18_250)]",
    indigo: "bg-[oklch(0.96_0.04_277)] text-[oklch(0.41_0.17_277)]",
    green: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
}

const badgeVariantMap: Record<BadgeVariant, "destructive" | "warning" | "info" | "success"> = {
    destructive: "destructive",
    warning: "warning",
    info: "info",
    success: "success",
}

export function TodoItem({ icon, iconTint, title, subtitle, badge, dueTime, action, actionVariant = "default" }: TodoItemProps) {
    return (
        <div className="flex items-center gap-3.5 py-[13px] border-t border-border first:border-t-0 first:pt-0.5">
            <div className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] ${tintToIconClass[iconTint]}`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold">{title}</div>
                <div className="text-[12.5px] text-muted-foreground">{subtitle}</div>
            </div>
            <div className="text-right leading-[1.3]">
                <BadgeStatus variant={badgeVariantMap[badge.variant]}>{badge.label}</BadgeStatus>
                <div className="text-[12px] text-muted-foreground mt-[3px]">{dueTime}</div>
            </div>
            <Button variant={actionVariant === "primary" ? "default" : "outline"} size="sm" className="shrink-0 whitespace-nowrap text-[12.5px] font-semibold h-7 px-3.5">
                {action}
            </Button>
        </div>
    )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/todo-item.tsx
git commit -m "feat(dashboard): add TodoItem component

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Create ScheduleSlot Component

**Files:** Create: `components/schedule-slot.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { MapPinIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScheduleSlotProps {
    time: string
    status: "live" | "upcoming" | "default"
    title: string
    room: string
    tag?: string
    tagColor?: string
    action?: { label: string; variant: "primary" | "outline" | "default" }
}

export function ScheduleSlot({ time, status, title, room, tag, tagColor, action }: ScheduleSlotProps) {
    return (
        <div className={`flex gap-3 py-3 ${status === "upcoming" ? "opacity-[0.78]" : ""}`}>
            <div className="w-[88px] shrink-0 text-[12.5px] font-semibold text-muted-foreground pt-0.5 whitespace-nowrap">
                {time}
            </div>
            <div className={`w-[3px] shrink-0 rounded-full ${status === "live" ? "bg-[oklch(0.63_0.19_152)]" : "bg-border"}`} />
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold leading-[1.3]">{title}</div>
                        <div className="flex items-center gap-1 text-[12.5px] text-muted-foreground mt-1">
                            <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                            {room}
                        </div>
                    </div>
                    {tag && (
                        <span className="shrink-0 text-[12px] font-semibold whitespace-nowrap" style={{ color: tagColor }}>
                            {tag}
                        </span>
                    )}
                    {action && (
                        <Button
                            variant={action.variant === "primary" ? "default" : action.variant === "outline" ? "outline" : "ghost"}
                            size="sm"
                            className={`shrink-0 text-[12.5px] font-semibold h-7 px-3.5 ${action.variant === "outline" ? "border-[hsl(243_75%_85%)] text-[oklch(0.41_0.17_277)] bg-[oklch(0.41_0.17_277/0.06)] hover:bg-[oklch(0.41_0.17_277/0.12)]" : ""}`}
                        >
                            {action.label}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/schedule-slot.tsx
git commit -m "feat(dashboard): add ScheduleSlot component

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Create CourseCardDashboard (6-variant with footer)

**Files:** Create: `components/course-card-dashboard.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { CodeXmlIcon, DatabaseIcon, NetworkIcon, CoffeeIcon, BookOpenIcon, TerminalIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Category = "violet" | "green" | "blue" | "amber" | "teal" | "rust"

interface CourseCardDashboardProps {
    title: string
    category: Category
    instructor: string
    progress: number
    assignments: number
    grade: string
    className?: string
}

const configs: Record<Category, { gradient: string; icon: React.ReactNode }> = {
    violet: { gradient: "from-[oklch(0.52_0.22_280)] to-[oklch(0.45_0.22_280)]", icon: <CodeXmlIcon className="h-[18px] w-[18px]" /> },
    green: { gradient: "from-[oklch(0.63_0.19_152)] to-[oklch(0.55_0.19_152)]", icon: <DatabaseIcon className="h-[18px] w-[18px]" /> },
    blue: { gradient: "from-[oklch(0.52_0.17_258)] to-[oklch(0.45_0.17_258)]", icon: <NetworkIcon className="h-[18px] w-[18px]" /> },
    amber: { gradient: "from-[oklch(0.72_0.17_70)] to-[oklch(0.65_0.17_70)]", icon: <CoffeeIcon className="h-[18px] w-[18px]" /> },
    teal: { gradient: "from-[oklch(0.52_0.14_175)] to-[oklch(0.45_0.14_175)]", icon: <BookOpenIcon className="h-[18px] w-[18px]" /> },
    rust: { gradient: "from-[oklch(0.50_0.14_30)] to-[oklch(0.43_0.14_30)]", icon: <TerminalIcon className="h-[18px] w-[18px]" /> },
}

export function CourseCardDashboard({ title, category, instructor, progress, assignments, grade, className }: CourseCardDashboardProps) {
    const c = configs[category]
    return (
        <div className={cn(
            "flex flex-col overflow-hidden rounded-[14px] border border-border bg-card transition-all duration-150 hover:-translate-y-[3px] hover:shadow-[var(--shadow-pop)]",
            className
        )}>
            <div className={cn("relative flex min-h-[116px] flex-col justify-end p-[14px_14px_16px]", `bg-gradient-to-br ${c.gradient}`)}>
                <div className="absolute right-3 top-[13px] opacity-[0.9]">{c.icon}</div>
                <div className="pr-6 text-[14px] font-bold leading-tight text-white">{title}</div>
                <div className="text-[11.5px] opacity-90 mt-[3px]">GV: {instructor}</div>
                <div className="mt-auto pt-2">
                    <div className="flex items-center justify-between text-[12px] font-semibold mb-[5px]">
                        <span>Tiến độ</span><span>{progress}%</span>
                    </div>
                    <div className="h-[6px] rounded-full bg-white/[0.3] overflow-hidden">
                        <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="flex-1 px-[14px] py-[11px]">
                    <div className="text-[11.5px] text-muted-foreground flex items-center gap-[5px]">
                        <svg className="h-[14px] w-[14px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
                        Bài tập
                    </div>
                    <div className="text-[16px] font-extrabold mt-[2px]">{assignments}</div>
                </div>
                <div className="flex-1 border-l border-border px-[14px] py-[11px]">
                    <div className="text-[11.5px] text-muted-foreground flex items-center gap-[5px]">
                        <svg className="h-[14px] w-[14px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        Điểm
                    </div>
                    <div className="text-[16px] font-extrabold mt-[2px]">{grade}</div>
                </div>
            </div>
        </div>
    )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/course-card-dashboard.tsx
git commit -m "feat(dashboard): add CourseCardDashboard with 6 variants and footer stats

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Create DonutChart, QuickActions, NotificationItem, ActivityItem

**Files:** Create: `components/donut-chart.tsx`, `components/quick-actions.tsx`, `components/notification-item.tsx`, `components/activity-item.tsx`

- [ ] **Step 1: DonutChart**

```tsx
interface DonutChartProps {
    segments: { value: number; color: string }[]
    total: number
    centerLabel: string
    centerSub: string
}

function calcDashOffset(index: number, segments: { value: number }[], circumference: number): number {
    const total = segments.reduce((s, seg) => s + seg.value, 0)
    const r = circumference / (2 * Math.PI)
    let offset = 0
    for (let i = 0; i < index; i++) {
        offset += (segments[i].value / total) * circumference
    }
    return -offset
}

export function DonutChart({ segments, total, centerLabel, centerSub }: DonutChartProps) {
    const r = 56
    const cx = 66
    const cy = 66
    const circumference = 2 * Math.PI * r
    const radius = circumference * (r / (2 * Math.PI))

    return (
        <div className="flex items-center gap-4">
            <div className="relative h-[132px] w-[132px] shrink-0">
                <svg width="132" height="132" viewBox="0 0 132 132" className="-rotate-90">
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="oklch(0.965 0 0)" strokeWidth="16" />
                    {segments.map((seg, i) => {
                        const pct = seg.value / total
                        const dashLen = pct * circumference
                        const dashOffset = calcDashOffset(i, segments, circumference)
                        return (
                            <circle
                                key={i}
                                cx={cx} cy={cy} r={r}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth="16"
                                strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="butt"
                            />
                        )
                    })}
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                        <div className="text-[19px] font-extrabold leading-none">{centerLabel}</div>
                        <div className="text-[10.5px] text-muted-foreground mt-[2px]">{centerSub}</div>
                    </div>
                </div>
            </div>
            {/* Legend injected via props below */}
        </div>
    )
}
```

- [ ] **Step 2: QuickActions**

```tsx
import { VideoIcon, BarChart3Icon, UploadIcon, CalendarClockIcon, ClipboardCheckIcon, CircleDollarSignIcon, FolderOpenIcon, MailIcon } from "lucide-react"
import Link from "next/link"

interface QuickAction {
    icon: React.ReactNode
    tint: "blue" | "amber" | "indigo" | "red" | "green"
    label: string
    href?: string
}

const quickActions: QuickAction[] = [
    { icon: <VideoIcon className="h-5 w-5" />, tint: "blue", label: "Tham gia lớp học" },
    { icon: <BarChart3Icon className="h-5 w-5" />, tint: "amber", label: "Xem điểm", href: "/results" },
    { icon: <UploadIcon className="h-5 w-5" />, tint: "indigo", label: "Nộp bài tập" },
    { icon: <CalendarClockIcon className="h-5 w-5" />, tint: "red", label: "Lịch thi", href: "/exams" },
    { icon: <ClipboardCheckIcon className="h-5 w-5" />, tint: "indigo", label: "Đăng ký môn học" },
    { icon: <CircleDollarSignIcon className="h-5 w-5" />, tint: "green", label: "Học phí", href: "/tuition" },
    { icon: <FolderOpenIcon className="h-5 w-5" />, tint: "blue", label: "Tài liệu" },
    { icon: <MailIcon className="h-5 w-5" />, tint: "amber", label: "Liên hệ giảng viên" },
]

const tintClasses = {
    blue: "bg-[oklch(0.96_0.04_250)] text-[oklch(0.60_0.18_250)]",
    amber: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
    indigo: "bg-[oklch(0.96_0.04_277)] text-[oklch(0.41_0.17_277)]",
    red: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
    green: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
}

export function QuickActions() {
    return (
        <div className="grid grid-cols-4 gap-3">
            {quickActions.map((qa, i) => {
                const inner = (
                    <>
                        <div className={`flex h-[40px] w-[40px] items-center justify-center rounded-[12px] ${tintClasses[qa.tint]}`}>
                            {qa.icon}
                        </div>
                        <div className="text-[11.5px] font-medium text-[hsl(215_18%_38%)] text-center leading-tight">{qa.label}</div>
                    </>
                )
                return (
                    <div key={i}>
                        {qa.href ? (
                            <Link href={qa.href} className="flex flex-col items-center gap-2 rounded-[12px] border border-border bg-card p-[14px_6px] text-center transition-all duration-150 hover:-translate-y-0.5 hover:bg-muted hover:border-[hsl(243_60%_86%)]">
                                {inner}
                            </Link>
                        ) : (
                            <div className="flex flex-col items-center gap-2 rounded-[12px] border border-border bg-card p-[14px_6px] text-center transition-all duration-150 hover:-translate-y-0.5 hover:bg-muted hover:border-[hsl(243_60%_86%)]">
                                {inner}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
```

- [ ] **Step 3: NotificationItem**

```tsx
interface NotificationItemProps {
    icon: React.ReactNode
    iconTint: "indigo" | "green" | "amber" | "red"
    title: string
    subtitle: string
    time: string
    unread?: boolean
}

const tintClasses = {
    indigo: "bg-[oklch(0.96_0.04_277)] text-[oklch(0.41_0.17_277)]",
    green: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
    amber: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
    red: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
}

export function NotificationItem({ icon, iconTint, title, subtitle, time, unread }: NotificationItemProps) {
    return (
        <div className="relative flex gap-3 py-[13px] border-t border-border first:border-t-0 first:pt-0.5">
            <div className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] ${tintClasses[iconTint]}`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold leading-[1.3]">{title}</div>
                <div className="text-[12px] text-muted-foreground mt-[1px]">{subtitle}</div>
                <div className="text-[11.5px] text-muted-foreground mt-[3px]">{time}</div>
            </div>
            {unread && <span className="absolute top-[16px] right-[2px] h-[8px] w-[8px] rounded-full bg-[oklch(0.55_0.22_27)] shrink-0" />}
        </div>
    )
}
```

- [ ] **Step 4: ActivityItem**

```tsx
interface ActivityItemProps {
    icon: React.ReactNode
    iconTint: "red" | "green" | "blue" | "amber"
    title: string
    subtitle: string
    time: string
}

const tintClasses = {
    red: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
    green: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
    blue: "bg-[oklch(0.96_0.04_250)] text-[oklch(0.60_0.18_250)]",
    amber: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
}

export function ActivityItem({ icon, iconTint, title, subtitle, time }: ActivityItemProps) {
    return (
        <div className="flex gap-[11px] py-[13px] border-t border-border first:border-t-0 first:pt-0.5">
            <div className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] ${tintClasses[iconTint]}`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold">{title}</div>
                <div className="text-[12px] text-muted-foreground">{subtitle}</div>
                <div className="text-[11px] text-muted-foreground mt-[3px]">{time}</div>
            </div>
        </div>
    )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/donut-chart.tsx components/quick-actions.tsx components/notification-item.tsx components/activity-item.tsx
git commit -m "feat(dashboard): add DonutChart, QuickActions, NotificationItem, ActivityItem

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Create DashboardRail + Wire Full Dashboard Page

**Files:** Create: `components/dashboard-rail.tsx`, Replace: `app/(portal)/dashboard/page.tsx`

- [ ] **Step 1: Create DashboardRail**

```tsx
import {
    FileTextIcon, BarChart3Icon, MegaphoneIcon, CalendarHeartIcon,
    BookOpenIcon, UploadIcon, VideoIcon
} from "lucide-react"
import { NotificationItem } from "@/components/notification-item"
import { ActivityItem } from "@/components/activity-item"
import { QuickActions } from "@/components/quick-actions"
import { DonutChart } from "@/components/donut-chart"
import Link from "next/link"

const donutSegments = [
    { value: 12, color: "oklch(0.63 0.19 152)" },  // chart-1 green
    { value: 6, color: "oklch(0.60 0.18 250)" },   // chart-2 blue
    { value: 2, color: "oklch(0.70 0.18 75)" },     // chart-3 amber
    { value: 1, color: "oklch(0.55 0.22 27)" },     // chart-4 red
]

export function DashboardRail() {
    return (
        <aside className="flex flex-col gap-5">
            {/* Notifications */}
            <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[16.5px] font-bold tracking-tight m-0">Thông báo gần đây</h2>
                    <Link href="/notifications" className="text-[13px] font-semibold text-primary hover:underline">Xem tất cả</Link>
                </div>
                <NotificationItem icon={<FileTextIcon className="h-[14px] w-[14px]" />} iconTint="indigo" title="Giảng viên thông báo bài tập mới" subtitle="Lập trình Java - Bài tập số 4" time="10 phút trước" unread />
                <NotificationItem icon={<BarChart3Icon className="h-[14px] w-[14px]" />} iconTint="green" title="Điểm mới được công bố" subtitle="Cơ sở dữ liệu - Quiz 1" time="1 giờ trước" />
                <NotificationItem icon={<MegaphoneIcon className="h-[14px] w-[14px]" />} iconTint="amber" title="Thông báo từ Phòng Đào tạo" subtitle="Về việc đăng ký học phần học kỳ III" time="3 giờ trước" />
                <NotificationItem icon={<CalendarHeartIcon className="h-[14px] w-[14px]" />} iconTint="red" title="Sự kiện sắp diễn ra" subtitle="Ngày hội việc làm mùa Hè 2026" time="1 ngày trước" />
                <div className="text-center mt-[10px] pt-[14px] border-t border-border">
                    <Link href="/notifications" className="text-[13px] font-semibold text-primary hover:underline">Xem tất cả thông báo →</Link>
                </div>
            </div>

            {/* Results */}
            <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[16.5px] font-bold tracking-tight m-0">Kết quả học tập</h2>
                    <Link href="/results" className="text-[13px] font-semibold text-primary hover:underline">Xem chi tiết</Link>
                </div>
                <div className="flex items-center gap-4">
                    <DonutChart
                        segments={donutSegments}
                        total={21}
                        centerLabel="21"
                        centerSub="môn học"
                    />
                    <div className="flex flex-col gap-[9px] flex-1">
                        <div className="flex items-center gap-2 text-[12.5px]">
                            <span className="h-[9px] w-[9px] rounded-full shrink-0 bg-[oklch(0.63_0.19_152)]" />
                            <span className="flex-1 font-medium">Tốt (A, B)</span>
                            <span className="text-muted-foreground font-semibold text-[12px]">12 môn (57%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12.5px]">
                            <span className="h-[9px] w-[9px] rounded-full shrink-0 bg-[oklch(0.60_0.18_250)]" />
                            <span className="flex-1 font-medium">Khá (C)</span>
                            <span className="text-muted-foreground font-semibold text-[12px]">6 môn (29%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12.5px]">
                            <span className="h-[9px] w-[9px] rounded-full shrink-0 bg-[oklch(0.70_0.18_75)]" />
                            <span className="flex-1 font-medium">Trung bình (D)</span>
                            <span className="text-muted-foreground font-semibold text-[12px]">2 môn (10%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12.5px]">
                            <span className="h-[9px] w-[9px] rounded-full shrink-0 bg-[oklch(0.55_0.22_27)]" />
                            <span className="flex-1 font-medium">Yếu (F)</span>
                            <span className="text-muted-foreground font-semibold text-[12px]">1 môn (4%)</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 mt-4 pt-4 border-t border-border">
                    <div className="text-center">
                        <div className="text-[12px] text-muted-foreground">CPA hiện tại</div>
                        <div className="text-[22px] font-extrabold mt-[3px]" style={{ letterSpacing: "-0.01em" }}>3.38</div>
                    </div>
                    <div className="text-center border-l border-border">
                        <div className="text-[12px] text-muted-foreground">Xếp loại</div>
                        <div className="text-[22px] font-extrabold mt-[3px] text-primary" style={{ letterSpacing: "-0.01em" }}>Khá</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                <h2 className="text-[16.5px] font-bold tracking-tight mb-4">Thao tác nhanh</h2>
                <QuickActions />
            </div>

            {/* Activity */}
            <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                <h2 className="text-[16.5px] font-bold tracking-tight mb-0">Hoạt động gần đây</h2>
                <ActivityItem icon={<BookOpenIcon className="h-[14px] w-[14px]" />} iconTint="red" title="Bạn đã xem tài liệu" subtitle="Lecture 3 - OOP Principles.pdf" time="2 giờ trước" />
                <ActivityItem icon={<UploadIcon className="h-[14px] w-[14px]" />} iconTint="green" title="Bạn đã nộp bài tập" subtitle="BTL_OOP_Chuong2.zip" time="Hôm qua" />
                <ActivityItem icon={<VideoIcon className="h-[14px] w-[14px]" />} iconTint="blue" title="Bạn đã tham gia lớp học" subtitle="CSDL - Online Class" time="Hôm qua" />
                <ActivityItem icon={<BarChart3Icon className="h-[14px] w-[14px]" />} iconTint="amber" title="Bạn đã xem điểm" subtitle="Quiz 1 - Cơ sở dữ liệu" time="2 ngày trước" />
            </div>
        </aside>
    )
}
```

- [ ] **Step 2: Replace dashboard page**

Replace `app/(portal)/dashboard/page.tsx` with the full dashboard matching prototype:

```tsx
import {
    FileQuestionIcon, TerminalIcon, HelpCircleIcon, BookOpenIcon,
    CalendarClockIcon, CircleDollarSignIcon, FolderGit2Icon,
    MapPinIcon, ArrowRightIcon, VideoIcon
} from "lucide-react"
import { GreetingCard } from "@/components/greeting-card"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { StatCardDashboard } from "@/components/stat-card-dashboard"
import { TodoItem } from "@/components/todo-item"
import { ScheduleSlot } from "@/components/schedule-slot"
import { CourseCardDashboard } from "@/components/course-card-dashboard"
import { DashboardRail } from "@/components/dashboard-rail"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const mockCourses = [
    { title: "Lập trình hướng đối tượng", category: "violet" as const, instructor: "Nguyễn Minh Tuấn", progress: 66, assignments: 2, grade: "8.5" },
    { title: "Cơ sở dữ liệu", category: "green" as const, instructor: "Trần Thị Hương", progress: 48, assignments: 1, grade: "7.0" },
    { title: "Cấu trúc dữ liệu và giải thuật", category: "blue" as const, instructor: "Lê Văn Nam", progress: 72, assignments: 0, grade: "8.0" },
    { title: "Lập trình Java", category: "amber" as const, instructor: "Phạm Quốc Bảo", progress: 30, assignments: 3, grade: "6.5" },
    { title: "Tiếng Anh học thuật", category: "teal" as const, instructor: "Đỗ Thu Trang", progress: 60, assignments: 1, grade: "9.0" },
    { title: "Claude Code for BackEnd", category: "rust" as const, instructor: "Hoàng Anh Khoa", progress: 15, assignments: 1, grade: "—" },
]

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-5">
            <GreetingCard userName="Ngô Thanh Tùng" semester="Học kỳ II, năm học 2025 - 2026" />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCardDashboard variant="gpa" />
                <StatCardDashboard variant="credits" />
                <StatCardDashboard variant="semester" />
                <StatCardDashboard variant="todos" />
            </div>

            <AnnouncementBanner
                title="Thông báo quan trọng"
                message="Sinh viên khóa K21 đăng ký học phần học kỳ III từ ngày 20/05 – 30/05/2026. Xem chi tiết tại đây"
                href="#"
            />

            {/* Two-column: Todos + Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Todos */}
                <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[16.5px] font-bold tracking-tight m-0">Việc cần làm hôm nay</h2>
                        <a href="#" className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1">Xem tất cả <ArrowRightIcon className="h-3.5 w-3.5" /></a>
                    </div>
                    <TodoItem
                        icon={<FileQuestionIcon className="h-[18px] w-[18px]" />}
                        iconTint="red"
                        title="Nộp Assignment OOP – Bài tập lớn chương 3"
                        subtitle="Lập trình hướng đối tượng"
                        badge={{ label: "Hạn hôm nay", variant: "destructive" }}
                        dueTime="23:59"
                        action="Nộp bài"
                        actionVariant="primary"
                    />
                    <TodoItem
                        icon={<TerminalIcon className="h-[18px] w-[18px]" />}
                        iconTint="red"
                        title="Nộp Lab 1 – Build REST API với Claude Code"
                        subtitle="Claude Code for BackEnd"
                        badge={{ label: "Còn 4 giờ", variant: "warning" }}
                        dueTime="22:00"
                        action="Nộp bài"
                        actionVariant="primary"
                    />
                    <TodoItem
                        icon={<HelpCircleIcon className="h-[18px] w-[18px]" />}
                        iconTint="amber"
                        title="Quiz Java - Quiz 2"
                        subtitle="Lập trình Java"
                        badge={{ label: "Còn 2 giờ", variant: "warning" }}
                        dueTime="20:00"
                        action="Làm quiz"
                    />
                    <TodoItem
                        icon={<BookOpenIcon className="h-[18px] w-[18px]" />}
                        iconTint="blue"
                        title="Đọc tài liệu trước buổi học"
                        subtitle="Cơ sở dữ liệu"
                        badge={{ label: "Ngày mai", variant: "info" }}
                        dueTime="21/05"
                        action="Xem ngay"
                    />
                    <TodoItem
                        icon={<CalendarClockIcon className="h-[18px] w-[18px]" />}
                        iconTint="indigo"
                        title="Lịch thi giữa kỳ CTDL&GT"
                        subtitle="Cấu trúc dữ liệu và giải thuật"
                        badge={{ label: "Ngày mai", variant: "info" }}
                        dueTime="21/05"
                        action="Xem lịch thi"
                    />
                    <TodoItem
                        icon={<CircleDollarSignIcon className="h-[18px] w-[18px]" />}
                        iconTint="green"
                        title="Đóng học phí học kỳ II"
                        subtitle="Phòng Tài chính"
                        badge={{ label: "Còn 5 ngày", variant: "success" }}
                        dueTime="25/05"
                        action="Thanh toán"
                    />
                    <TodoItem
                        icon={<FolderGit2Icon className="h-[18px] w-[18px]" />}
                        iconTint="indigo"
                        title="Đọc yêu cầu đồ án cuối kỳ"
                        subtitle="Lập trình hướng đối tượng"
                        badge={{ label: "Còn 20 ngày", variant: "success" }}
                        dueTime="09/06"
                        action="Xem ngay"
                    />
                </div>

                {/* Schedule */}
                <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                    <div className="flex items-center justify-between mb-3.5">
                        <h2 className="text-[16.5px] font-bold tracking-tight m-0">Lịch học hôm nay</h2>
                        <div className="flex items-center gap-2.5">
                            <span className="text-[13px] text-muted-foreground font-medium">Thứ 6, 29/05/2026</span>
                            <div className="flex gap-1">
                                <button className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-border bg-card text-muted-foreground hover:bg-muted">
                                    <ChevronLeftIcon className="h-3.5 w-3.5" />
                                </button>
                                <button className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-border bg-card text-muted-foreground hover:bg-muted">
                                    <ChevronRightIcon className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <ScheduleSlot time="08:00 - 09:50" status="live" title="Cơ sở dữ liệu" room="A1-201" tag="Đang diễn ra" tagColor="oklch(0.63 0.19 152)" />
                    <ScheduleSlot time="10:00 - 11:50" status="default" title="Lập trình hướng đối tượng" room="B1-302" action={{ label: "Tham gia online", variant: "outline" }} />
                    <ScheduleSlot time="13:00 - 14:50" status="default" title="Tiếng Anh học thuật" room="C2-405" action={{ label: "Xem chi tiết", variant: "default" }} />

                    <div className="flex items-center gap-2.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground pt-3 mt-2 border-t border-border">
                        NGÀY MAI · THỨ 7, 30/05/2026
                    </div>

                    <ScheduleSlot time="07:30 - 09:20" status="upcoming" title="Cấu trúc dữ liệu và giải thuật" room="A2-105" tag="Sắp tới" tagColor="oklch(0.55 0.01 265)" />
                    <ScheduleSlot time="10:00 - 11:50" status="upcoming" title="Lập trình Java" room="B1-204" tag="Sắp tới" tagColor="oklch(0.55 0.01 265)" />
                    <ScheduleSlot time="13:00 - 14:50" status="upcoming" title="Claude Code for BackEnd" room="Lab CNTT-301" tag="Sắp tới" tagColor="oklch(0.55 0.01 265)" />

                    <div className="text-center mt-[6px] pt-[14px] border-t border-border">
                        <a href="/calendar" className="text-[13px] font-semibold text-primary hover:underline flex items-center justify-center gap-1">Xem toàn bộ lịch học <ArrowRightIcon className="h-3.5 w-3.5" /></a>
                    </div>
                </div>
            </div>

            {/* Courses */}
            <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[16.5px] font-bold tracking-tight m-0">Các môn học đang học</h2>
                    <a href="/courses" className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1">Xem tất cả <ArrowRightIcon className="h-3.5 w-3.5" /></a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockCourses.map((c) => (
                        <CourseCardDashboard key={c.title} {...c} />
                    ))}
                </div>
            </div>

            {/* Right Rail */}
            <DashboardRail />
        </div>
    )
}
```

**Important**: Wrap the entire content in a two-column grid. The courses + right rail go side-by-side on large screens. Wrap the course section + rail in:

```tsx
<div className="grid grid-cols-1 xl:grid-cols-[1fr_404px] gap-5 items-start">
    <div className="flex flex-col gap-5">
        {/* Everything above the right rail goes here as-is */}
    </div>
    <DashboardRail />
</div>
```

Actually, since DashboardRail is a sibling to the course grid, restructure the return to:

```tsx
return (
    <div className="flex flex-col gap-5">
        <GreetingCard ... />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            ...
        </div>
        <AnnouncementBanner ... />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            ...
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_404px] gap-5 items-start">
            {/* Course section + right rail */}
            <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                ...courses...
            </div>
            <DashboardRail />
        </div>
    </div>
)
```

- [ ] **Step 3: Commit**

```bash
git add components/dashboard-rail.tsx app/\(portal\)/dashboard/page.tsx
git commit -m "feat(dashboard): build full dashboard matching prototype

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Add Responsive Dashboard Styles

**Files:** Modify: `app/globals.css` (append at end)

- [ ] **Step 1: Append responsive styles**

```css
/* Dashboard responsive */
@media (max-width: 1320px) {
  .grid.\[xl\:grid-cols-\[1fr_404px\]\] {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 980px) {
  .grid.\[lg\:grid-cols-2\] {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 680px) {
  .grid.\[sm\:grid-cols-2\] {
    grid-template-columns: 1fr 1fr !important;
  }
  .grid.\[1fr_1fr\] {
    grid-template-columns: 1fr 1fr !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style(dashboard): add responsive grid overrides

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

- [ ] Greeting card matches prototype: gradient background, user name, semester, date box ✅
- [ ] 4 stat cards: GPA with sparkline, Credits with progress bar, Semester, Todos ✅
- [ ] Announcement banner: amber gradient, dismissible, megaphone icon ✅
- [ ] 7 todo items with correct badges, icons, actions ✅
- [ ] Schedule with today (3 slots, 1 live) + tomorrow header + 3 upcoming ✅
- [ ] 6 course cards with gradient headers, progress bars, footer stats ✅
- [ ] Right rail: Notifications (4), Donut chart with legend + CPA, QuickActions (8), Activity (4) ✅
- [ ] All icons from lucide-react ✅
- [ ] All colors from oklch theme tokens ✅
- [ ] Sidebar expanded to full prototype nav ✅
- [ ] No placeholder patterns ✅

---

## Verification

1. `npm run dev` — http://localhost:3000/dashboard renders full dashboard
2. Compare visually with `docs/prototype/index.html` — should match exactly
3. Responsive: resize browser — layout adapts at 1320px, 980px, 680px
4. Announcement banner dismiss button works
5. Sidebar shows all 14 nav items with badge
6. Build: `npm run build` — no errors
