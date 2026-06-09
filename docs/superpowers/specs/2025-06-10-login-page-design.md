# Login Page Design

**Date:** 2026-06-10
**Status:** Approved for implementation

## Overview

Build a login page at `/login` for the student portal. Uses mock authentication (username: `ames`, password: `iloveames`) and redirects to `/dashboard` on success.

## File Structure

```
features/auth/
├── mock/
│   └── auth-mock.ts
├── components/
│   └── login-form.tsx

app/(auth)/
├── layout.tsx                  — Already exists: centered flex container
└── login.tsx                   — Thin page composing <LoginForm />
```

## Authentication Mock (`features/auth/mock/auth-mock.ts`)

- Export `MOCK_CREDENTIALS = { username: "ames", password: "iloveames" }`
- Export `mockLogin(username: string, password: string): Promise<{ success: boolean; user?: { name: string }; error?: string }>`
- Simulate 800ms delay
- Validate against `MOCK_CREDENTIALS`
- Return `{ success: true, user: { name: "ames" } }` or `{ success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng" }`

## Login Form Component (`features/auth/components/login-form.tsx`)

- `"use client"` — Next.js client component
- Two controlled fields:
  - **Tên đăng nhập** — `Input` type=text, required
  - **Mật khẩu** — `Input` type=password, required
- Use `useRouter()` from `next/navigation` for redirect
- Use `sonner` toast (`toast.error(...)`) for error display

### States

| State | Behavior |
|-------|----------|
| **Idle** | Form ready, empty fields with placeholders, submit button enabled |
| **Loading** | Button disabled, shows spinner icon, inputs disabled |
| **Error** | Toast error "Tên đăng nhập hoặc mật khẩu không đúng", clear password field, re-enable form |
| **Success** | `router.push("/dashboard")` |

### Validation (client-side)

- Both fields required. Use HTML5 `required` attribute + inline check before calling mock.
- No email/format validation needed.

### Links Below Form

- "Quên mật khẩu?" → `/forgot-password`
- "Chưa có tài khoản? Đăng ký" → `/register`

### Keyboard Support

- Pressing Enter in any field submits the form (native `<form onSubmit>`)
- Tab order: username → password → submit button

## Page (`app/(auth)/login.tsx`)

- Server component (no `"use client"`)
- Imports and renders `<LoginForm />`
- No additional layout logic — the existing `AuthLayout` handles centering

## Auth Layout (`app/(auth)/layout.tsx` — already exists)

- `min-h-svh` flex container, `bg-background`
- Components are centered by default
- No changes needed

## Dependencies

- `Input`, `Button`, `Label` from `@/components/ui/` — already available
- `sonner` toast — already available (used elsewhere in the project)
- `lucide-react` (LoaderCircle for spinner) — already available
- `next/navigation` `useRouter` — framework built-in

## Not In Scope

- Persistent session (localStorage, cookies) — not needed for mock
- Logout — not part of this task
- API integration — mock will be replaced later
- Password visibility toggle — not requested
