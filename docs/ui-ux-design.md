# UI/UX Design — LMS Portal

Tài liệu này ghi lại các quy tắc thiết kế đang được áp dụng trong dự án LMS Portal. Mọi thay đổi UI mới cần tuân theo các quy tắc ở đây.

---

## 1. App Shell & Layout

### Grid layout chính

```
┌──────────────────────────────────────────────────────────┐
│  AppSidebar (248px, sticky)  │  Main (1fr + 404px rail)  │
│                              │  ┌─────────────────────┐  │
│  Logo + Nav                  │  │ AppTopbar (sticky)  │  │
│  ─────────────────           │  ├─────────────────────┤  │
│  NavItem active:             │  │                     │  │
│  • primary-muted bg         │  │   Content Area      │  │
│  • primary color text       │  │   (grid 1fr 404px) │  │
│  • left border indicator     │  │                     │  │
│                              │  └─────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Cấu trúc `.content` CSS Grid

```css
.content {
  display: grid;
  grid-template-columns: 1fr var(--rail-w); /* main | rail */
  gap: 22px;
  padding: 26px 24px 40px;
  align-items: start;
}
```

**Quy tắc chiều rộng nội dung:**

| Class              | Mô tả                                                     |
|--------------------|------------------------------------------------------------|
| `col-main`         | Cột chính, chiếm 1 phần trong grid `1fr 404px`           |
| `col-span-full`    | Chiếm toàn bộ chiều rộng (grid-column: 1 / -1)          |

- **Trang 1 cột** (courses, calendar, assignments…): dùng `col-main col-span-full`
- **Trang có sidebar phải** (dashboard): chỉ dùng `col-main` (không có `col-span-full`)
- Component chính bên trong dùng `display: flex; flex-direction: column; gap: 20px`

### Responsive Breakpoints

| Breakpoint  | Mục tiêu                          | Thay đổi chính                         |
|-------------|-----------------------------------|----------------------------------------|
| < 1320px    | Small desktop                    | Grid: 1 cột, `.courses` 2 cột         |
| < 980px     | Tablet / mobile landscape        | Sidebar ẩn, `.content` full-width      |
| < 680px     | Mobile                           | Search ẩn, `.courses` 1 cột, padding thu hẹp |

---

## 2. Design Tokens

### Màu chính (Primary Brand)

```
--primary:         243 75% 59%   (#4f46e5) — indigo-600, nút chính, active nav
--primary-foreground: 0 0% 100%
--primary-muted:   243 75% 96%   — bg active nav item, badge nhẹ
```

### Semantic Colors

```
--success:          142 71% 45%  — xanh lá, trạng thái tốt
--info:             217 91% 60% — xanh dương, thông tin
--warning:          38 92% 50%   — cam, cảnh báo
--danger:           0 72% 51%   — đỏ, lỗi / nguy hiểm

Mỗi semantic color đi kèm:
  --<color>-foreground   (text trên nền màu đó)
  --<color>-muted       (bg nhạt của màu đó)
```

### Màu Course Category

```
--course-violet:   262 83% 58%
--course-green:    142 71% 45%
--course-blue:     221 83% 53%
--course-amber:    32 95% 52%
--course-teal:     172 66% 40%
--course-rust:     14 52% 48%
```

**Gradient pattern** (dùng trong `.course-top` của course card):

```css
background: linear-gradient(155deg, hsl(<hue> / <light>), hsl(<hue> / <dark>));
/* Ví dụ violet: */
background: linear-gradient(155deg, hsl(262 83% 62%), hsl(262 83% 50%));
```

### Border & Input

```
--border:   214 32% 91%  — slate-200, viền card, input, divider
--input:    214 32% 91%
--ring:     243 75% 59%  — focus ring màu primary
```

### Border Radius System

```
--radius:     0.875rem (14px) — card chính
--radius-sm:  calc(var(--radius) * 0.6)  ≈ 8px
--radius-md:  calc(var(--radius) * 0.8)  ≈ 11px  (nav item)
--radius-lg:  var(--radius)              ≈ 14px
--radius-xl:  calc(var(--radius) * 1.4)  ≈ 20px
--radius-2xl: calc(var(--radius) * 1.8)  ≈ 25px
--radius-pill: 99px  — badge, chip nhỏ
--radius-nav:  11px  — nav item
--radius-btn:  9px   — button
```

### Shadow System

```css
--shadow-card:  0 1px 3px 0 hsl(222 47% 11% / 0.06), 0 1px 2px -1px hsl(222 47% 11% / 0.05);
--shadow-pop:   0 10px 30px -10px hsl(222 47% 11% / 0.18); /* hover card, dropdown */
--shadow-sm:    0 1px 2px 0 hsl(222 47% 11% / 0.04);
```

### Layout Widths

```
--sidebar-width:        248px
--sidebar-width-collapsed: 80px
--topbar-height:        72px
--rail-width:           404px
```

---

## 3. Typography

```
Font:       Inter (Google Fonts), fallback system-ui
Base size:  14px / line-height 1.5
Heading:    font-weight: 700–800, letter-spacing: -0.01em đến -0.02em
Body:       font-weight: 400–500
Truncation: dùng flex layout, không hard-code width
```

### Heading sizes

| Selector         | Size  | Weight | Letter-spacing |
|-----------------|-------|--------|---------------|
| `.brand-name`   | 18px  | 800    | -0.02em       |
| `h1` (page title) | 26px | 800    | -0.02em       |
| `.section-head h2` | 16.5px | 700  | -0.01em       |
| `.course-name`   | 14px  | 700    | —             |
| Stat number      | 14–17px | 800  | —             |

---

## 4. Component Patterns

### Card

```css
.card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius); /* 14px */
  box-shadow: var(--shadow-card);
}
.card-pad { padding: 20px; }
```

### Stat Chip / Head Chip

Dùng cho header stats (tổng số môn, tín chỉ, bài tập, điểm TB):

```css
.statChip {
  display: flex;
  align-items: center;
  gap: 9px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 9px 14px;
  box-shadow: var(--shadow-card);
}
/* Icon tint: */
.statChipIcon {
  width: 32px; height: 32px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
```

### Tabs (Filter Tabs)

```css
.tabs {
  display: inline-flex;
  background: hsl(var(--muted));
  border: 1px solid hsl(var(--border));
  border-radius: 11px;
  padding: 4px;
  gap: 3px;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--muted-foreground));
  padding: 7px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
}
.tab.active {
  background: hsl(var(--card));
  color: hsl(var(--foreground));
  box-shadow: var(--shadow-card);
}
/* Count badge: */
.tabCount {
  font-size: 11px;
  font-weight: 700;
  background: hsl(var(--muted-foreground) / 0.12);
  color: hsl(var(--muted-foreground));
  border-radius: 99px;
  padding: 1px 7px;
}
.tabCountActive {
  background: hsl(var(--primary) / 0.12);
  color: hsl(var(--primary));
}
```

### Search Input (inline)

```css
.search {
  display: flex;
  align-items: center;
  gap: 9px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 10px;
  padding: 9px 13px;
  min-width: 260px;
}
.search:focus-within {
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 3px hsl(var(--ring) / 0.12);
}
```

### Course Card

```css
.courseCard {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--card));
  box-shadow: var(--shadow-card);
  transition: transform 0.15s, box-shadow 0.15s;
}
.courseCard:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-pop);
}
```

### Icon Sizes

| Context          | Size  | stroke-width |
|-----------------|-------|-------------|
| Nav item         | 18×18 | 2           |
| Nav sub / caret  | 16×16 | —           |
| Topbar icon-btn  | 22×22 | —           |
| Inline icon      | 14×14 | —           |
| Card emblem      | 18×18 | —           |
| Stat icon        | 15×15 | —           |

---

## 5. Animation & Transition

- Sidebar collapse: `0.26s cubic-bezier(0.4, 0, 0.2, 1)`
- Hover states: `0.15s` ease
- Nav group expand/collapse: `0.25s ease` (grid-template-rows transition)
- Card hover lift: `transform: translateY(-3px) + shadow-pop`

---

## 6. Dark Mode

Dark mode toggle bật class `.dark` trên `<html>`. Token values chuyển sang `oklch`:

```
--background: oklch(0.145 0 0)
--foreground: oklch(0.985 0 0)
--card: oklch(0.205 0 0)
--primary: oklch(0.922 0 0)  → primary-foreground: oklch(0.205 0 0)
--border: oklch(1 0 0 / 10%)
```

---

## 7. Scrollbar & Selection

```css
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb {
  background: hsl(214 32% 88%);
  border-radius: 99px;
  border: 3px solid hsl(var(--background));
}
::selection { background: hsl(var(--primary) / 0.2); color: hsl(var(--primary)); }
```

---

## 8. Checklist trước khi merge UI

- [ ] Dùng CSS custom properties (không hard-code màu hex/rgb)
- [ ] Trang full-width: `col-main col-span-full`, trang có rail: chỉ `col-main`
- [ ] Responsive breakpoints: < 1320px, < 980px, < 680px
- [ ] Card dùng `border-radius: var(--radius)`, shadow `var(--shadow-card)`
- [ ] Icon size đúng convention
- [ ] Dark mode không break layout
- [ ] Không dùng inline style cho màu sắc/layout (chỉ cho dynamic value như progress width)
