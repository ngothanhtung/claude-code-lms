# Spec: Login với NextAuth + Google Identity OAuth

## Objective

Bổ sung tính năng đăng nhập Google OAuth vào hệ thống auth hiện có (NextAuth v5 + Credentials provider), đồng thời thêm middleware bảo vệ route cho toàn bộ student portal.

**User stories:**

- Là user, mình muốn đăng nhập bằng tài khoản Google để không cần nhớ thêm username/password
- Là user, mình muốn vẫn có thể đăng nhập bằng username/password (cho admin/test)
- Là user, nếu chưa đăng nhập mình sẽ bị redirect về trang login
- Là user, sau khi login thành công mình được đưa về trang trước đó (callbackUrl)

**Acceptance criteria:**

- [ ] Nút "Đăng nhập bằng Google" trên form login, khi click thì redirect sang Google OAuth
- [ ] Sau khi Google OAuth thành công, user được redirect về callbackUrl (mặc định `/dashboard`)
- [ ] Credentials login vẫn hoạt động như hiện tại
- [ ] Session hiển thị đúng user info (tên, avatar Google nếu có)
- [ ] Middleware chặn toàn bộ route `/dashboard`, `/assignments`, `/courses`, v.v. — redirect về `/login` nếu chưa authenticated
- [ ] Trang `/login`, `/register`, `/forgot-password`, `/api/auth/*` không bị chặn
- [ ] Nút "Đăng xuất" hoạt động đúng — xoá session và redirect về `/login`
- [ ] Build không có lỗi TypeScript

## Tech Stack

| Library           | Version                  | Purpose            |
| ----------------- | ------------------------ | ------------------ |
| `next`            | 16.2.6                   | Framework          |
| `next-auth`       | `^5.0.0-beta.31`         | Auth (NextAuth v5) |
| `@auth/core`      | (bundled with next-auth) | Core auth logic    |
| `zod`             | `^4.4.3`                 | Schema validation  |
| `react-hook-form` | `^7.79.0`                | Form handling      |

**Không thêm dependency mới** — NextAuth v5 đã hỗ trợ Google provider qua `@auth/google` hoặc config trực tiếp.

## Commands

```sh
npm run dev          # Dev server http://localhost:3000
npm run build        # Production build — must pass
npm run lint         # ESLint
npm run typecheck    # TypeScript check (noEmit)
```

## Project Structure

```
auth.ts                              # NextAuth v5 config (MODIFY — thêm Google provider)
middleware.ts                         # NEW — Route protection
app/(auth)/
  login/
    page.tsx                         # Existing — render LoginForm
  layout.tsx                         # Existing — auth layout
app/(student)/
  layout.tsx                         # Existing — student shell
app/api/auth/
  [...nextauth]/route.ts             # Existing — NextAuth catch-all
features/auth/
  components/
    login-form.tsx                   # MODIFY — thêm nút "Đăng nhập bằng Google"
    auth-buttons.tsx                 # NEW — Social login buttons (Google)
  schemas/login.schema.ts           # Existing — không đổi
  mock/auth-mock.ts                  # MODIFY — mở rộng mock user list (optional)
components/
  auth-session-provider.tsx         # Existing — không đổi
lib/
  firebase/client.ts                # Existing — không đổi (analytics only)
.env.local                          # MODIFY — thêm GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
.env.example                        # MODIFY — thêm biến Google
```

## Code Style

**Login form — thêm Google button:**

```tsx
// features/auth/components/login-form.tsx
// Thêm section "or" divider + Google button sau form credentials

import { AuthButtons } from "./auth-buttons"
// ... sau form submit button:
<div className="relative my-4">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
  </div>
</div>
<AuthButtons />
```

**Social auth button component:**

```tsx
// features/auth/components/auth-buttons.tsx
"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function AuthButtons() {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      {/* Google SVG icon */}
      Đăng nhập bằng Google
    </Button>
  )
}
```

**NextAuth Google provider config:**

```ts
// auth.ts — thêm Google provider
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({ /* existing */ }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // ...existing config
})
```

**Middleware route protection:**

```ts
// middleware.ts
export { auth as middleware } from "./auth"

export const config = {
  matcher: [
    // Bảo vệ tất cả route trừ auth pages, API auth, và static assets
    "/((?!login|register|forgot-password|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
```

**Naming conventions:**

- Component files: `kebab-case.tsx`
- Hooks: `use-*.ts` prefix
- Mock data: `*-mock.ts`
- Schemas: `*.schema.ts`
- Feature dirs: flat `features/<domain>/components/`

## Testing Strategy

**Framework:** Không thêm test framework mới cho spec này — scope nhỏ, verify bằng:

1. `npm run typecheck` — không lỗi TypeScript
2. `npm run build` — build thành công
3. `npm run lint` — không lỗi ESLint
4. Manual testing trên browser:
   - Click "Đăng nhập bằng Google" → redirect sang Google → callback thành công → về `/dashboard`
   - Credentials login vẫn hoạt động
   - Truy cập `/dashboard` khi chưa login → redirect `/login`
   - Logout → redirect `/login`

## Boundaries

### Always

- Giữ nguyên Credentials provider hiện tại — không sửa authorize logic
- `AUTH_SECRET` phải có trong `.env.local`
- Google OAuth redirect URI phải đúng format: `http://localhost:3000/api/auth/callback/google`
- Session strategy giữ JWT (không đổi sang database sessions)
- Vietnamese UI text cho tất cả label mới

### Ask First

- Thêm Google OAuth credentials mới vào `.env.local` (cần tạo OAuth 2.0 client trên Google Cloud Console)
- Đổi matcher pattern trong middleware (có thể chặn nhầm route)
- Thêm providers mới ngoài Google (Facebook, GitHub, etc.)

### Never

- Không commit `.env.local` (có secrets)
- Không hardcode Google Client ID/Secret trong code
- Không sửa `app/api/auth/[...nextauth]/route.ts` (NextAuth v5 handles it)
- Không thêm Firebase Auth — project dùng NextAuth
- Không đổi session strategy sang database

## Environment Variables

Thêm vào `.env.local` và `.env.example`:

```env
# Google OAuth (tạo tại: https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Google Cloud Console setup (manual steps cho user):**

1. Tạo project mới hoặc chọn project có sẵn trên https://console.cloud.google.com
2. Bật "Google+ API" hoặc "Google Identity" API
3. Tạo OAuth 2.0 Client ID (Application type: Web application)
4. Thêm Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID và Client Secret vào `.env.local`

## Success Criteria

| #   | Criterion                       | Verify                                                              |
| --- | ------------------------------- | ------------------------------------------------------------------- |
| 1   | Google OAuth login hoạt động    | Click "Đăng nhập bằng Google" → redirect → callback → vào dashboard |
| 2   | Credentials login vẫn hoạt động | Nhập `root / 147258369` → vào dashboard                             |
| 3   | Session hiển thị đúng info      | Header/topbar hiển thị tên user (Google name hoặc mock name)        |
| 4   | Route protection hoạt động      | Truy cập `/dashboard` không login → redirect `/login`               |
| 5   | Auth pages không bị chặn        | `/login`, `/register`, `/forgot-password` accessible                |
| 6   | Logout hoạt động                | Click logout → session clear → redirect `/login`                    |
| 7   | Build pass                      | `npm run build` không lỗi                                           |
| 8   | TypeScript pass                 | `npm run typecheck` không lỗi                                       |

## Open Questions

1. **Đăng ký mới (register)** — có cần implement trang `/register` trong spec này không, hay để task riêng?
2. **Avatar Google** — hiển thị avatar từ Google profile trên topbar nếu có?
3. **Linked accounts** — nếu user đăng nhập bằng cả Google và Credentials cùng email, có cần merge account không? (MVP: không cần)
4. **Callback URL whitelist** — hiện chỉ redirect về `/dashboard`, có cần whitelist các URL cụ thể không?
