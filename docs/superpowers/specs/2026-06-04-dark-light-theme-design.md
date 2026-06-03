# Dark / Light Theme — Design Spec

**Date:** 2026-06-04  
**Status:** Approved  
**Scope:** Full Polish (Option B)

---

## Summary

Triển khai hệ thống dark/light theme hoàn chỉnh cho LMS Portal student app. Cơ sở hạ tầng (`next-themes`, `ThemeProvider`, phím tắt `D`) đã có sẵn; công việc tập trung vào: (1) chuẩn hoá dark token palette, (2) fix hardcoded colors, (3) thêm ThemeToggle UI component, (4) smooth transition.

---

## Decisions

| Quyết định | Lựa chọn | Lý do |
|---|---|---|
| Toggle placement | Topbar — trước avatar | Dễ tìm, phổ biến nhất |
| Toggle style | Pill 3 options (Sáng / Tối / Hệ thống) | Hỗ trợ system preference, next-themes đã có sẵn `enableSystem` |
| Dark palette | Navy / Indigo-tinted | Đồng nhất với brand color tím/indigo của app |
| Transition | Smooth (0.2s) trên các selector chính | Polish tốt, perf acceptable |
| `defaultTheme` | Giữ `"light"` | Tránh breaking change, system-aware có thể làm sau |

---

## Files Changed

### 1. `components/theme-toggle.tsx` — NEW

Pill component với 3 option: `light`, `dark`, `system`.

- Dùng `useTheme()` từ `next-themes`
- Icons: `SunIcon`, `MoonIcon`, `MonitorIcon` (lucide-react)
- Label text: "Sáng" / "Tối" / "Hệ thống" — hiện trên `sm:` trở lên, ẩn trên mobile
- Active state: background trắng + box-shadow nhẹ
- Animation: icon rotate 360° khi switch (CSS keyframe)
- Wrap trong `suppressHydrationWarning` để tránh hydration mismatch

### 2. `components/app-topbar.tsx` — MODIFY

- Import `ThemeToggle`
- Render trước `<DropdownMenu>` (profile) trong `.topbar-right`

### 3. `app/globals.css` — MODIFY

#### 3a. Dark token block — Chuẩn hoá + bổ sung thiếu

Thay toàn bộ `.dark { }` block hiện tại (dùng `oklch`) bằng HSL values, đồng nhất với light mode. Thêm đầy đủ:

| Token nhóm | Tokens |
|---|---|
| Surfaces | `--background`, `--card`, `--popover`, `--muted` |
| Brand | `--primary`, `--primary-foreground`, `--primary-muted` |
| Secondary | `--secondary`, `--secondary-foreground` |
| Semantic | `--success`, `--success-foreground`, `--success-muted`, `--warning-*`, `--info-*`, `--danger-*`, `--destructive` |
| UI | `--border`, `--input`, `--ring`, `--foreground`, `--muted-foreground` |
| Sidebar | `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring` |
| Charts | `--chart-1` → `--chart-5` |
| Course colors | `--course-violet`, `--course-green`, `--course-blue`, `--course-amber`, `--course-teal`, `--course-rust` |
| Shadows | `--shadow-card`, `--shadow-pop`, `--shadow-sm` |

**Palette cơ sở (Navy/Indigo-tinted):**
```
--background: 222 47% 5%        → #0d1117
--card:       222 38% 10%       → #161b27  
--border:     220 25% 18%       → #21293a
--muted:      220 25% 18%
--primary:    239 84% 73%       → indigo-400 cho dark
--primary-muted: 238 50% 18%
```

#### 3b. Fix hardcoded colors — thay bằng CSS variables

| Selector | Property | Trước | Sau |
|---|---|---|---|
| `.course` | `background` | `#fff` | `hsl(var(--card))` |
| `.nav-item` | `color` | `hsl(215 18% 38%)` | `hsl(var(--muted-foreground))` |
| `.nav-subitem` | `color` | `hsl(215 16% 45%)` | `hsl(var(--muted-foreground))` |
| `.search input:focus` | `background` | `#fff` | `hsl(var(--card))` |
| `::-webkit-scrollbar-thumb` | `background` | `hsl(214 32% 88%)` | `hsl(var(--border))` |
| `::-webkit-scrollbar-thumb:hover` | `background` | `hsl(214 20% 78%)` | `hsl(var(--muted-foreground) / 0.5)` |
| `.assistant` | `background` | light gradient hardcoded | thêm `.dark .assistant` override |
| `.icon-btn` | `color` | `hsl(215 18% 40%)` | `hsl(var(--muted-foreground))` |

#### 3c. Smooth transition

Thêm vào `@layer base` — áp dụng chọn lọc để tránh ảnh hưởng animations:

```css
body, .sidebar, .topbar, .card, .nav-item, .nav-subitem,
.assistant, .search input, .icon-btn, ::-webkit-scrollbar-thumb {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.1s ease;
}
```

#### 3d. Dark scrollbar

```css
.dark ::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-color: hsl(var(--background));
}
```

### 4. `components/theme-provider.tsx` — MODIFY

- Xoá prop `disableTransitionOnChange` → cho phép smooth transition
- Giữ nguyên `attribute="class"`, `defaultTheme="light"`, `enableSystem`, phím tắt `D`

---

## Out of Scope

- Lưu preference vào user profile/backend
- Đổi `defaultTheme` sang `"system"` (Phase C sau)
- Tooltip cho toggle options
- Dark mode cho các trang chưa được build (auth pages, etc.)

---

## Verification

1. Toggle Pill hoạt động đúng — 3 states, active indicator đúng
2. `system` mode follow OS preference
3. Phím tắt `D` vẫn hoạt động (toggle light↔dark, bỏ qua system)
4. Không có flash khi reload (next-themes tự xử lý)
5. Smooth transition khi switch (không giật)
6. Tất cả hardcoded colors đã hiển thị đúng ở dark mode
7. Scrollbar style đổi theo theme
