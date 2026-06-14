# Elementary Global CSS — Design Spec

**Date:** 2026-06-14
**Status:** Approved

---

## Overview

Create a single CSS file (`elementary.css`) that provides a complete styling system for both elementary teacher and elementary student routes. This file replaces all existing CSS Modules in the `features/elementary/` directory and the shell CSS module at `components/elementary-student-shell.module.css` / `components/elementary-teacher-shell.module.css`.

The file is **self-contained** — it does not modify or depend on `globals.css` or any existing LMS portal styles. It is imported only in elementary layouts (`app/elementary-student/layout.tsx` and `app/elementary-teacher/layout.tsx`).

---

## Approach

**Single file import at layout level.** One CSS file, one import per layout. All classes use `el-` prefix to avoid collision. Scoped under `.elementary-app` wrapper class applied to the root `<div>` of each elementary layout.

---

## Scope & Constraints

- **No dark mode** — elementary routes are light-only.
- **No interference** — zero impact on other routes (LMS portal, auth, etc.).
- **CSS Modules removed** — all `.module.css` files in `features/elementary/` and `components/elementary-*-shell.module.css` will be deleted. Components migrate to global `el-` classes.
- **All HSL values stored without `hsl()` wrapper** (e.g., `243 75% 59%`), wrapped at usage via `hsl(var(--el-primary))`.

---

## Color Palette

All variables scoped under `.elementary-app`:

### Primary Brand

```css
--el-primary: 243 75% 59%;           /* same tone as global */
--el-primary-foreground: 0 0% 100%;
--el-primary-muted: 243 75% 96%;
```

### Surfaces

```css
--el-background: 248 60% 98%;        /* light lavender — warmer than pure white */
--el-card: 0 0% 100%;
--el-card-foreground: 222 47% 11%;
```

### Sidebar (dark gradient)

```css
--el-sidebar-start: 245 60% 32%;     /* indigo-dark */
--el-sidebar-end: 230 50% 15%;       /* navy */
--el-sidebar-text: 0 0% 100%;
--el-sidebar-text-muted: 245 20% 70%;
--el-sidebar-active-bg: 255 60% 55%;
```

### Semantic Colors

```css
--el-success: 142 71% 45%;
--el-warning: 38 92% 50%;
--el-danger: 0 72% 51%;
--el-info: 217 91% 60%;
```

### Accent Pastels (badges, tags, card borders)

```css
--el-amber: 40 96% 53%;
--el-teal: 172 66% 40%;
--el-rose: 340 82% 52%;
```

### Layout Tokens

```css
--el-sidebar-w: 248px;
--el-rail-w: 404px;
--el-radius: 14px;
--el-radius-sm: 10px;
--el-radius-pill: 99px;
```

---

## Typography

Elementary targets younger students, so text is slightly larger and more readable than the LMS portal:

- **Base font-size:** 15px (vs 14px in global)
- **Line-height:** 1.6 (vs 1.5 in global)
- **Headings:** heavier weight (extrabold 800), tighter tracking (`-0.02em`)
- **Body text:** weight 500 minimum for readability
- **Font family:** inherits `--font-sans` from root (Inter)

---

## Shell Layout

### Classes

| Class | Purpose |
|-------|---------|
| `.el-app` | Root grid: `grid-template-columns: var(--el-sidebar-w) 1fr` |
| `.el-sidebar` | Fixed left sidebar, dark gradient, 248px wide |
| `.el-main` | Flex column, fills remaining space |
| `.el-content` | Content grid: `grid-template-columns: 1fr var(--rail-w)`, 2-col with rail |
| `.el-rail` | Right sidebar rail (404px), hidden below 1320px |

### Sidebar Classes

| Class | Purpose |
|-------|---------|
| `.el-brand` | Brand row (logo + text) |
| `.el-brand-mark` | Logo icon container (rounded, amber bg) |
| `.el-brand-name` | Brand title text |
| `.el-brand-sub` | Subtitle text below brand |
| `.el-nav` | Nav list container |
| `.el-nav-item` | Single nav link |
| `.el-nav-item.active` | Active nav state (highlighted bg + left indicator) |
| `.el-nav-icon` | Icon inside nav item (20×20) |
| `.el-footer` | Bottom area of sidebar |
| `.el-footer-link` | Footer link style |

### Topbar

**No topbar for elementary.** The greeting card replaces it as the top-of-page element. If a topbar is needed in the future, add `.el-topbar` class.

### Responsive Breakpoints

Same as global LMS:
- `< 1320px` — `.el-content` collapses to single column, `.el-rail` hidden
- `< 980px` — sidebar hidden (hamburger toggle), full-width content
- `< 680px` — reduced padding, smaller gaps

---

## Component Classes

### Cards

| Class | Purpose |
|-------|---------|
| `.el-card` | Default card: white bg, 14px radius, subtle shadow |
| `.el-card--greeting` | Gradient background (primary-muted), decorative greeting |
| `.el-card--highlight` | Colored 2px border (primary), for stat/featured cards |
| `.el-card-pad` | Padding utility: 20px |

### Badges

| Class | Purpose |
|-------|---------|
| `.el-badge` | Status pill (99px radius, small font) |
| `.el-badge--success` | Green background/text |
| `.el-badge--warning` | Amber background/text |
| `.el-badge--info` | Blue background/text |
| `.el-badge--danger` | Red background/text |
| `.el-badge--topic` | Subject badge with colored dot indicator |

### Progress Bars

| Class | Purpose |
|-------|---------|
| `.el-progress` | Container for progress bar + label |
| `.el-progress-track` | Background track (8px height, rounded, muted bg) |
| `.el-progress-fill` | Filled portion (gradient, rounded) |
| `.el-progress-fill--success` | Green gradient |
| `.el-progress-fill--warning` | Amber gradient |

### Buttons

| Class | Purpose |
|-------|---------|
| `.el-btn` | Base button: rounded, bold, shadow |
| `.el-btn--primary` | Primary bg with colored shadow |
| `.el-btn--secondary` | Outlined: white bg, primary border |
| `.el-btn--success` | Green bg with colored shadow |
| `.el-btn--warning` | Amber bg with colored shadow |
| `.el-btn--ghost` | Muted bg, no shadow |
| `.el-btn--disabled` | Reduced opacity, not-allowed cursor |

### Gamification

| Class | Purpose |
|-------|---------|
| `.el-xp` | XP level display: emoji + progress bar |
| `.el-streak` | Streak pill (🔥 icon + count) |
| `.el-coins` | Coin pill (🪙 icon + amount) |
| `.el-level` | Level badge (🎯 icon + level number) |

### Utility Classes

| Class | Purpose |
|-------|---------|
| `.el-section-head` | Section heading row (title + action) |
| `.el-link` | Primary-colored link with arrow |
| `.el-spinner` | Loading spinner (animated border) |
| `.el-loading` | Loading state container (centered, min-height 60vh) |

---

## File Structure

```
app/
  elementary.css                          ← NEW: single global CSS file
  elementary-student/
    layout.tsx                            ← MODIFY: import elementary.css
  elementary-teacher/
    layout.tsx                            ← MODIFY: import elementary.css
components/
  elementary-student-shell.tsx            ← MODIFY: use el- classes, drop CSS Module
  elementary-student-shell.module.css     ← DELETE
  elementary-teacher-shell.tsx            ← MODIFY: use el- classes, drop CSS Module
  elementary-teacher-shell.module.css     ← DELETE
features/elementary/
  **/*.module.css                         ← DELETE all CSS Modules
  **/*.tsx                                ← MODIFY: replace module classes with el- classes
```

### Import pattern in layouts

```tsx
import "@/app/elementary.css"
```

This import goes in both `app/elementary-student/layout.tsx` and `app/elementary-teacher/layout.tsx`. Since Next.js deduplicates CSS imports, it will only be included once in the bundle.

---

## Migration Steps (Implementation Order)

1. **Create `app/elementary.css`** with all variables, shell, and component classes.
2. **Update shell components** (`elementary-student-shell.tsx`, `elementary-teacher-shell.tsx`): drop CSS Module import, use `el-` classes.
3. **Delete shell CSS Modules** (`elementary-student-shell.module.css`, `elementary-teacher-shell.module.css`).
4. **Update imports in layouts** — add `import "@/app/elementary.css"`.
5. **Migrate feature components** one by one (dashboard → quiz → classes → groups):
   - Replace `import styles from "./X.module.css"` with `className="el-*"`.
   - Delete `.module.css` files after migration.
6. **Verify responsive behavior** at all breakpoints.
7. **Run build** to confirm no broken imports or unused CSS Modules.

---

## What's NOT in Scope

- Dark mode for elementary routes
- Changes to `globals.css` or any non-elementary styles
- New component logic or data models — only CSS/styling changes
- New routes or pages — existing elementary pages are restyled only
