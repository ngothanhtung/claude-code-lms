# Login Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a login page at `/login` with mock authentication (username: `ames`, password: `iloveames`) that redirects to `/dashboard`.

**Architecture:** Create a `features/auth/` domain folder with mock data and a client component, compose it in the existing thin page file and auth layout.

**Tech Stack:** Next.js 16 App Router, shadcn/ui (Input, Button, Label, Card), sonner toast, lucide-react icons, date-fns

---

### Task 1: Create mock authentication data

**Files:**
- Create: `features/auth/mock/auth-mock.ts`

- [ ] **Step 1: Write the mock file**

Create `features/auth/mock/auth-mock.ts`:

```typescript
export const MOCK_CREDENTIALS = {
  username: "ames",
  password: "iloveames",
}

export type MockLoginResult =
  | { success: true; user: { name: string } }
  | { success: false; error: string }

export async function mockLogin(
  username: string,
  password: string
): Promise<MockLoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (
    username === MOCK_CREDENTIALS.username &&
    password === MOCK_CREDENTIALS.password
  ) {
    return { success: true, user: { name: "ames" } }
  }

  return { success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng" }
}
```

- [ ] **Step 2: Commit**

```bash
git add features/auth/mock/auth-mock.ts
git commit -m "feat(auth): add mock authentication data and login function"
```

---

### Task 2: Create LoginForm component

**Files:**
- Create: `features/auth/components/login-form.tsx`

- [ ] **Step 1: Write the LoginForm client component**

Create `features/auth/components/login-form.tsx`:

```tsx
"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { mockLogin } from "@/features/auth/mock/auth-mock"

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!username.trim() || !password.trim()) return

    setLoading(true)

    const result = await mockLogin(username.trim(), password)

    if (result.success) {
      router.push("/dashboard")
    } else {
      toast.error(result.error)
      setPassword("")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>Nhập thông tin tài khoản để tiếp tục</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <LoaderCircle className="size-4 animate-spin" />}
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </Button>

          <div className="flex w-full items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Quên mật khẩu?
            </Link>
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Chưa có tài khoản? Đăng ký
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/auth/components/login-form.tsx
git commit -m "feat(auth): add LoginForm component with mock auth flow"
```

---

### Task 3: Wire up the login page

**Files:**
- Modify: `app/(auth)/login.tsx`

- [ ] **Step 1: Write the login page**

Replace content of `app/(auth)/login.tsx` with:

```tsx
import { LoginForm } from "@/features/auth/components/login-form"

export default function LoginPage() {
  return <LoginForm />
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build` or `npm run typecheck`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add app/(auth)/login.tsx
git commit -m "feat(auth): wire login page to LoginForm component"
```

---

### Self-Review Checklist

**Spec coverage:**
- Mock credentials `ames` / `iloveames` → Task 1
- `mockLogin()` with 800ms delay → Task 1
- Return shape `{ success, user }` or `{ success, error }` → Task 1
- LoginForm with 2 controlled fields (username + password) → Task 2
- Loading state (button disabled, spinner, inputs disabled) → Task 2
- Error state (toast, clear password) → Task 2
- Success redirect `/dashboard` → Task 2
- Links "Quên mật khẩu?" and "Chưa có tài khoản? Đăng ký" → Task 2
- Thin page composing `<LoginForm />` → Task 3
- Auth layout unchanged (already exists) → covered, no task needed

**Placeholder scan:** No TBD, TODO, or vague steps. Every step has complete code.

**Type consistency:** `mockLogin` signature matches usage — returns union type, destructured with `result.success`. `toast.error(result.error)` — `error` exists on the error variant. `router.push("/dashboard")` — correct Next.js API.
