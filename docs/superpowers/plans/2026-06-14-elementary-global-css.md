# Elementary Global CSS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a single `elementary.css` file that replaces all CSS Modules and Tailwind utilities across elementary routes with a unified `el-` prefixed class system.

**Architecture:** One CSS file imported at the layout level. All classes scoped under `.elementary-app` wrapper. CSS Modules in `components/` and `features/` are deleted. Components rewritten to use `el-` global classes.

**Tech Stack:** Plain CSS with custom properties. No preprocessor, no CSS-in-JS, no new dependencies.

**Spec:** `docs/superpowers/specs/2026-06-14-elementary-global-css-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| **Create** | `app/elementary.css` | All CSS variables, shell, component classes, responsive rules |
| **Modify** | `components/elementary-student-shell.tsx` | Drop CSS Module import, use `el-` classes, wrap in `.elementary-app` |
| **Delete** | `components/elementary-student-shell.module.css` | Replaced by `app/elementary.css` |
| **Modify** | `components/elementary-teacher-shell.tsx` | Drop CSS Module import, use `el-` classes, wrap in `.elementary-app` |
| **Delete** | `components/elementary-teacher-shell.module.css` | Replaced by `app/elementary.css` |
| **Modify** | `app/elementary-student/layout.tsx` | Add `import "@/app/elementary.css"` |
| **Modify** | `app/elementary-teacher/layout.tsx` | Add `import "@/app/elementary.css"` |
| **Modify** | `features/elementary/quiz/components/quiz-page.tsx` | Replace module classes with `el-` classes |
| **Modify** | `features/elementary/quiz/components/quiz-question.tsx` | Replace module classes with `el-` classes |
| **Modify** | `features/elementary/quiz/components/quiz-result.tsx` | Replace module classes with `el-` classes |
| **Modify** | `features/elementary/quiz/components/quiz-leaderboard.tsx` | Replace module classes with `el-` classes |
| **Delete** | `features/elementary/quiz/components/quiz-page.module.css` | Replaced |
| **Delete** | `features/elementary/quiz/components/quiz-question.module.css` | Replaced |
| **Delete** | `features/elementary/quiz/components/quiz-result.module.css` | Replaced |
| **Delete** | `features/elementary/quiz/components/quiz-leaderboard.module.css` | Replaced |
| **Modify** | `features/elementary/classes/components/classes-page.tsx` | Replace module classes with `el-` classes |
| **Modify** | `features/elementary/classes/components/student-classes-page.tsx` | Replace module classes with `el-` classes |
| **Delete** | `features/elementary/classes/components/classes-page.module.css` | Replaced |
| **Delete** | `features/elementary/classes/components/student-classes-page.module.css` | Replaced |
| **Modify** | `features/elementary/groups/components/groups-page.tsx` | Replace module classes with `el-` classes |
| **Delete** | `features/elementary/groups/components/groups-page.module.css` | Replaced |

**Not modified** (already use Tailwind, no CSS Modules):
- `features/elementary/dashboard/components/*.tsx` — these use Tailwind utilities, will be migrated in a follow-up if desired
- `features/elementary/quiz/components/quiz-timer.tsx` — uses Tailwind utilities, no CSS Module

---

### Task 1: Create `app/elementary.css` — Variables, Shell, and Responsive

**Files:**
- Create: `app/elementary.css`

This is the foundation file. It contains ALL custom properties, the shell layout classes, sidebar styles, typography overrides, and responsive breakpoints. Every subsequent task depends on this file existing.

- [ ] **Step 1: Write the complete CSS file**

Create `app/elementary.css` with the following content. This covers sections 1-5 of the spec (variables, typography, shell layout, sidebar, responsive) plus keyframe animations referenced by quiz components.

```css
/* ============================================================
   Elementary CSS — scoped to .elementary-app
   Replaces all CSS Modules for elementary routes.
   ============================================================ */

/* ─── Custom Properties ─── */

.elementary-app {
  /* Primary Brand */
  --el-primary: 243 75% 59%;
  --el-primary-foreground: 0 0% 100%;
  --el-primary-muted: 243 75% 96%;

  /* Surfaces */
  --el-background: 248 60% 98%;
  --el-card: 0 0% 100%;
  --el-card-foreground: 222 47% 11%;

  /* Text */
  --el-foreground: 222 47% 11%;
  --el-muted-foreground: 215 16% 47%;

  /* Sidebar */
  --el-sidebar-start: 245 60% 32%;
  --el-sidebar-end: 230 50% 15%;
  --el-sidebar-text: 0 0% 100%;
  --el-sidebar-text-muted: 245 20% 70%;
  --el-sidebar-active-bg: 255 60% 55%;

  /* Semantic */
  --el-success: 142 71% 45%;
  --el-warning: 38 92% 50%;
  --el-danger: 0 72% 51%;
  --el-info: 217 91% 60%;

  /* Accent Pastels */
  --el-amber: 40 96% 53%;
  --el-teal: 172 66% 40%;
  --el-rose: 340 82% 52%;

  /* Borders */
  --el-border: 243 30% 91%;

  /* Layout */
  --el-sidebar-w: 248px;
  --el-rail-w: 404px;
  --el-radius: 14px;
  --el-radius-sm: 10px;
  --el-radius-pill: 99px;

  /* Shadows */
  --el-shadow-card:
    0 1px 3px 0 hsl(222 47% 11% / 0.06),
    0 1px 2px -1px hsl(222 47% 11% / 0.05);
  --el-shadow-pop:
    0 10px 30px -10px hsl(222 47% 11% / 0.18);
  --el-shadow-sm:
    0 1px 2px 0 hsl(222 47% 11% / 0.04);
}

/* ─── Typography ─── */

.elementary-app {
  font-size: 15px;
  line-height: 1.6;
  color: hsl(var(--el-foreground));
}

.elementary-app h1 {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0;
}

.elementary-app h2 {
  font-size: 16.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0;
}

.elementary-app p {
  margin: 0;
}

/* ─── Shell Layout ─── */

.el-app {
  display: grid;
  grid-template-columns: var(--el-sidebar-w) 1fr;
  min-height: 100vh;
}

.el-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: var(--el-sidebar-w);
}

.el-content {
  display: grid;
  grid-template-columns: 1fr var(--el-rail-w);
  gap: 22px;
  padding: 26px 24px 40px;
  align-items: start;
  flex: 1;
}

.el-rail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.el-col-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

/* ─── Sidebar ─── */

.el-sidebar {
  width: var(--el-sidebar-w);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    180deg,
    hsl(var(--el-sidebar-start)) 0%,
    hsl(var(--el-sidebar-end)) 100%
  );
  border-right: none;
}

/* ─── Brand ─── */

.el-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid hsl(0 0% 100% / 0.1);
}

.el-brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: hsl(var(--el-amber));
  color: hsl(var(--el-sidebar-end));
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.el-brand-name {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--el-sidebar-text);
}

.el-brand-sub {
  font-size: 12px;
  color: hsl(var(--el-sidebar-text-muted));
  line-height: 1.3;
}

/* ─── Nav ─── */

.el-nav {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.el-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: hsl(var(--el-sidebar-text-muted));
  text-decoration: none;
  transition: all 0.15s;
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.el-nav-item:hover {
  background: hsl(0 0% 100% / 0.08);
  color: var(--el-sidebar-text);
}

.el-nav-item.active {
  background: hsl(var(--el-sidebar-active-bg) / 0.9);
  color: var(--el-sidebar-text);
  font-weight: 600;
}

.el-nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* ─── Footer ─── */

.el-footer {
  padding: 8px;
  border-top: 1px solid hsl(0 0% 100% / 0.1);
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.el-footer-link,
.el-footer-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: hsl(var(--el-sidebar-text-muted));
  text-decoration: none;
  transition: all 0.15s;
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.el-footer-link:hover,
.el-footer-btn:hover {
  background: hsl(0 0% 100% / 0.08);
  color: var(--el-sidebar-text);
}

/* ─── Cards ─── */

.el-card {
  background: hsl(var(--el-card));
  border: 1px solid hsl(var(--el-border));
  border-radius: var(--el-radius);
  box-shadow: var(--el-shadow-card);
  color: hsl(var(--el-card-foreground));
}

.el-card--greeting {
  background: linear-gradient(
    135deg,
    hsl(var(--el-primary-muted)),
    hsl(252 80% 96%)
  );
  border: 1px solid hsl(var(--el-primary) / 0.15);
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
}

.el-card--highlight {
  background: hsl(var(--el-card));
  border: 2px solid hsl(var(--el-primary) / 0.3);
  border-radius: var(--el-radius);
  box-shadow: var(--el-shadow-card);
}

.el-card-pad {
  padding: 20px;
}

/* ─── Badges ─── */

.el-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--el-radius-pill);
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.el-badge--success {
  background: hsl(var(--el-success) / 0.1);
  color: hsl(var(--el-success));
}

.el-badge--warning {
  background: hsl(var(--el-warning) / 0.1);
  color: hsl(var(--el-warning));
}

.el-badge--info {
  background: hsl(var(--el-info) / 0.1);
  color: hsl(var(--el-info));
}

.el-badge--danger {
  background: hsl(var(--el-danger) / 0.1);
  color: hsl(var(--el-danger));
}

.el-badge--topic {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px 3px 7px;
  border-radius: var(--el-radius-pill);
  font-size: 10px;
  font-weight: 600;
  border: 1px solid hsl(var(--el-primary) / 0.15);
  background: hsl(var(--el-primary-muted));
  color: hsl(var(--el-primary) / 0.8);
}

/* ─── Progress Bars ─── */

.el-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.el-progress-label {
  font-size: 11px;
  color: hsl(var(--el-muted-foreground));
  white-space: nowrap;
}

.el-progress-pct {
  font-size: 12px;
  font-weight: 700;
  color: hsl(var(--el-success));
  white-space: nowrap;
  min-width: 36px;
  text-align: right;
}

.el-progress-track {
  flex: 1;
  height: 8px;
  border-radius: var(--el-radius-pill);
  background: hsl(var(--el-primary-muted));
  overflow: hidden;
  min-width: 50px;
}

.el-progress-fill {
  display: block;
  height: 100%;
  border-radius: var(--el-radius-pill);
  background: linear-gradient(
    90deg,
    hsl(var(--el-primary)),
    hsl(262 83% 58%)
  );
  transition: width 0.4s ease;
}

.el-progress-fill--success {
  background: linear-gradient(
    90deg,
    hsl(var(--el-success)),
    hsl(142 65% 48%)
  );
}

.el-progress-fill--warning {
  background: linear-gradient(
    90deg,
    hsl(var(--el-warning)),
    hsl(40 96% 53%)
  );
}

/* ─── Buttons ─── */

.el-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: var(--el-radius-sm);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  line-height: 1;
  white-space: nowrap;
}

.el-btn--primary {
  background: hsl(var(--el-primary));
  color: var(--el-primary-foreground);
  box-shadow: 0 4px 12px hsl(var(--el-primary) / 0.35);
}

.el-btn--primary:hover {
  opacity: 0.9;
}

.el-btn--secondary {
  background: hsl(var(--el-card));
  color: hsl(var(--el-primary));
  border: 2px solid hsl(var(--el-primary) / 0.25);
  box-shadow: none;
}

.el-btn--secondary:hover {
  border-color: hsl(var(--el-primary) / 0.5);
  background: hsl(var(--el-primary-muted));
}

.el-btn--success {
  background: hsl(var(--el-success));
  color: var(--el-primary-foreground);
  box-shadow: 0 4px 12px hsl(var(--el-success) / 0.35);
}

.el-btn--success:hover {
  opacity: 0.9;
}

.el-btn--warning {
  background: hsl(var(--el-warning));
  color: var(--el-primary-foreground);
  box-shadow: 0 4px 12px hsl(var(--el-warning) / 0.35);
}

.el-btn--warning:hover {
  opacity: 0.9;
}

.el-btn--ghost {
  background: hsl(var(--el-primary-muted));
  color: hsl(var(--el-primary));
  box-shadow: none;
}

.el-btn--ghost:hover {
  background: hsl(var(--el-primary) / 0.1);
}

.el-btn--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.el-btn--sm {
  padding: 7px 14px;
  font-size: 12px;
}

/* ─── Gamification ─── */

.el-xp {
  display: flex;
  align-items: center;
  gap: 10px;
  background: hsl(var(--el-card));
  border: 1px solid hsl(var(--el-border));
  border-radius: var(--el-radius-sm);
  padding: 10px 14px;
}

.el-xp-icon {
  font-size: 18px;
}

.el-xp-info {
  flex: 1;
}

.el-xp-header {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  margin-bottom: 3px;
}

.el-xp-level {
  font-weight: 700;
  color: hsl(var(--el-foreground));
}

.el-xp-count {
  color: hsl(var(--el-muted-foreground));
}

.el-streak,
.el-coins,
.el-level {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: var(--el-radius-pill);
  font-size: 12px;
  font-weight: 600;
}

.el-streak {
  background: hsl(var(--el-danger) / 0.08);
  border: 1px solid hsl(var(--el-danger) / 0.2);
  color: hsl(var(--el-danger));
}

.el-coins {
  background: hsl(var(--el-amber) / 0.08);
  border: 1px solid hsl(var(--el-amber) / 0.2);
  color: hsl(var(--el-amber));
}

.el-level {
  background: hsl(var(--el-primary-muted));
  border: 1px solid hsl(var(--el-primary) / 0.15);
  color: hsl(var(--el-primary));
}

/* ─── Utility Classes ─── */

.el-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.el-link {
  color: hsl(var(--el-primary));
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
}

.el-link:hover {
  text-decoration: underline;
}

.el-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid hsl(var(--el-primary-muted));
  border-top-color: hsl(var(--el-primary));
  border-radius: 50%;
  animation: el-spin 0.8s linear infinite;
}

.el-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 12px;
  color: hsl(var(--el-muted-foreground));
  font-size: 14px;
}

@keyframes el-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ─── Quiz-Specific ─── */

.el-quiz-page {
  display: flex;
  min-height: 100%;
}

.el-quiz-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  max-width: 700px;
}

.el-quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.el-quiz-progress {
  height: 4px;
  background: hsl(var(--el-primary-muted));
  border-radius: 2px;
  margin-bottom: 24px;
  overflow: hidden;
}

.el-quiz-progress-fill {
  height: 100%;
  background: hsl(var(--el-primary));
  border-radius: 2px;
  transition: width 0.3s ease;
}

.el-q-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.el-q-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.el-q-num {
  font-size: 14px;
  color: hsl(var(--el-muted-foreground));
}

.el-q-content {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 8px;
}

.el-q-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.el-q-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 2px solid hsl(var(--el-border));
  border-radius: var(--el-radius-sm);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.15s ease;
  background: transparent;
  text-align: left;
  width: 100%;
  font-family: inherit;
}

.el-q-option:hover {
  border-color: hsl(var(--el-primary));
  background: hsl(var(--el-primary) / 0.04);
}

.el-q-option.selected {
  border-color: hsl(var(--el-primary));
  background: hsl(var(--el-primary) / 0.08);
}

.el-q-option.correct {
  border-color: hsl(var(--el-success));
  background: hsl(var(--el-success) / 0.1);
  animation: el-flash-correct 0.5s ease;
}

.el-q-option.wrong {
  border-color: hsl(var(--el-danger));
  background: hsl(var(--el-danger) / 0.1);
  animation: el-flash-wrong 0.5s ease;
}

.el-q-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 14px;
  background: hsl(var(--el-primary-muted));
  color: hsl(var(--el-muted-foreground));
  flex-shrink: 0;
}

.el-q-option.selected .el-q-letter {
  background: hsl(var(--el-primary));
  color: var(--el-primary-foreground);
}

.el-q-option.correct .el-q-letter {
  background: hsl(var(--el-success));
  color: var(--el-primary-foreground);
}

.el-q-option.wrong .el-q-letter {
  background: hsl(var(--el-danger));
  color: var(--el-primary-foreground);
}

.el-q-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.el-q-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: var(--el-radius-sm);
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s;
  font-family: inherit;
}

.el-q-nav-btn.prev {
  background: hsl(var(--el-primary-muted));
  color: hsl(var(--el-muted-foreground));
}

.el-q-nav-btn.prev:hover {
  background: hsl(var(--el-primary-muted) / 0.8);
}

.el-q-nav-btn.next {
  background: hsl(var(--el-primary));
  color: var(--el-primary-foreground);
}

.el-q-nav-btn.next:hover {
  opacity: 0.9;
}

.el-q-nav-btn.submit {
  background: hsl(var(--el-success));
  color: var(--el-primary-foreground);
}

.el-q-nav-btn.submit:hover {
  opacity: 0.9;
}

.el-q-nav-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

@keyframes el-flash-correct {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

@keyframes el-flash-wrong {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* ─── Quiz Leaderboard Sidebar ─── */

.el-lb-sidebar {
  width: 240px;
  border-left: 1px solid hsl(var(--el-border));
  padding: 16px;
  background: hsl(var(--el-primary-muted) / 0.5);
  flex-shrink: 0;
  overflow-y: auto;
}

.el-lb-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.el-lb-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.el-lb-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  background: transparent;
  transition: background 0.2s;
}

.el-lb-entry.gold {
  background: hsl(48 96% 53% / 0.1);
}

.el-lb-entry.silver {
  background: hsl(var(--el-success) / 0.05);
}

.el-lb-entry.current {
  background: hsl(var(--el-primary) / 0.06);
  border: 2px solid hsl(var(--el-primary));
  font-weight: 600;
}

.el-lb-rank {
  font-size: 16px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.el-lb-rank-num {
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--el-muted-foreground));
}

.el-lb-group {
  flex: 1;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-lb-score {
  font-size: 13px;
  font-weight: 700;
  color: hsl(var(--el-primary));
}

.el-lb-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid hsl(var(--el-border));
  text-align: center;
  font-size: 11px;
  color: hsl(var(--el-muted-foreground));
}

.el-lb-live {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: hsl(var(--el-success));
  animation: el-pulse 1.5s infinite;
  margin-right: 4px;
}

@keyframes el-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ─── Quiz Result ─── */

.el-qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  text-align: center;
}

.el-qr-medal {
  font-size: 64px;
  margin-bottom: 8px;
}

.el-qr-rank {
  font-size: 24px;
  font-weight: 700;
}

.el-qr-group {
  font-size: 14px;
  color: hsl(var(--el-muted-foreground));
  margin-top: 4px;
  margin-bottom: 24px;
}

.el-qr-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 28px;
}

.el-qr-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-qr-stat-value {
  font-size: 28px;
  font-weight: 700;
  color: hsl(var(--el-primary));
}

.el-qr-stat-label {
  font-size: 12px;
  color: hsl(var(--el-muted-foreground));
}

.el-qr-board {
  width: 100%;
  max-width: 320px;
  padding: 16px;
  background: hsl(var(--el-primary-muted) / 0.5);
  border-radius: 12px;
  margin-bottom: 24px;
}

.el-qr-board-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.el-qr-board-list {
  font-size: 13px;
  line-height: 1.8;
  color: hsl(var(--el-muted-foreground));
}

.el-qr-board-highlight {
  font-weight: 700;
  color: hsl(var(--el-foreground));
}

.el-qr-back {
  padding: 12px 32px;
  border-radius: var(--el-radius-sm);
  border: none;
  background: hsl(var(--el-primary));
  color: var(--el-primary-foreground);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  font-family: inherit;
}

.el-qr-back:hover {
  opacity: 0.9;
}

/* ─── Classes Page (Teacher) ─── */

.el-cls-page {
  width: 100%;
}

.el-cls-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 22px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.el-cls-header h1 {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}

.el-cls-header p {
  color: hsl(var(--el-muted-foreground));
  font-size: 13.5px;
  margin-top: 5px;
}

.el-cls-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.el-cls-stat {
  display: flex;
  align-items: center;
  gap: 9px;
  background: hsl(var(--el-card));
  border: 1px solid hsl(var(--el-border));
  border-radius: 12px;
  padding: 9px 14px;
  box-shadow: var(--el-shadow-card);
}

.el-cls-stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.el-cls-stat-icon svg {
  width: 17px;
  height: 17px;
}

.el-cls-stat-icon[data-variant="coral"] {
  background: hsl(16 80% 94%);
  color: hsl(14 68% 52%);
}

.el-cls-stat-icon[data-variant="gold"] {
  background: hsl(38 90% 92%);
  color: hsl(35 82% 48%);
}

.el-cls-stat-icon[data-variant="teal"] {
  background: hsl(172 55% 92%);
  color: hsl(172 58% 38%);
}

.el-cls-stat-icon[data-variant="sky"] {
  background: hsl(202 80% 92%);
  color: hsl(202 72% 46%);
}

.el-cls-stat-num {
  font-size: 17px;
  font-weight: 800;
  line-height: 1;
}

.el-cls-stat-lbl {
  font-size: 11px;
  color: hsl(var(--el-muted-foreground));
  margin-top: 3px;
}

.el-cls-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.el-cls-tab {
  padding: 7px 18px;
  border-radius: var(--el-radius-pill);
  border: 1.5px solid hsl(var(--el-border));
  background: transparent;
  color: hsl(var(--el-muted-foreground));
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1;
  white-space: nowrap;
  font-family: inherit;
}

.el-cls-tab:hover {
  border-color: hsl(var(--el-primary) / 0.4);
  color: hsl(var(--el-primary));
  background: hsl(var(--el-primary-muted));
}

.el-cls-tab.active {
  border-color: hsl(var(--el-primary));
  background: hsl(var(--el-primary));
  color: var(--el-primary-foreground);
}

.el-cls-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.el-cls-card {
  border-radius: 16px;
  border: 1px solid hsl(var(--el-border));
  background: hsl(var(--el-card));
  overflow: hidden;
  box-shadow: var(--el-shadow-card);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  cursor: pointer;
  position: relative;
  color: inherit;
  text-decoration: none;
}

.el-cls-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 12px 32px -12px hsl(222 47% 11% / 0.18),
    0 0 0 1px hsl(var(--el-primary) / 0.15);
}

.el-cls-card.archived {
  opacity: 0.65;
}

.el-cls-card.archived:hover {
  opacity: 1;
}

.el-cls-card-top {
  padding: 16px 16px 14px;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.el-cls-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 11px 4px 10px;
  border-radius: var(--el-radius-pill);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.el-cls-badge svg {
  width: 14px;
  height: 14px;
}

.el-cls-badge[data-grade="1"] {
  background: hsl(16 80% 93%);
  color: hsl(14 62% 44%);
}

.el-cls-badge[data-grade="2"] {
  background: hsl(38 86% 90%);
  color: hsl(34 74% 42%);
}

.el-cls-badge[data-grade="3"] {
  background: hsl(172 50% 90%);
  color: hsl(172 56% 32%);
}

.el-cls-badge[data-grade="4"] {
  background: hsl(202 74% 90%);
  color: hsl(202 64% 38%);
}

.el-cls-badge[data-grade="5"] {
  background: hsl(262 52% 92%);
  color: hsl(262 54% 46%);
}

.el-cls-archived-badge {
  padding: 3px 10px;
  border-radius: var(--el-radius-pill);
  font-size: 11px;
  font-weight: 600;
  background: hsl(var(--el-primary-muted));
  color: hsl(var(--el-muted-foreground));
  border: 1px solid hsl(var(--el-border));
  line-height: 1;
}

.el-cls-card-body {
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.el-cls-name {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
}

.el-cls-teacher {
  font-size: 12.5px;
  color: hsl(var(--el-muted-foreground));
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
}

.el-cls-teacher svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  opacity: 0.7;
}

.el-cls-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.el-cls-meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: hsl(var(--el-muted-foreground));
  font-weight: 500;
}

.el-cls-meta-item svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.el-cls-quiz-section {
  border-top: 1px solid hsl(var(--el-border));
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.el-cls-quiz-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: hsl(var(--el-muted-foreground));
  font-weight: 500;
}

.el-cls-quiz-info svg {
  width: 14px;
  height: 14px;
  color: hsl(var(--el-primary));
}

.el-cls-score {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: hsl(38 82% 44%);
}

.el-cls-score svg {
  width: 14px;
  height: 14px;
}

.el-cls-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 8px;
  color: hsl(var(--el-muted-foreground));
}

.el-cls-empty svg {
  width: 40px;
  height: 40px;
  opacity: 0.4;
  margin-bottom: 4px;
}

.el-cls-empty p {
  font-size: 14px;
  font-weight: 500;
}

/* ─── Student Classes Page ─── */

.el-scls-page {
  width: 100%;
}

.el-scls-header {
  margin-bottom: 24px;
}

.el-scls-header h1 {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}

.el-scls-header p {
  color: hsl(var(--el-muted-foreground));
  font-size: 13.5px;
  margin-top: 5px;
}

.el-scls-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.el-scls-card {
  background: hsl(var(--el-card));
  border: 1px solid hsl(var(--el-border));
  border-radius: var(--el-radius);
  box-shadow: var(--el-shadow-card);
  overflow: hidden;
}

.el-scls-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  gap: 12px;
}

.el-scls-card-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.el-scls-grade {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: var(--el-radius-pill);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.el-scls-grade[data-grade="1"] {
  background: hsl(16 80% 93%);
  color: hsl(14 62% 44%);
}

.el-scls-grade[data-grade="2"] {
  background: hsl(38 86% 90%);
  color: hsl(34 74% 42%);
}

.el-scls-grade[data-grade="3"] {
  background: hsl(172 50% 90%);
  color: hsl(172 56% 32%);
}

.el-scls-grade[data-grade="4"] {
  background: hsl(202 74% 90%);
  color: hsl(202 64% 38%);
}

.el-scls-grade[data-grade="5"] {
  background: hsl(262 52% 92%);
  color: hsl(262 54% 46%);
}

.el-scls-class-name {
  font-size: 17px;
  font-weight: 700;
}

.el-scls-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.el-scls-meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: hsl(var(--el-muted-foreground));
  font-weight: 500;
}

.el-scls-meta-item svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.el-scls-score-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 14px;
  border-radius: 12px;
  background: hsl(var(--el-amber) / 0.08);
  border: 1px solid hsl(var(--el-amber) / 0.2);
}

.el-scls-score-value {
  font-size: 20px;
  font-weight: 800;
  color: hsl(var(--el-amber));
  line-height: 1;
}

.el-scls-score-label {
  font-size: 10px;
  color: hsl(var(--el-muted-foreground));
  margin-top: 2px;
}

.el-scls-stats-row {
  display: flex;
  gap: 8px;
  padding: 0 20px;
  margin-bottom: 12px;
}

.el-scls-stat-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--el-radius-sm);
  font-size: 12px;
  font-weight: 600;
  flex: 1;
}

.el-scls-stat-chip.teal {
  background: hsl(var(--el-teal) / 0.08);
  color: hsl(var(--el-teal));
  border: 1px solid hsl(var(--el-teal) / 0.15);
}

.el-scls-stat-chip.gold {
  background: hsl(var(--el-amber) / 0.08);
  color: hsl(var(--el-amber));
  border: 1px solid hsl(var(--el-amber) / 0.15);
}

.el-scls-stat-chip.primary {
  background: hsl(var(--el-primary-muted));
  color: hsl(var(--el-primary));
  border: 1px solid hsl(var(--el-primary) / 0.15);
}

.el-scls-section {
  padding: 12px 20px;
  border-top: 1px solid hsl(var(--el-border));
}

.el-scls-section-title {
  font-size: 13px;
  font-weight: 700;
  color: hsl(var(--el-foreground));
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.el-scls-lesson-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.el-scls-lesson {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: 13px;
}

.el-scls-lesson-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.el-scls-lesson-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-size: 12px;
}

.el-scls-lesson-icon.done {
  background: hsl(var(--el-success) / 0.1);
  color: hsl(var(--el-success));
}

.el-scls-lesson-icon.pending {
  background: hsl(var(--el-muted-foreground) / 0.1);
  color: hsl(var(--el-muted-foreground));
}

.el-scls-lesson-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: hsl(var(--el-foreground));
  font-weight: 500;
}

.el-scls-lesson-score {
  font-weight: 700;
  white-space: nowrap;
  font-size: 12px;
}

.el-scls-lesson-score.excellent {
  color: hsl(var(--el-success));
}

.el-scls-lesson-score.good {
  color: hsl(var(--el-info));
}

.el-scls-lesson-score.average {
  color: hsl(var(--el-warning));
}

.el-scls-classmates {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.el-scls-classmate {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 4px;
  border-radius: var(--el-radius-pill);
  background: hsl(var(--el-primary-muted));
  font-size: 12px;
}

.el-scls-classmate-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: hsl(var(--el-primary));
  color: var(--el-primary-foreground);
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 700;
}

.el-scls-classmate-name {
  font-weight: 500;
  color: hsl(var(--el-foreground));
}

/* ─── Groups Page ─── */

.el-grp-page {
  width: 100%;
}

.el-grp-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 22px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.el-grp-header h1 {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}

.el-grp-header p {
  color: hsl(var(--el-muted-foreground));
  font-size: 13.5px;
  margin-top: 5px;
}

.el-grp-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  margin-bottom: 16px;
}

.el-grp-breadcrumb a {
  color: hsl(var(--el-primary));
  text-decoration: none;
  font-weight: 500;
}

.el-grp-breadcrumb a:hover {
  text-decoration: underline;
}

.el-grp-breadcrumb-sep {
  color: hsl(var(--el-muted-foreground));
}

.el-grp-breadcrumb-current {
  color: hsl(var(--el-foreground));
  font-weight: 600;
}

.el-grp-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.el-grp-stat {
  display: flex;
  align-items: center;
  gap: 9px;
  background: hsl(var(--el-card));
  border: 1px solid hsl(var(--el-border));
  border-radius: 12px;
  padding: 9px 14px;
  box-shadow: var(--el-shadow-card);
}

.el-grp-stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.el-grp-stat-icon svg {
  width: 17px;
  height: 17px;
}

.el-grp-stat-icon[data-variant="indigo"] {
  background: hsl(var(--el-primary-muted));
  color: hsl(var(--el-primary));
}

.el-grp-stat-icon[data-variant="teal"] {
  background: hsl(var(--el-teal) / 0.1);
  color: hsl(var(--el-teal));
}

.el-grp-stat-icon[data-variant="amber"] {
  background: hsl(var(--el-amber) / 0.1);
  color: hsl(var(--el-amber));
}

.el-grp-stat-icon[data-variant="sky"] {
  background: hsl(var(--el-info) / 0.1);
  color: hsl(var(--el-info));
}

.el-grp-stat-icon[data-variant="green"] {
  background: hsl(var(--el-success) / 0.1);
  color: hsl(var(--el-success));
}

.el-grp-stat-num {
  font-size: 17px;
  font-weight: 800;
  line-height: 1;
}

.el-grp-stat-lbl {
  font-size: 11px;
  color: hsl(var(--el-muted-foreground));
  margin-top: 3px;
}

.el-grp-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.el-grp-status-tab {
  padding: 7px 18px;
  border-radius: var(--el-radius-pill);
  border: 1.5px solid hsl(var(--el-border));
  background: transparent;
  color: hsl(var(--el-muted-foreground));
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1;
  white-space: nowrap;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.el-grp-status-tab:hover {
  border-color: hsl(var(--el-primary) / 0.4);
  color: hsl(var(--el-primary));
  background: hsl(var(--el-primary-muted));
}

.el-grp-status-tab.active {
  border-color: hsl(var(--el-primary));
  background: hsl(var(--el-primary));
  color: var(--el-primary-foreground);
}

.el-grp-status-tab-count {
  font-size: 11px;
  opacity: 0.7;
}

.el-grp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.el-grp-card {
  border-radius: 16px;
  border: 1px solid hsl(var(--el-border));
  background: hsl(var(--el-card));
  overflow: hidden;
  box-shadow: var(--el-shadow-card);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  position: relative;
}

.el-grp-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 12px 32px -12px hsl(222 47% 11% / 0.18),
    0 0 0 1px hsl(var(--el-primary) / 0.15);
}

.el-grp-card-top {
  padding: 16px 16px 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.el-grp-status-badge {
  padding: 3px 10px;
  border-radius: var(--el-radius-pill);
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.el-grp-status-badge.active {
  background: hsl(var(--el-success) / 0.1);
  color: hsl(var(--el-success));
}

.el-grp-status-badge.waiting {
  background: hsl(var(--el-warning) / 0.1);
  color: hsl(var(--el-warning));
}

.el-grp-card-body {
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.el-grp-members {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.el-grp-member {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 4px;
  border-radius: var(--el-radius-pill);
  background: hsl(var(--el-primary-muted));
  font-size: 12px;
}

.el-grp-member-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 700;
  color: white;
}

.el-grp-member-avatar[data-idx="0"] {
  background: hsl(var(--el-primary));
}

.el-grp-member-avatar[data-idx="1"] {
  background: hsl(var(--el-info));
}

.el-grp-member-avatar[data-idx="2"] {
  background: hsl(var(--el-success));
}

.el-grp-member-avatar[data-idx="3"] {
  background: hsl(var(--el-warning));
}

.el-grp-member-avatar[data-idx="4"] {
  background: hsl(var(--el-rose));
}

.el-grp-member-name {
  font-weight: 500;
  color: hsl(var(--el-foreground));
}

.el-grp-member-empty {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 4px;
  border-radius: var(--el-radius-pill);
  border: 1px dashed hsl(var(--el-border));
  font-size: 12px;
  color: hsl(var(--el-muted-foreground));
}

.el-grp-member-empty-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px dashed hsl(var(--el-border));
  display: grid;
  place-items: center;
  font-size: 10px;
  color: hsl(var(--el-muted-foreground));
}

.el-grp-quiz-section {
  border-top: 1px solid hsl(var(--el-border));
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.el-grp-quiz-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: hsl(var(--el-muted-foreground));
  font-weight: 500;
}

.el-grp-quiz-left svg {
  width: 14px;
  height: 14px;
  color: hsl(var(--el-primary));
}

.el-grp-quiz-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
  max-width: 160px;
}

.el-grp-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 8px;
  color: hsl(var(--el-muted-foreground));
}

.el-grp-empty svg {
  width: 40px;
  height: 40px;
  opacity: 0.4;
  margin-bottom: 4px;
}

.el-grp-empty p {
  font-size: 14px;
  font-weight: 500;
}

/* ─── Dashboard Grid Helpers ─── */

.el-dash-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.el-dash-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  align-items: stretch;
}

/* ─── Responsive ─── */

@media (max-width: 1320px) {
  .el-content {
    grid-template-columns: 1fr;
  }

  .el-rail {
    order: -1;
  }

  .el-cls-grid,
  .el-grp-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .el-dash-grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 980px) {
  .el-app {
    grid-template-columns: 1fr;
  }

  .el-main {
    margin-left: 0;
  }

  .el-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 60;
    width: min(88vw, 320px);
    height: 100dvh;
    transform: translateX(-100%);
    transition: transform 0.24s ease;
  }

  .el-sidebar.open {
    transform: translateX(0);
  }

  .el-sidebar-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: hsl(222 47% 11% / 0);
    opacity: 0;
    transition: opacity 0.2s ease, background 0.2s ease;
    pointer-events: none;
  }

  .el-sidebar-backdrop.visible {
    pointer-events: auto;
    background: hsl(222 47% 11% / 0.38);
    opacity: 1;
  }

  .el-menu-btn {
    display: flex;
  }

  .el-cls-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .el-grp-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .el-lb-sidebar {
    display: none;
  }
}

@media (max-width: 680px) {
  .el-content {
    padding: 18px 14px 32px;
  }

  .el-cls-grid,
  .el-grp-grid {
    grid-template-columns: 1fr;
  }

  .el-cls-tabs,
  .el-grp-filters {
    gap: 4px;
  }

  .el-cls-tab,
  .el-grp-status-tab {
    padding: 6px 14px;
    font-size: 12px;
  }

  .el-cls-header {
    margin-bottom: 18px;
  }

  .el-cls-header h1,
  .el-grp-header h1,
  .el-scls-header h1 {
    font-size: 22px;
  }

  .el-dash-grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .el-dash-grid-2 {
    grid-template-columns: 1fr;
  }

  .el-quiz-area {
    padding: 16px;
  }
}

/* ─── Default: hide desktop-only elements ─── */

.el-menu-btn {
  display: none;
}
```

- [ ] **Step 2: Verify CSS file has no syntax errors**

Run: `npx stylelint app/elementary.css 2>/dev/null || echo "stylelint not configured — manual review done"`

If stylelint is not configured, visually scan the file for unmatched braces, missing semicolons, or unclosed comments.

Expected: No CSS syntax errors.

- [ ] **Step 3: Commit**

```bash
git add app/elementary.css
git commit -m "feat(elementary): create elementary.css with full class system"
```

---

### Task 2: Update Layouts to Import CSS + Add `.elementary-app` Wrapper

**Files:**
- Modify: `app/elementary-student/layout.tsx`
- Modify: `app/elementary-teacher/layout.tsx`

- [ ] **Step 1: Update student layout**

Replace the full content of `app/elementary-student/layout.tsx`:

```tsx
import type { ReactNode } from "react"
import "@/app/elementary.css"
import { ElementaryStudentShell } from "@/components/elementary-student-shell"

export default function ElementaryStudentLayout({
  children,
}: {
  children: ReactNode
}) {
  return <ElementaryStudentShell>{children}</ElementaryStudentShell>
}
```

- [ ] **Step 2: Update teacher layout**

Replace the full content of `app/elementary-teacher/layout.tsx`:

```tsx
import type { ReactNode } from "react"
import "@/app/elementary.css"
import { ElementaryTeacherShell } from "@/components/elementary-teacher-shell"

export default function ElementaryTeacherLayout({
  children,
}: {
  children: ReactNode
}) {
  return <ElementaryTeacherShell>{children}</ElementaryTeacherShell>
}
```

- [ ] **Step 3: Commit**

```bash
git add app/elementary-student/layout.tsx app/elementary-teacher/layout.tsx
git commit -m "feat(elementary): import elementary.css in both layouts"
```

---

### Task 3: Migrate Student Shell Component

**Files:**
- Modify: `components/elementary-student-shell.tsx`
- Delete: `components/elementary-student-shell.module.css`

- [ ] **Step 1: Rewrite the student shell component**

Replace the full content of `components/elementary-student-shell.tsx`:

```tsx
"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  GraduationCapIcon,
  ChevronLeftIcon,
  HomeIcon,
  UsersIcon,
  PenSquareIcon,
  StarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/elementary-student", label: "Trang chủ", icon: HomeIcon },
  { href: "/elementary-student/classes", label: "Lớp của mình", icon: UsersIcon },
  { href: "/elementary-student/groups", label: "Nhóm của mình", icon: UsersIcon },
  { href: "/elementary-student/quiz", label: "Bài quiz", icon: PenSquareIcon },
  { href: "/elementary-student/results", label: "Kết quả", icon: StarIcon },
]

export function ElementaryStudentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="elementary-app">
      <div className="el-app">
        {/* Sidebar */}
        <aside className="el-sidebar">
          <div className="el-brand">
            <div className="el-brand-mark">
              <GraduationCapIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="el-brand-name">LMS Tiểu học</div>
              <div className="el-brand-sub">Học sinh</div>
            </div>
          </div>

          <nav className="el-nav">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === "/elementary-student"
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("el-nav-item", isActive && "active")}
                >
                  <Icon className="el-nav-icon" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="el-footer">
            <Link href="/" className="el-footer-link">
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Về trang chủ</span>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="el-main">
          <main className="el-content">{children}</main>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Delete the student shell CSS module**

```bash
rm components/elementary-student-shell.module.css
```

- [ ] **Step 3: Commit**

```bash
git add components/elementary-student-shell.tsx components/elementary-student-shell.module.css
git commit -m "feat(elementary): migrate student shell to el- classes"
```

---

### Task 4: Migrate Teacher Shell Component

**Files:**
- Modify: `components/elementary-teacher-shell.tsx`
- Delete: `components/elementary-teacher-shell.module.css`

- [ ] **Step 1: Rewrite the teacher shell component**

Replace the full content of `components/elementary-teacher-shell.tsx`:

```tsx
"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpenIcon,
  ChevronLeftIcon,
  GraduationCapIcon,
  LogOutIcon,
  PenSquareIcon,
  SettingsIcon,
  UsersIcon,
  UserPlusIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/elementary-teacher", label: "Tổng quan", icon: GraduationCapIcon },
  { href: "/elementary-teacher/classes", label: "Lớp học", icon: UsersIcon },
  { href: "/elementary-teacher/groups", label: "Nhóm học", icon: UserPlusIcon },
  { href: "/elementary-teacher/quizzes", label: "Bài quiz", icon: PenSquareIcon },
  { href: "/elementary-teacher/documents", label: "Tài liệu", icon: BookOpenIcon },
]

export function ElementaryTeacherShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="elementary-app">
      <div className="el-app">
        {/* Sidebar */}
        <aside className="el-sidebar">
          <div className="el-brand">
            <div className="el-brand-mark">
              <BookOpenIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="el-brand-name">LMS Tiểu học</div>
              <div className="el-brand-sub">Giáo viên</div>
            </div>
          </div>

          <nav className="el-nav">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === "/elementary-teacher"
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("el-nav-item", isActive && "active")}
                >
                  <Icon className="el-nav-icon" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="el-footer">
            <Link href="/" className="el-footer-link">
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Về trang chủ</span>
            </Link>
            <button type="button" className="el-footer-btn">
              <SettingsIcon className="h-4 w-4" />
              <span>Cài đặt</span>
            </button>
            <button type="button" className="el-footer-btn">
              <LogOutIcon className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="el-main">
          <main className="el-content">{children}</main>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Delete the teacher shell CSS module**

```bash
rm components/elementary-teacher-shell.module.css
```

- [ ] **Step 3: Commit**

```bash
git add components/elementary-teacher-shell.tsx components/elementary-teacher-shell.module.css
git commit -m "feat(elementary): migrate teacher shell to el- classes"
```

---

### Task 5: Migrate Quiz Components

**Files:**
- Modify: `features/elementary/quiz/components/quiz-page.tsx`
- Modify: `features/elementary/quiz/components/quiz-question.tsx`
- Modify: `features/elementary/quiz/components/quiz-result.tsx`
- Modify: `features/elementary/quiz/components/quiz-leaderboard.tsx`
- Delete: `features/elementary/quiz/components/quiz-page.module.css`
- Delete: `features/elementary/quiz/components/quiz-question.module.css`
- Delete: `features/elementary/quiz/components/quiz-result.module.css`
- Delete: `features/elementary/quiz/components/quiz-leaderboard.module.css`

- [ ] **Step 1: Rewrite quiz-page.tsx**

Replace the full content of `features/elementary/quiz/components/quiz-page.tsx`:

```tsx
"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { QuizTimer } from "./quiz-timer"
import { QuizQuestion } from "./quiz-question"
import { QuizLeaderboard } from "./quiz-leaderboard"
import { QuizResult } from "./quiz-result"
import { useQuizQuestions } from "../hooks/use-quiz-questions"
import { useQuizAnswers } from "../hooks/use-quiz-answers"
import { useLeaderboard } from "../hooks/use-leaderboard"
import { useQuizTimer } from "../hooks/use-quiz-timer"
import { MOCK_QUIZ_ID, QUIZ_DURATION_SECONDS } from "../mock/quiz.mock"
import type { QuizStatus } from "../types/quiz.types"

interface QuizPageProps {
  groupId?: string
  classId?: string
}

export function QuizPage({ groupId = "g-1-1-01", classId = "1-1" }: QuizPageProps) {
  const router = useRouter()
  const [status, setStatus] = useState<QuizStatus>("loading")
  const [currentIdx, setCurrentIdx] = useState(0)

  const { questions } = useQuizQuestions(MOCK_QUIZ_ID)

  const { allAnswers, groupAnswers, submitAnswer } = useQuizAnswers(
    MOCK_QUIZ_ID,
    groupId
  )

  const { leaderboard, currentRank } = useLeaderboard(allAnswers, groupId)

  const answeredMap = useMemo(() => {
    const map = new Map<string, { selectedOption: number; isCorrect: boolean }>()
    const sorted = [...groupAnswers]
      .filter((a) => a.answeredAt && typeof a.answeredAt.toMillis === "function")
      .sort(
        (a, b) => a.answeredAt.toMillis() - b.answeredAt.toMillis()
      )
    for (const answer of sorted) {
      map.set(answer.questionId, {
        selectedOption: answer.selectedOption,
        isCorrect: answer.isCorrect,
      })
    }
    return map
  }, [groupAnswers])

  const handleTimeUp = useCallback(() => {
    setStatus("result")
  }, [])

  const { timeRemaining, isWarning, start, stop } = useQuizTimer(
    QUIZ_DURATION_SECONDS,
    handleTimeUp
  )

  useMemo(() => {
    if (questions.length > 0 && status === "loading") {
      setStatus("active")
      start()
    }
  }, [questions, status, start])

  const currentQuestion = questions[currentIdx]

  const handleSelect = useCallback(
    async (optionIndex: number) => {
      if (!currentQuestion) return
      const isCorrect = currentQuestion.options[optionIndex].isCorrect
      await submitAnswer(currentQuestion.id, optionIndex, isCorrect)
    },
    [currentQuestion, submitAnswer]
  )

  const handlePrev = useCallback(() => {
    setCurrentIdx((i) => Math.max(0, i - 1))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))
  }, [questions.length])

  const handleSubmit = useCallback(() => {
    stop()
    setStatus("result")
  }, [stop])

  const handleBackToGroups = useCallback(() => {
    router.push(`/elementary-student/groups?class=${classId}`)
  }, [router, classId])

  if (status === "loading" || !currentQuestion) {
    return (
      <div className="el-quiz-page">
        <div className="el-loading">
          <div className="el-spinner" />
          <span>Đang tải câu hỏi...</span>
        </div>
      </div>
    )
  }

  if (status === "result") {
    const currentGroup = leaderboard.find((e) => e.groupId === groupId)
    return (
      <div className="el-quiz-page">
        <QuizResult
          rank={currentRank}
          score={currentGroup?.score ?? 0}
          correctCount={currentGroup?.correctCount ?? 0}
          totalTime={currentGroup?.totalTime ?? 0}
          groupName={currentGroup?.groupName ?? "Nhóm của bạn"}
          leaderboard={leaderboard}
          onBackToGroups={handleBackToGroups}
        />
      </div>
    )
  }

  const answer = answeredMap.get(currentQuestion.id)
  const selectedIndex = answer?.selectedOption ?? -1
  const answeredCount = answeredMap.size

  return (
    <div className="el-quiz-page">
      <div className="el-quiz-area">
        <div className="el-quiz-header">
          <span style={{ fontSize: 14, color: "hsl(var(--el-muted-foreground))" }}>
            Nhóm {groupId.split("-").pop()}
          </span>
          <QuizTimer timeRemaining={timeRemaining} isWarning={isWarning} />
        </div>

        <div className="el-quiz-progress">
          <div
            className="el-quiz-progress-fill"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>

        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentIdx + 1}
          totalQuestions={questions.length}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          onPrev={handlePrev}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isLast={currentIdx === questions.length - 1}
          isFirst={currentIdx === 0}
          allAnswered={answeredCount === questions.length}
        />
      </div>

      <QuizLeaderboard
        leaderboard={leaderboard}
        currentGroupId={groupId}
      />
    </div>
  )
}
```

- [ ] **Step 2: Rewrite quiz-question.tsx**

Replace the full content of `features/elementary/quiz/components/quiz-question.tsx`:

```tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeftIcon, ChevronRightIcon, SendIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuizQuestion as QuizQuestionType } from "../types/quiz.types"

const OPTION_LETTERS = ["A", "B", "C", "D"]

interface QuizQuestionProps {
  question: QuizQuestionType
  questionNumber: number
  totalQuestions: number
  selectedIndex: number
  onSelect: (optionIndex: number) => void
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
  isLast: boolean
  isFirst: boolean
  allAnswered: boolean
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  onSelect,
  onPrev,
  onNext,
  onSubmit,
  isLast,
  isFirst,
  allAnswered,
}: QuizQuestionProps) {
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)

  useEffect(() => {
    setFeedback(null)
  }, [question.id])

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (feedback !== null) return
      onSelect(optionIndex)
      const isCorrect = question.options[optionIndex].isCorrect
      setFeedback(isCorrect ? "correct" : "wrong")
    },
    [feedback, onSelect, question.options]
  )

  return (
    <div className="el-q-card">
      <div className="el-q-header">
        <span className="el-q-num">
          Câu <strong>{questionNumber}</strong> / {totalQuestions}
        </span>
      </div>

      <div className="el-q-content">{question.content}</div>

      <div className="el-q-options">
        {question.options.map((option, idx) => {
          let optionClass = "el-q-option"
          if (idx === selectedIndex) {
            if (feedback === "correct") optionClass = cn("el-q-option", "correct")
            else if (feedback === "wrong") optionClass = cn("el-q-option", "wrong")
            else optionClass = cn("el-q-option", "selected")
          }

          return (
            <button
              key={idx}
              type="button"
              className={optionClass}
              onClick={() => handleSelect(idx)}
              disabled={feedback !== null}
            >
              <span className="el-q-letter">{OPTION_LETTERS[idx]}</span>
              <span>{option.content}</span>
            </button>
          )
        })}
      </div>

      <div className="el-q-nav">
        <button
          type="button"
          className={cn("el-q-nav-btn", "prev", isFirst && "disabled")}
          onClick={onPrev}
          disabled={isFirst}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Câu trước
        </button>

        {isLast && allAnswered ? (
          <button
            type="button"
            className={cn("el-q-nav-btn", "submit")}
            onClick={onSubmit}
          >
            Nộp bài
            <SendIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            className={cn("el-q-nav-btn", "next")}
            onClick={onNext}
          >
            Câu tiếp
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite quiz-result.tsx**

Replace the full content of `features/elementary/quiz/components/quiz-result.tsx`:

```tsx
"use client"

import type { LeaderboardEntry } from "../types/quiz.types"

const MEDALS = ["🥇", "🥈", "🥉"]

interface QuizResultProps {
  rank: number
  score: number
  correctCount: number
  totalTime: number
  groupName: string
  leaderboard: LeaderboardEntry[]
  onBackToGroups: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function QuizResult({
  rank,
  score,
  correctCount,
  totalTime,
  groupName,
  leaderboard,
  onBackToGroups,
}: QuizResultProps) {
  const medal = rank <= 3 ? MEDALS[rank - 1] : null

  return (
    <div className="el-qr-container">
      <div className="el-qr-medal">{medal || "🎯"}</div>

      <div className="el-qr-rank">Xếp hạng #{rank}</div>
      <div className="el-qr-group">{groupName}</div>

      <div className="el-qr-stats">
        <div className="el-qr-stat">
          <div className="el-qr-stat-value">{score}</div>
          <div className="el-qr-stat-label">điểm</div>
        </div>
        <div className="el-qr-stat">
          <div className="el-qr-stat-value">{correctCount}/10</div>
          <div className="el-qr-stat-label">đúng</div>
        </div>
        <div className="el-qr-stat">
          <div className="el-qr-stat-value">{formatTime(totalTime)}</div>
          <div className="el-qr-stat-label">thời gian</div>
        </div>
      </div>

      <div className="el-qr-board">
        <div className="el-qr-board-title">🏆 Bảng xếp hạng cuối cùng</div>
        <div className="el-qr-board-list">
          {leaderboard.slice(0, 5).map((entry) => {
            const m = entry.rank <= 3 ? MEDALS[entry.rank - 1] : `${entry.rank}.`
            const isCurrent = entry.groupId === groupName
            return (
              <div key={entry.groupId}>
                {m}{" "}
                <span className={isCurrent ? "el-qr-board-highlight" : undefined}>
                  {entry.groupName}
                </span>{" "}
                — {entry.score} điểm
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        className="el-qr-back"
        onClick={onBackToGroups}
      >
        Về danh sách nhóm
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Rewrite quiz-leaderboard.tsx**

Replace the full content of `features/elementary/quiz/components/quiz-leaderboard.tsx`:

```tsx
"use client"

import type { LeaderboardEntry } from "../types/quiz.types"
import { cn } from "@/lib/utils"

const MEDALS = ["🥇", "🥈", "🥉"]

interface QuizLeaderboardProps {
  leaderboard: LeaderboardEntry[]
  currentGroupId: string
}

export function QuizLeaderboard({
  leaderboard,
  currentGroupId,
}: QuizLeaderboardProps) {
  return (
    <div className="el-lb-sidebar">
      <div className="el-lb-title">
        🏆 Bảng xếp hạng
      </div>

      <div className="el-lb-list">
        {leaderboard.map((entry) => {
          const isCurrent = entry.groupId === currentGroupId
          const medal = entry.rank <= 3 ? MEDALS[entry.rank - 1] : null

          return (
            <div
              key={entry.groupId}
              className={cn(
                "el-lb-entry",
                entry.rank === 1 && "gold",
                entry.rank === 2 && !isCurrent && "silver",
                isCurrent && "current"
              )}
            >
              <span className="el-lb-rank">
                {medal || <span className="el-lb-rank-num">{entry.rank}</span>}
              </span>
              <span className="el-lb-group">
                {entry.groupName}
                {isCurrent && " (bạn)"}
              </span>
              <span className="el-lb-score">{entry.score}</span>
            </div>
          )
        })}

        {leaderboard.length === 0 && (
          <div style={{ textAlign: "center", padding: "16px 0", fontSize: 13, color: "hsl(var(--el-muted-foreground))" }}>
            Chưa có dữ liệu
          </div>
        )}
      </div>

      <div className="el-lb-footer">
        <span className="el-lb-live" />
        Cập nhật realtime
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Delete all quiz CSS modules**

```bash
rm features/elementary/quiz/components/quiz-page.module.css \
   features/elementary/quiz/components/quiz-question.module.css \
   features/elementary/quiz/components/quiz-result.module.css \
   features/elementary/quiz/components/quiz-leaderboard.module.css
```

- [ ] **Step 6: Verify build compiles**

Run: `npm run build 2>&1 | tail -20`

Expected: Build succeeds with no "Module not found" errors for the deleted CSS modules.

- [ ] **Step 7: Commit**

```bash
git add -A features/elementary/quiz/
git commit -m "feat(elementary): migrate quiz components to el- classes"
```

---

### Task 6: Migrate Classes Page (Teacher)

**Files:**
- Modify: `features/elementary/classes/components/classes-page.tsx`
- Delete: `features/elementary/classes/components/classes-page.module.css`

- [ ] **Step 1: Rewrite classes-page.tsx**

Replace the full content of `features/elementary/classes/components/classes-page.tsx`:

```tsx
"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  BookCheckIcon,
  BookOpenIcon,
  GraduationCapIcon,
  SchoolIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { allClasses, grades, summary } from "@/features/elementary/classes/mock"
import type { GradeLevel } from "@/features/elementary/classes/mock"

const gradeEmoji: Record<GradeLevel, string> = {
  1: "🐣",
  2: "🐥",
  3: "🦊",
  4: "🐯",
  5: "🦅",
}

export function ClassesPage() {
  const [activeGrade, setActiveGrade] = useState<GradeLevel | "all">("all")

  const filtered = useMemo(
    () =>
      activeGrade === "all"
        ? allClasses
        : allClasses.filter((c) => c.grade === activeGrade),
    [activeGrade]
  )

  return (
    <div className="el-cls-page">
      <div className="el-cls-header">
        <div>
          <h1>Danh sách lớp</h1>
          <p>
            Quản lý lớp học và theo dõi kết quả bài quiz · Năm học 2025–2026
          </p>
        </div>

        <div className="el-cls-stats">
          <div className="el-cls-stat">
            <div className="el-cls-stat-icon" data-variant="coral">
              <SchoolIcon />
            </div>
            <div>
              <div className="el-cls-stat-num">{summary.totalClasses}</div>
              <div className="el-cls-stat-lbl">Lớp</div>
            </div>
          </div>

          <div className="el-cls-stat">
            <div className="el-cls-stat-icon" data-variant="gold">
              <UsersIcon />
            </div>
            <div>
              <div className="el-cls-stat-num">{summary.totalStudents}</div>
              <div className="el-cls-stat-lbl">Học sinh</div>
            </div>
          </div>

          <div className="el-cls-stat">
            <div className="el-cls-stat-icon" data-variant="teal">
              <BookCheckIcon />
            </div>
            <div>
              <div className="el-cls-stat-num">
                {summary.totalQuizzesCompleted}/{summary.totalQuizzesAssigned}
              </div>
              <div className="el-cls-stat-lbl">Bài quiz</div>
            </div>
          </div>

          <div className="el-cls-stat">
            <div className="el-cls-stat-icon" data-variant="sky">
              <GraduationCapIcon />
            </div>
            <div>
              <div className="el-cls-stat-num">{summary.avgCompletionRate}%</div>
              <div className="el-cls-stat-lbl">HT rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="el-cls-tabs">
        <button
          type="button"
          className={cn("el-cls-tab", activeGrade === "all" && "active")}
          onClick={() => setActiveGrade("all")}
        >
          Tất cả
        </button>
        {grades.map((g) => (
          <button
            key={g.level}
            type="button"
            className={cn(
              "el-cls-tab",
              activeGrade === g.level && "active"
            )}
            onClick={() => setActiveGrade(g.level)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="el-cls-grid">
          {filtered.map((cls) => {
            const pct = Math.round(
              (cls.completedQuizzes / cls.totalQuizzes) * 100
            )

            return (
              <Link
                href={`/elementary-teacher/groups?class=${cls.id}`}
                key={cls.id}
                className={cn(
                  "el-cls-card",
                  cls.status === "archived" && "archived"
                )}
              >
                <div className="el-cls-card-top">
                  <span className="el-cls-badge" data-grade={cls.grade}>
                    {gradeEmoji[cls.grade]} Lớp {cls.grade}
                  </span>
                  {cls.status === "archived" && (
                    <span className="el-cls-archived-badge">Đã kết thúc</span>
                  )}
                </div>

                <div className="el-cls-card-body">
                  <div>
                    <div className="el-cls-name">
                      Lớp {cls.grade}/{cls.classNumber}
                    </div>
                    <div className="el-cls-teacher">
                      <UsersIcon />
                      GVCN: {cls.homeroomTeacher}
                    </div>
                  </div>

                  <div className="el-cls-meta">
                    <span className="el-cls-meta-item">
                      <UsersIcon />
                      {cls.studentCount} học sinh
                    </span>
                    <span className="el-cls-meta-item">
                      <BookOpenIcon />
                      {cls.totalQuizzes} bài quiz
                    </span>
                  </div>
                </div>

                <div className="el-cls-quiz-section">
                  <div className="el-cls-quiz-info">
                    <BookCheckIcon />
                    <span>
                      {cls.completedQuizzes}/{cls.totalQuizzes} đã làm
                    </span>
                  </div>

                  <div className="el-progress">
                    <div className="el-progress-track">
                      <span
                        className="el-progress-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="el-progress-pct">{pct}%</span>
                  </div>

                  <div className="el-cls-score">
                    <StarIcon />
                    {cls.averageScore}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="el-cls-empty">
          <UsersIcon />
          <p>Không có lớp nào thuộc khối này.</p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Delete the CSS module**

```bash
rm features/elementary/classes/components/classes-page.module.css
```

- [ ] **Step 3: Commit**

```bash
git add features/elementary/classes/components/classes-page.tsx features/elementary/classes/components/classes-page.module.css
git commit -m "feat(elementary): migrate classes page (teacher) to el- classes"
```

---

### Task 7: Migrate Student Classes Page

**Files:**
- Modify: `features/elementary/classes/components/student-classes-page.tsx`
- Delete: `features/elementary/classes/components/student-classes-page.module.css`

- [ ] **Step 1: Read the current student-classes-page.tsx**

Read `features/elementary/classes/components/student-classes-page.tsx` to understand its full structure before rewriting.

- [ ] **Step 2: Read the current student-classes-page.module.css**

Read `features/elementary/classes/components/student-classes-page.module.css` to map all CSS module classes to `el-` equivalents.

- [ ] **Step 3: Rewrite the component**

Rewrite `features/elementary/classes/components/student-classes-page.tsx` replacing all `styles.*` references with corresponding `el-scls-*` classes. The key mappings:

| Old module class | New global class |
|-----------------|-----------------|
| `styles.pageWrap` | `"el-scls-page"` |
| `styles.header` | `"el-scls-header"` |
| `styles.classList` | `"el-scls-list"` |
| `styles.classCard` | `"el-scls-card"` |
| `styles.cardHeader` | `"el-scls-card-header"` |
| `styles.cardHeaderLeft` | `"el-scls-card-left"` |
| `styles.gradeBadge` | `"el-scls-grade"` |
| `styles.className` | `"el-scls-class-name"` |
| `styles.classMeta` | `"el-scls-meta"` |
| `styles.metaItem` | `"el-scls-meta-item"` |
| `styles.scoreBox` | `"el-scls-score-box"` |
| `styles.scoreValue` | `"el-scls-score-value"` |
| `styles.scoreLabel` | `"el-scls-score-label"` |
| `styles.statsRow` | `"el-scls-stats-row"` |
| `styles.statChip` | `"el-scls-stat-chip"` |
| `styles.section` | `"el-scls-section"` |
| `styles.sectionTitle` | `"el-scls-section-title"` |
| `styles.lessonList` | `"el-scls-lesson-list"` |
| `styles.lessonItem` | `"el-scls-lesson"` |
| `styles.lessonLeft` | `"el-scls-lesson-left"` |
| `styles.lessonIcon` | `"el-scls-lesson-icon"` |
| `styles.lessonIconDone` | `"el-scls-lesson-icon done"` |
| `styles.lessonIconPending` | `"el-scls-lesson-icon pending"` |
| `styles.lessonTitle` | `"el-scls-lesson-title"` |
| `styles.lessonScore` | `"el-scls-lesson-score"` |
| `styles.scoreExcellent` | `"el-scls-lesson-score excellent"` |
| `styles.scoreGood` | `"el-scls-lesson-score good"` |
| `styles.scoreAverage` | `"el-scls-lesson-score average"` |
| `styles.quizList` | `.el-scls-lesson-list` (reuse) |
| `styles.quizItem` | `"el-scls-lesson"` (reuse) |
| `styles.quizTitle` | `"el-scls-lesson-title"` |
| `styles.quizDate` | inline style `fontSize: 12, color: muted` |
| `styles.quizScore` | `"el-scls-lesson-score"` |
| `styles.classmateList` | `"el-scls-classmates"` |
| `styles.classmate` | `"el-scls-classmate"` |
| `styles.classmateAvatar` | `"el-scls-classmate-avatar"` |
| `styles.classmateName` | `"el-scls-classmate-name"` |
| `styles.titleGroup` | (use heading h1 inside el-scls-header) |
| `styles.classmateCount` | inline style `fontSize: 11, color: muted` |

Also remove the `import styles from "./student-classes-page.module.css"` line.

- [ ] **Step 4: Delete the CSS module**

```bash
rm features/elementary/classes/components/student-classes-page.module.css
```

- [ ] **Step 5: Commit**

```bash
git add features/elementary/classes/components/
git commit -m "feat(elementary): migrate student classes page to el- classes"
```

---

### Task 8: Migrate Groups Page

**Files:**
- Modify: `features/elementary/groups/components/groups-page.tsx`
- Delete: `features/elementary/groups/components/groups-page.module.css`

- [ ] **Step 1: Read the current groups-page.tsx and groups-page.module.css**

Read both files to understand the full structure and map all CSS module classes.

- [ ] **Step 2: Rewrite the component**

Rewrite `features/elementary/groups/components/groups-page.tsx` replacing all `styles.*` references with corresponding `el-grp-*` classes. The key mappings:

| Old module class | New global class |
|-----------------|-----------------|
| `styles.pageWrap` | `"el-grp-page"` |
| `styles.header` | `"el-grp-header"` |
| `styles.titleGroup` | (use h1 + p inside el-grp-header) |
| `styles.breadcrumb` | `"el-grp-breadcrumb"` |
| `styles.breadcrumbLink` | `"el-grp-breadcrumb a"` |
| `styles.breadcrumbSep` | `"el-grp-breadcrumb-sep"` |
| `styles.breadcrumbCurrent` | `"el-grp-breadcrumb-current"` |
| `styles.stats` | `"el-grp-stats"` |
| `styles.stat` | `"el-grp-stat"` |
| `styles.statIcon` | `"el-grp-stat-icon"` |
| `styles.statNum` | `"el-grp-stat-num"` |
| `styles.statLbl` | `"el-grp-stat-lbl"` |
| `styles.filters` | `"el-grp-filters"` |
| `styles.statusTabs` | `"el-grp-filters"` (same container) |
| `styles.statusTab` | `"el-grp-status-tab"` |
| `styles.statusTabActive` | `"el-grp-status-tab active"` |
| `styles.statusTabCount` | `"el-grp-status-tab-count"` |
| `styles.grid` | `"el-grp-grid"` |
| `styles.card` | `"el-grp-card"` |
| `styles.cardTop` | `"el-grp-card-top"` |
| `styles.gradeBadge` | `"el-cls-badge"` (reuse from classes) |
| `styles.statusBadge` | `"el-grp-status-badge"` |
| `styles.statusBadgeActive` | `"el-grp-status-badge active"` |
| `styles.statusBadgeWaiting` | `"el-grp-status-badge waiting"` |
| `styles.cardBody` | `"el-grp-card-body"` |
| `styles.className` | `"el-cls-name"` (reuse) |
| `styles.members` | `"el-grp-members"` |
| `styles.member` | `"el-grp-member"` |
| `styles.memberAvatar` | `"el-grp-member-avatar"` |
| `styles.memberName` | `"el-grp-member-name"` |
| `styles.memberId` | inline style |
| `styles.memberEmptySlot` | `"el-grp-member-empty"` |
| `styles.memberEmptyAvatar` | `"el-grp-member-empty-avatar"` |
| `styles.memberEmptyLabel` | (text inside memberEmptySlot) |
| `styles.quizSection` | `"el-grp-quiz-section"` |
| `styles.quizLeft` | `"el-grp-quiz-left"` |
| `styles.quizRight` | `"el-grp-quiz-right"` (use el-progress inside) |
| `styles.quizProgress` | (use el-progress components) |
| `styles.quizTrack` | `"el-progress-track"` |
| `styles.quizTrackFill` | `"el-progress-fill"` |
| `styles.quizPct` | `"el-progress-pct"` |
| `styles.score` | `"el-cls-score"` (reuse) |
| `styles.scoreEmpty` | `"el-cls-score"` + inline `opacity: 0.4` |
| `styles.empty` | `"el-grp-empty"` |

Also remove the `import styles from "./groups-page.module.css"` line.

- [ ] **Step 3: Delete the CSS module**

```bash
rm features/elementary/groups/components/groups-page.module.css
```

- [ ] **Step 4: Commit**

```bash
git add features/elementary/groups/components/
git commit -m "feat(elementary): migrate groups page to el- classes"
```

---

### Task 9: Update Student Dashboard Page Routes

**Files:**
- Modify: `app/elementary-student/dashboard/page.tsx`
- Modify: `app/elementary-teacher/dashboard/page.tsx`

These pages use global CSS classes like `col-main` and `rail` which will no longer exist once globals.css is not in scope. Replace with `el-` equivalents.

- [ ] **Step 1: Update student dashboard page**

In `app/elementary-student/dashboard/page.tsx`:
- Replace `className="col-main"` with `className="el-col-main"`
- Replace Tailwind grid classes `grid grid-cols-4 gap-4 max-[1320px]:grid-cols-2 max-[680px]:grid-cols-2` with `className="el-dash-grid-4"`
- Replace `grid grid-cols-2 items-stretch gap-5 max-[980px]:grid-cols-1` with `className="el-dash-grid-2"`

- [ ] **Step 2: Update teacher dashboard page**

In `app/elementary-teacher/dashboard/page.tsx`:
- Same replacements as the student dashboard page.

- [ ] **Step 3: Commit**

```bash
git add app/elementary-student/dashboard/page.tsx app/elementary-teacher/dashboard/page.tsx
git commit -m "feat(elementary): update dashboard pages to use el- grid classes"
```

---

### Task 10: Final Build Verification

- [ ] **Step 1: Run full build**

```bash
npm run build 2>&1 | tail -30
```

Expected: Build completes successfully. No errors about missing CSS modules or undefined classes.

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: No TypeScript errors.

- [ ] **Step 3: Verify no remaining CSS module imports**

```bash
grep -r "from.*module.css" features/elementary/ components/elementary-*
```

Expected: No output — all CSS module imports have been removed.

- [ ] **Step 4: Verify no orphaned CSS module files**

```bash
find features/elementary/ components/ -name "*.module.css" -type f
```

Expected: No output — all CSS module files have been deleted.

- [ ] **Step 5: Commit any remaining fixes**

If any fixes were needed during verification, commit them:

```bash
git add -A
git commit -m "fix(elementary): post-migration cleanup"
```
