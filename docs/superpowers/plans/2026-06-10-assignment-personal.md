# Assignment Personal Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the assignment-personal page — a student's personal assignments hub with an overview stats section + a complete list of all individual assignments.

**Architecture:** Feature under `features/assignment-personal/` with mock data in `mock/` and UI components in `components/`. The page at `app/(student)/assignment-personal/page.tsx` composes these components into a full-width layout (`col-main col-span-full`), matching the pattern used by the courses page.

**Tech Stack:** Next.js 16 App Router, shadcn/ui (Card, Badge), lucide-react icons, Tailwind CSS v4

---

### File Structure

```
features/assignment-personal/
├── mock/
│   └── index.ts              # Mock data: Assignment type + sample data + computed stats
├── components/
│   ├── assignment-stats.tsx    # Stats row (4 stat cards: total, pending, submitted, overdue)
│   └── assignment-list.tsx     # Full list of assignments with status/actions
app/(student)/assignment-personal/
└── page.tsx                    # Composes stats + list (modify existing)
```

---

### Task 1: Mock Data

**Files:**
- Create: `features/assignment-personal/mock/index.ts`

- [ ] **Step 1: Create mock data file**

```typescript
export type AssignmentStatus = "pending" | "submitted" | "overdue" | "graded"

export interface PersonalAssignment {
  id: string
  title: string
  course: string
  courseCategory: "violet" | "green" | "blue" | "amber" | "teal" | "rust"
  description: string
  dueDate: string // e.g. "20/05/2026"
  dueTime: string // e.g. "23:59"
  status: AssignmentStatus
  grade?: string
  submittedAt?: string
}

export const personalAssignments: PersonalAssignment[] = [
  {
    id: "pa-1",
    title: "Bài tập lớn chương 3 – Quản lý sinh viên",
    course: "Lập trình hướng đối tượng",
    courseCategory: "violet",
    description: "Xây dựng chương trình quản lý sinh viên bằng Java, áp dụng các nguyên lý OOP.",
    dueDate: "10/06/2026",
    dueTime: "23:59",
    status: "overdue",
    grade: "—",
  },
  {
    id: "pa-2",
    title: "Lab 1 – Build REST API với Claude Code",
    course: "Claude Code for BackEnd",
    courseCategory: "rust",
    description: "Xây dựng REST API đơn giản sử dụng Claude Code và Express.",
    dueDate: "11/06/2026",
    dueTime: "22:00",
    status: "pending",
  },
  {
    id: "pa-3",
    title: "Quiz Java – Bài kiểm tra giữa kỳ",
    course: "Lập trình Java",
    courseCategory: "amber",
    description: "Bài kiểm tra trắc nghiệm online về Java Core.",
    dueDate: "12/06/2026",
    dueTime: "20:00",
    status: "submitted",
    submittedAt: "12/06/2026 19:30",
  },
  {
    id: "pa-4",
    title: "Bài tập Entity-Relationship Diagram",
    course: "Cơ sở dữ liệu",
    courseCategory: "green",
    description: "Vẽ ERD cho hệ thống quản lý thư viện.",
    dueDate: "11/06/2026",
    dueTime: "23:59",
    status: "graded",
    grade: "8.5",
  },
  {
    id: "pa-5",
    title: "Bài tập Stack & Queue",
    course: "Cấu trúc dữ liệu và giải thuật",
    courseCategory: "blue",
    description: "Cài đặt Stack và Queue bằng C++ và giải bài toán ứng dụng.",
    dueDate: "15/06/2026",
    dueTime: "23:59",
    status: "pending",
  },
  {
    id: "pa-6",
    title: "Lab 2 – Phân tích thuật toán sắp xếp",
    course: "Cấu trúc dữ liệu và giải thuật",
    courseCategory: "blue",
    description: "So sánh hiệu năng các thuật toán sắp xếp: Bubble, Quick, Merge.",
    dueDate: "18/06/2026",
    dueTime: "23:59",
    status: "submitted",
    submittedAt: "17/06/2026 15:45",
  },
  {
    id: "pa-7",
    title: "Bài tập Passive Voice & Conditional Sentences",
    course: "Tiếng Anh học thuật",
    courseCategory: "teal",
    description: "Hoàn thành bài tập ngữ pháp về câu bị động và câu điều kiện.",
    dueDate: "09/06/2026",
    dueTime: "23:59",
    status: "graded",
    grade: "9.0",
  },
  {
    id: "pa-8",
    title: "Bài tập SQL – Truy vấn nâng cao",
    course: "Cơ sở dữ liệu",
    courseCategory: "green",
    description: "Viết các truy vấn SQL với JOIN, GROUP BY, subquery.",
    dueDate: "20/06/2026",
    dueTime: "23:59",
    status: "pending",
  },
  {
    id: "pa-9",
    title: "Bài tập Generics & Collections",
    course: "Lập trình hướng đối tượng",
    courseCategory: "violet",
    description: "Sử dụng Generics và Collections Framework trong Java.",
    dueDate: "25/06/2026",
    dueTime: "23:59",
    status: "pending",
  },
]

/** Computed stats derived from personalAssignments */
export const assignmentStats = {
  total: personalAssignments.length,
  pending: personalAssignments.filter((a) => a.status === "pending").length,
  submitted: personalAssignments.filter((a) => a.status === "submitted" || a.status === "graded").length,
  overdue: personalAssignments.filter((a) => a.status === "overdue").length,
}
```

- [ ] **Step 2: Commit**

```bash
git add features/assignment-personal/mock/index.ts
git commit -m "feat(assignment-personal): add mock data with PersonalAssignment type"
```

---

### Task 2: Stats Component

**Files:**
- Create: `features/assignment-personal/components/assignment-stats.tsx`

- [ ] **Step 1: Create assignment-stats.tsx**

```typescript
import { Card } from "@/components/ui/card"
import { IconTint } from "@/components/icon-tint"
import {
  ClipboardListIcon,
  ClockIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
} from "lucide-react"
import { assignmentStats } from "@/features/assignment-personal/mock"

const statsConfig = [
  {
    icon: ClipboardListIcon,
    tint: "blue" as const,
    label: "Tổng bài tập",
    value: assignmentStats.total,
    detail: "Tất cả bài tập",
  },
  {
    icon: ClockIcon,
    tint: "amber" as const,
    label: "Chưa nộp",
    value: assignmentStats.pending,
    detail: "Đang chờ xử lý",
  },
  {
    icon: CheckCircle2Icon,
    tint: "green" as const,
    label: "Đã nộp",
    value: assignmentStats.submitted,
    detail: "Đã nộp / đã chấm",
  },
  {
    icon: AlertTriangleIcon,
    tint: "red" as const,
    label: "Quá hạn",
    value: assignmentStats.overdue,
    detail: "Cần xử lý gấp",
  },
] as const

export function AssignmentStats() {
  return (
    <div className="grid grid-cols-4 gap-4 max-[1320px]:grid-cols-2 max-[680px]:grid-cols-2">
      {statsConfig.map((stat) => (
        <Card
          key={stat.label}
          className="gap-3 rounded-[var(--radius)] border border-border bg-card p-[18px] shadow-[var(--shadow-card)] ring-0 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]"
        >
          <div className="flex items-start justify-between">
            <IconTint variant={stat.tint} size="lg">
              <stat.icon className="h-5 w-5" />
            </IconTint>
          </div>
          <div className="text-[13px] font-medium text-muted-foreground">
            {stat.label}
          </div>
          <div
            className="text-[30px] leading-[1.05] font-extrabold tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            {stat.value}
          </div>
          <div className="mt-[10px] text-[12.5px] text-muted-foreground">
            {stat.detail}
          </div>
        </Card>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/assignment-personal/components/assignment-stats.tsx
git commit -m "feat(assignment-personal): add AssignmentStats component"
```

---

### Task 3: Assignment List Component

**Files:**
- Create: `features/assignment-personal/components/assignment-list.tsx`

- [ ] **Step 1: Create assignment-list.tsx**

```typescript
"use client"

import { useState } from "react"
import {
  ArrowRightIcon,
  ClockIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  BookOpenCheckIcon,
  SearchIcon,
  FileTextIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { BadgeStatus } from "@/components/badge-status"
import { Button } from "@/components/ui/button"
import {
  personalAssignments,
  type PersonalAssignment,
  type AssignmentStatus,
} from "@/features/assignment-personal/mock"

const statusConfig: Record<
  AssignmentStatus,
  { label: string; variant: "destructive" | "warning" | "success" | "info"; icon: typeof ClockIcon }
> = {
  overdue: { label: "Quá hạn", variant: "destructive", icon: AlertTriangleIcon },
  pending: { label: "Chưa nộp", variant: "warning", icon: ClockIcon },
  submitted: { label: "Đã nộp", variant: "success", icon: CheckCircle2Icon },
  graded: { label: "Đã chấm", variant: "info", icon: BookOpenCheckIcon },
}

const statusOrder: AssignmentStatus[] = ["overdue", "pending", "submitted", "graded"]

export function AssignmentList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | "all">("all")

  const sorted = [...personalAssignments].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  )

  const filtered = sorted.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = statusFilter === "all" || a.status === statusFilter
    return matchesSearch && matchesFilter
  })

  const actionLabel = (status: AssignmentStatus): string => {
    switch (status) {
      case "overdue":
      case "pending":
        return "Nộp bài"
      case "submitted":
        return "Xem lại"
      case "graded":
        return "Xem điểm"
    }
  }

  const actionVariant = (status: AssignmentStatus): "primary" | "default" =>
    status === "overdue" || status === "pending" ? "primary" : "default"

  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 shadow-[var(--shadow-card)] ring-0">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
          Danh sách bài tập
        </h2>
        <span className="text-[13px] font-medium text-muted-foreground">
          {filtered.length}/{personalAssignments.length} bài tập
        </span>
      </div>

      {/* Search + Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2">
          <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            placeholder="Tìm kiếm bài tập..."
            className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "overdue", "pending", "submitted", "graded"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s === "all"
                ? "Tất cả"
                : s === "overdue"
                  ? "Quá hạn"
                  : s === "pending"
                    ? "Chưa nộp"
                    : s === "submitted"
                      ? "Đã nộp"
                      : "Đã chấm"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <FileTextIcon className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-[14px] font-medium text-muted-foreground">
            Không tìm thấy bài tập nào
          </p>
        </div>
      ) : (
        filtered.map((assignment) => {
          const StatusIcon = statusConfig[assignment.status].icon

          return (
            <div
              key={assignment.id}
              className="flex flex-wrap items-center gap-3.5 border-t border-border py-[13px] first:border-t-0 first:pt-0.5"
            >
              {/* Icon */}
              <div
                className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[11px] ${
                  assignment.status === "overdue"
                    ? "bg-danger-muted text-danger"
                    : assignment.status === "pending"
                      ? "bg-warning-muted text-warning"
                      : assignment.status === "submitted"
                        ? "bg-info-muted text-info"
                        : "bg-success-muted text-success"
                }`}
              >
                <StatusIcon className="h-[18px] w-[18px]" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold">
                  {assignment.title}
                </div>
                <div className="text-[12.5px] text-muted-foreground">
                  {assignment.course}
                </div>
              </div>

              {/* Due date */}
              <div className="text-right text-[12.5px] leading-tight">
                <div className="font-medium text-foreground">
                  {assignment.dueDate}
                </div>
                <div className="text-muted-foreground">
                  {assignment.dueTime}
                </div>
              </div>

              {/* Grade (if graded) */}
              {assignment.grade && assignment.grade !== "—" && (
                <div className="text-right">
                  <div className="text-[15px] font-extrabold text-success">
                    {assignment.grade}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Điểm</div>
                </div>
              )}

              {/* Status badge */}
              <BadgeStatus variant={statusConfig[assignment.status].variant}>
                {statusConfig[assignment.status].label}
              </BadgeStatus>

              {/* Action button */}
              <Button
                variant={actionVariant(assignment.status)}
                size="sm"
                className="h-7 shrink-0 px-3.5 text-[12.5px] font-semibold whitespace-nowrap"
              >
                {actionLabel(assignment.status)}
              </Button>
            </div>
          )
        })
      )}

      {/* Footer */}
      <div className="mt-2 flex items-center justify-center border-t border-border pt-[14px]">
        <Button
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary"
        >
          Xem tất cả trên lịch <ArrowRightIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/assignment-personal/components/assignment-list.tsx
git commit -m "feat(assignment-personal): add AssignmentList component with search and filters"
```

---

### Task 4: Page Composition

**Files:**
- Modify: `app/(student)/assignment-personal/page.tsx`

- [ ] **Step 1: Update page.tsx to compose feature components**

Current page is empty (1 line). Replace its content:

```typescript
import { PageHeader } from "@/components/page-header"
import { AssignmentStats } from "@/features/assignment-personal/components/assignment-stats"
import { AssignmentList } from "@/features/assignment-personal/components/assignment-list"

export default function AssignmentPersonalPage() {
  return (
    <div className="col-main col-span-full">
      <PageHeader
        title="Bài tập cá nhân"
        subtitle="Quản lý bài tập cá nhân theo từng môn học"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Bài tập cá nhân" },
        ]}
      />

      <div className="mb-6">
        <AssignmentStats />
      </div>

      <AssignmentList />
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npm run typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add app/(student)/assignment-personal/page.tsx
git commit -m "feat(assignment-personal): wire up page with stats and list components"
```
