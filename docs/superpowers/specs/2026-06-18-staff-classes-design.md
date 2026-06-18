# Staff Classes Management — Design Spec

**Date:** 2026-06-18
**Status:** Draft

---

## Overview

A staff-side class management page for adult education (centers, colleges, universities). Provides a table-based list view with CRUD operations (create, edit, delete) for managing classes.

---

## Data Model

### `StaffClass` interface

```ts
interface StaffClass {
  id: string
  code: string                    // Mã lớp, e.g. "LHP-2026-01"
  name: string                    // Tên lớp, e.g. "Lập trình Web - Khóa 01"
  instructor: string              // Tên giảng viên
  subjects: string[]              // Bộ môn (multi), e.g. ["Toán", "Lý"]
  maxStudents: number             // Sĩ số tối đa
  currentStudents: number         // Sĩ số hiện tại
  schedule: ClassSchedule[]       // Lịch học (structured)
  status: "active" | "paused" | "ended"
  startDate: string               // ISO date
  endDate: string                 // ISO date
  location?: string               // Địa điểm (optional)
  createdAt: string
  updatedAt: string
}

interface ClassSchedule {
  dayOfWeek: number               // 0=Chủ Nhật ... 7=Thứ 7 (or 1-7 Mon-Sun)
  startTime: string               // "18:00"
  endTime: string                 // "20:00"
}
```

### Status mapping

| Value       | Label           | Badge variant |
|-------------|-----------------|---------------|
| `active`    | Đang hoạt động  | `success`     |
| `paused`    | Tạm dừng        | `warning`     |
| `ended`     | Đã kết thúc     | `outline`     |

---

## Architecture

### File Structure

```
app/staff/
  layout.tsx                      # StaffShell wrapper + staff.css import
  classes/
    page.tsx                      # Server component, imports mock data
    page.module.css               # (optional) Page-specific styles if needed

components/
  staff-shell.tsx                 # Staff layout shell (sidebar + topbar)

features/staff/classes/
  components/
    classes-table.tsx             # "use client" — table with sorting/filtering
    class-form-dialog.tsx         # "use client" — create/edit form dialog
    class-delete-dialog.tsx      # "use client" — confirmation dialog
  mock/
    staff-classes.mock.ts         # TypeScript interface + mock data
    index.ts                      # barrel export
  types.ts                        # Shared types (StaffClass, ClassSchedule)
```

### Layout

`app/staff/layout.tsx` wraps children in `<StaffShell>`, following the same pattern as `app/elementary-teacher/layout.tsx`.

`StaffShell` is similar to `StudentShell` but:
- Uses staff-specific sidebar nav items (Quản lý lớp học, Quản lý giảng viên, etc.)
- Brand text: "LMS Portal — Dành cho Nhân viên"
- Imports `staff.css` for scoped styles (same approach as `elementary.css`)

### Page

`app/staff/classes/page.tsx` is a server component that:
1. Imports mock data from `@/features/staff/classes/mock`
2. Renders `<PageHeader>` with title "Quản lý lớp học" and stat chips (Tổng lớp, Đang hoạt động, Tạm dừng)
3. Renders `<ClassesTable>` (client component) passing data as props

### Table Component (`ClassesTable`)

Uses shadcn `Table` components. Columns:

| Column       | Content                              |
|--------------|--------------------------------------|
| Mã lớp      | Code (monospace, badge style)        |
| Tên lớp     | Full class name                      |
| Giảng viên  | Instructor name                      |
| Bộ môn      | Subject badges (multi)               |
| Sĩ số       | currentStudents / maxStudents        |
| Lịch học    | Formatted schedule text              |
| Trạng thái  | BadgeStatus component                |
| Thao tác    | Edit + Delete icon buttons           |

Features:
- Search input — filters by code, name, instructor
- Status filter tabs (Tất cả / Đang hoạt động / Tạm dừng / Đã kết thúc)
- "Thêm lớp mới" button opens `ClassFormDialog`
- Edit button opens `ClassFormDialog` pre-filled
- Delete button opens `ClassDeleteDialog`

### Class Form Dialog (`ClassFormDialog`)

Dialog with form fields:
- Mã lớp (text input, required)
- Tên lớp (text input, required)
- Giảng viên (text input or select, required)
- Bộ môn (multi-select or tag input, required)
- Sĩ số tối đa (number input, required)
- Lịch học (dynamic list — add/remove schedule rows, each row: dayOfWeek select + startTime/endTime inputs)
- Trạng thái (select: 3 options)
- Ngày bắt đầu / Ngày kết thúc (date inputs)
- Địa điểm (text input, optional)

### Delete Confirmation Dialog

Simple confirmation: "Bạn có chắc chắn muốn xóa lớp [code]?" with Cancel / Delete buttons.

---

## Styling

Follow the established `elementary.css` pattern:
- Create `app/staff/staff.css` with `staff-` prefix for all classes
- Root wrapper: `.staff-app`
- Import in `app/staff/layout.tsx`
- Reuse existing `globals.css` variables for colors (dark mode compatible)
- No need for a separate color palette — staff section follows the main portal theme

Key CSS classes:
- `.staff-table` — table container
- `.staff-table-header` — table header row
- `.staff-table-row` — table body row
- `.staff-badge-status` — status badge styles (reuse BadgeStatus component)
- `.staff-subject-badge` — subject tag style
- `.staff-schedule-text` — formatted schedule display
- `.staff-toolbar` — filter bar (search + tabs + add button)

---

## Mock Data

8-10 sample classes with Vietnamese names, varied:
- Different subjects: Toán, Vật lý, Hóa học, Lập trình, Tiếng Anh, Marketing
- Different statuses across all 3 states
- Different schedules (some morning, some evening, some weekend)
- Sĩ số ranging from 15-45

---

## Scope & Constraints

- **Mock data only** — no Firebase integration yet. Interface designed to match Firestore collection structure.
- **No routing to detail pages** — CRUD happens in dialogs on the same page.
- **No pagination** — table shows all classes. Can add later when data grows.
- **Responsive** — table scrolls horizontally on small screens (same pattern as other table pages).
- **Dark mode** — must work with existing dark/light theme system.

---

## Decisions

1. **Table over cards** — adult education context implies many classes with dense data; table is more scannable than card grid.
2. **Dialog-based CRUD** — simpler than separate pages, keeps context. Create and edit share the same form component.
3. **staff.css pattern** — matches elementary.css approach for section-scoped styles without affecting other routes.
4. **No separate StaffShell component file initially** — can inline in layout or create as a thin wrapper if nav items are simple. Will decide during implementation based on complexity.
