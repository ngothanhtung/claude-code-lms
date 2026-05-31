# Dashboard Pixel-Perfect Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement. Inline execution — targeted fixes only.

**Goal:** Make dashboard match `docs/prototype/index.html` at 100%. 8 targeted fixes.

---

## Task 1: Fix GreetingCard gradient

**Files:** Modify: `components/greeting-card.tsx`

- [ ] **Step 1: Update background gradient**

Replace `backgroundImage` style with:

```tsx
style={{
    backgroundImage: "radial-gradient(ellipse 80% 100% at 105% -10%, oklch(0.96 0.04 277 / 0.08) 0%, transparent 55%), linear-gradient(180deg, #fff, #fff)",
}}
```

---

## Task 2: Fix StatCardDashboard credits — custom progress bar

**Files:** Modify: `components/stat-card-dashboard.tsx`

- [ ] **Step 1: Replace shadcn Progress with custom bar**

In the `credits` variant's `{"progress" in c ?` block, replace the `Progress` usage with:

```tsx
{/* Custom progress bar matching prototype */}
<div className="mt-[10px] mb-[5px] text-[12.5px] text-muted-foreground">{c.detail}</div>
<div className="h-[7px] rounded-full bg-[oklch(0.965_0_0)] overflow-hidden mt-[4px]">
    <div
        className="h-full rounded-full"
        style={{
            width: `${c.progress}%`,
            background: "linear-gradient(90deg, hsl(142 71% 50%), hsl(142 71% 42%))",
        }}
    />
</div>
```

Also add `import React from "react"` if not present.

---

## Task 3: Fix TodoItem — border-top dividers

**Files:** Modify: `components/todo-item.tsx`

- [ ] **Step 1: Update divider styling**

Replace the outer `div` className from:

```tsx
className="flex items-center gap-3.5 py-[13px] border-t border-border first:border-t-0 first:pt-0.5"
```

With:

```tsx
className="flex items-center gap-3.5 py-[13px] border-t border-border/70 first:border-t-0 first:pt-0"
```

Also make the icon container slightly smaller to match `.task .task-ico` (36px not 38px):

```tsx
className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[11px] ${tintToIconClass[iconTint]}`}
```

And adjust the outer padding to match prototype `.task`:

```tsx
className="flex items-center gap-3 py-3.5 border-t border-border/70 first:border-t-0 first:pt-0"
```

---

## Task 4: Fix ScheduleSlot — left-border timeline

**Files:** Modify: `components/schedule-slot.tsx`

- [ ] **Step 1: Replace border-top with left-border timeline**

Replace the entire component with:

```tsx
import { MapPinIcon } from "lucide-react"
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
        <div className="flex gap-3 py-2.5">
            {/* Time column */}
            <div className="w-[88px] shrink-0 text-[12.5px] font-semibold text-muted-foreground pt-[2px] whitespace-nowrap">
                {time}
            </div>
            {/* Timeline bar */}
            <div className={`w-[3px] shrink-0 rounded-full mt-1 ${status === "live" ? "bg-[oklch(0.63_0.19_152)]" : "bg-border"}`} style={{ minHeight: "40px" }} />
            {/* Content */}
            <div className="flex-1 min-w-0 pt-[2px]">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold leading-[1.3]">{title}</div>
                        <div className="flex items-center gap-1 text-[12px] text-muted-foreground mt-[2px]">
                            <MapPinIcon className="h-3 w-3 shrink-0" />
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
                            variant={action.variant === "primary" ? "default" : "outline"}
                            size="sm"
                            className={`shrink-0 text-[12.5px] font-semibold h-7 px-3.5 ${
                                action.variant === "outline"
                                    ? "border-[hsl(243_75%_85%)] text-[oklch(0.41_0.17_277)] bg-[oklch(0.96_0.04_277/0.06)] hover:bg-[oklch(0.96_0.04_277/0.12)]"
                                    : ""
                            }`}
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

---

## Task 5: Fix CourseCardDashboard — remove shadow, fix footer

**Files:** Modify: `components/course-card-dashboard.tsx`

- [ ] **Step 1: Remove box-shadow from hover, fix footer**

Replace the outer div className:

```tsx
className={cn(
    "flex flex-col overflow-hidden rounded-[14px] border border-border bg-card transition-all duration-150 hover:-translate-y-[3px]",
    className
)}
```

Also update footer stats to match prototype exactly — each stat block should be:

```tsx
<div className="flex-1 px-3 py-2.5">
    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
        {/* inline SVG icons instead of lucide */}
    </div>
    <div className="text-[15px] font-extrabold mt-[2px]">{assignments}</div>
</div>
```

---

## Task 6: Fix QuickActions grid dimensions

**Files:** Modify: `components/quick-actions.tsx`

- [ ] **Step 1: Fix grid to match prototype dimensions**

Replace `grid-cols-4 gap-3` with fixed dimensions matching prototype (74px wide, 12px gap):

```tsx
<div className="flex flex-wrap gap-3">
```

And update each item to have fixed width:

```tsx
<div className="w-[74px] flex flex-col items-center gap-2 rounded-[12px] border border-border bg-card p-[14px_4px] text-center transition-all duration-150 hover:-translate-y-0.5 hover:bg-muted hover:border-[hsl(243_60%_86%)]">
```

And update icon container from `h-[40px] w-[40px]` to `h-[38px] w-[38px]`:

```tsx
<div className={`flex h-[38px] w-[38px] items-center justify-center rounded-[11px] ${tintClasses[qa.tint]}`}>
```

And reduce label text from `text-[11.5px]` to `text-[11px]`:

```tsx
<div className="text-[11px] font-medium text-[hsl(215_18%_38%)] text-center leading-tight">{qa.label}</div>
```

---

## Task 7: Fix ActivityItem sizing

**Files:** Modify: `components/activity-item.tsx`

- [ ] **Step 1: Reduce sizes to match prototype `.activity-rail`**

```tsx
// Icon container: 34px, rounded-[9px]
<div className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${tintClasses[iconTint]}`}>
    {icon}
</div>

// Gap: 10px (from 11px)
// Padding: py-[11px] (from 13px)
// Title: text-[12.5px] (from 13px)
<div className="text-[12.5px] font-semibold">{title}</div>
<div className="text-[12px] text-muted-foreground">{subtitle}</div>
<div className="text-[11px] text-muted-foreground mt-[2px]">{time}</div>
```

---

## Task 8: Fix AppTopbar — add hamburger, calendar, message icons

**Files:** Modify: `components/app-topbar.tsx`

- [ ] **Step 1: Add hamburger + calendar + message icons**

Import additional icons:

```tsx
import { MenuIcon, CalendarIcon, MessageSquareIcon } from "lucide-react"
```

Add hamburger button before search:

```tsx
{/* Hamburger */}
<Button variant="ghost" size="icon-sm" className="text-muted-foreground">
    <MenuIcon className="h-4 w-4" />
</Button>
```

Add calendar and message buttons after language toggle:

```tsx
{/* Calendar */}
<Button variant="ghost" size="icon-sm" className="text-muted-foreground">
    <CalendarIcon className="h-4 w-4" />
</Button>

{/* Messages */}
<Button variant="ghost" size="icon-sm" className="text-muted-foreground relative">
    <MessageSquareIcon className="h-4 w-4" />
</Button>
```

---

## Verification

1. `npm run build` — no errors
2. Open http://localhost:3000/dashboard — visually compare with `docs/prototype/index.html`
3. Check each section: greeting gradient, stat progress bar, todo dividers, schedule timeline, course cards, quick actions grid, activity sizing, topbar icons
