# Seed Data & Entity Relationship Cleanup

**Date:** 2026-06-19
**Status:** Approved for implementation
**Scope:** Full cleanup — entity re-ID, auth/roles/schools, seed consolidation

---

## 1. Mục tiêu

- Chuẩn hóa ID convention cho toàn bộ Firestore collections
- Thêm các collection còn thiếu: `schools`, `levels`, `roles`, `users`, `quizQuestions`
- Xây dựng cơ chế login phân biệt role (elementary-teacher, student, admin)
- Tập trung seed data về một nơi duy nhất, xoá mock files phân tán

---

## 2. Entity Model & ID Convention

| Collection | ID format | Example | Notes |
|---|---|---|---|
| `schools` | `school_{n}` | `school_1` | Sequential, global |
| `levels` | `level_{n}` | `level_1`, `level_2`, ... | Sequential, global (1–5) |
| `roles` | `role_{name}` | `role_student`, `role_elementary_teacher`, `role_admin` | Named semantic |
| `users` | `user_{n}` | `user_1` | Sequential, global |
| `classes` | `class_{level}_{n}` | `class_3_1` | Level + class-number |
| `lessons` | `lesson_{n}` | `lesson_1` | Sequential, global (1–8) |
| `quizzes` | `quiz_{lessonId}_{n}` | `quiz_lesson_3_1`, `quiz_lesson_3_2` | LessonId + quiz-number |
| `questions` | `question_{n}` | `question_1` | Sequential, global (1–160) |
| `quizQuestions` | `{quizId}__{questionId}` | `quiz_lesson_3_1__question_5` | Bridge, composite |
| `groups` | `group_{classId}_{nn}` | `group_class_3_1_01` | ClassId + 2-digit number |
| `classLessons` | `{classId}__{lessonId}` | `class_3_1__lesson_3` | Bridge, composite |
| `groupLessons` | `{groupId}__{lessonId}` | `group_class_3_1_01__lesson_3` | Bridge, composite |
| `answers` | `{groupId}__{quizId}__{questionId}` | `group_class_3_1_01__quiz_lesson_3_1__question_5` | Bridge, composite |

### Quy tắc chung

- Entity gốc (school, level, role, user, lesson, question): dung số thứ tự toàn cục (`_1`, `_2`...)
- Entity quan hệ / bridge: composite ID dùng `__` (2 underscores) làm separator
- Entity có phân cấp (class, group, quiz): prefix từ parent ID, separator là `_` duy nhất

### School fields

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | `school_1` |
| `name` | `string` | "Trường Tiểu học Số 1" |
| `address` | `string` | (optional) |

### Level fields

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | `level_1` |
| `grade` | `number` | 1–5 |
| `label` | `string` | "Khối 1" → "Khối 5" |

### Role fields

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | `role_student` |
| `name` | `string` | `"student"`, `"elementary-teacher"`, `"admin"`, `"staff"` |

### User fields

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | `user_1` |
| `name` | `string` | Full name |
| `email` | `string` | Login credential |
| `password` | `string` | Plain text (seed phase; future → Firebase Auth) |
| `schoolId` | `string` | Reference to `schools` |
| `roles` | `string[]` | `["role_student"]` or `["role_elementary_teacher"]` |
| `classId` | `string`? | Nếu là student, reference `classes` |
| `classIds` | `string[]`? | Nếu là teacher, danh sách class được phân công |

### QuizQuestion fields

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Composite: `{quizId}__{questionId}` |
| `quizId` | `string` | Reference `quizzes` |
| `questionId` | `string` | Reference `questions` |
| `order` | `number` | Thứ tự câu hỏi trong quiz |

**Tác động:** Hook `useQuizQuestions` hiện query `collection(db, "questions")` with `where("quizId", "==", quizId)`. Cần chuyển sang query `quizQuestions` → join với `questions`. Hoặc giữ nguyên cách hiện tại (questions có field quizId) và chỉ thêm `quizQuestions` làm bridge cho future flexibility. Chọn: **giữ nguyên cách query questions có quizId**, `quizQuestions` là collection phụ dùng sau.

---

## 3. Auth Flow & Role-Based Routing

### Login Flow

```
User → Login Form (email + password)
  → query users where email == email
  → compare password
  → if match: set cookie (userId, name, roles[], schoolId)
  → redirect based on first role:
      role_student         → /elementary-student
      role_elementary_teacher → /elementary-teacher
      role_admin           → /admin
      role_staff           → /staff
```

### Session Management

- Cookie-based session, signed bằng `jose` (JWT)
- Cookie name: `session`
- Payload: `{ userId, name, roles, schoolId }`
- Expiry: 24h
- Secret: dùng env var `SESSION_SECRET` (fallback: hardcode cho seed phase)

### Proxy Pattern

Dùng Next.js **proxy** (rewrites/redirects trong `next.config`), không dùng Middleware:

```js
// next.config.js hoặc next.config.ts
const nextConfig = {
  async rewrites() {
    return [
      // Nếu cần proxy API
    ]
  },
  // Auth check qua client-side hoặc server component check cookie
}
```

- Route protection: dùng layout-level check ở `app/elementary-student/layout.tsx` và `app/elementary-teacher/layout.tsx`
- Mỗi layout đọc cookie session, nếu không có → redirect `/login`
- Nếu sai role → redirect về portal đúng

### Seed Users

| Name | Email | Password | Role | Class | School |
|---|---|---|---|---|---|
| Nguyễn Thị Mai | `mai.nguyen@school.edu.vn` | `123456` | elementary-teacher | class_3_1, class_3_2 | school_1 |
| Đỗ Thị Lan | `lan.do@school.edu.vn` | `123456` | elementary-teacher | class_3_1 | school_1 |
| Trần Minh Tuấn | `tuan.tran@student.edu.vn` | `123456` | student | class_3_1 | school_1 |
| Lê Thị Hương | `huong.le@student.edu.vn` | `123456` | student | class_3_1 | school_1 |
| Root Admin | `admin@school.edu.vn` | `147258369` | admin | — | school_1 |

---

## 4. Seed Data Consolidation

### Single Source of Truth

- **Giữ:** `features/admin/seed/seed-data.ts` — mọi seed data tập trung ở đây
- **Xoá mock files riêng lẻ** (sau khi seed hoạt động và hook query từ Firestore):

| File | Lý do |
|---|---|
| `features/elementary/classes/mock/classes.mock.ts` | Hook `useClasses` query Firestore trực tiếp |
| `features/elementary/classes/mock/student-classes.mock.ts` | Hook `useStudentClass` computed từ real data |
| `features/elementary/classes/mock/index.ts` | Re-export file, xoá theo |
| `features/elementary/groups/mock/groups.mock.ts` | Hook `useGroupsByClass` query trực tiếp |
| `features/elementary/groups/mock/student-groups.mock.ts` | Dùng real data |
| `features/elementary/groups/mock/index.ts` | Re-export file |
| `features/elementary/quiz/mock/quiz.mock.ts` | Mock leaderboard, sẽ chuyển sang real data |
| `features/elementary/quiz/mock/index.ts` | Re-export file |
| `features/elementary/dashboard/mock/dashboard.mock.ts` | Teacher dashboard mock → chuyển sang hook |
| `features/elementary/dashboard/mock/student-dashboard.mock.ts` | Student dashboard mock → chuyển sang hook |
| `features/elementary/dashboard/mock/index.ts` | Re-export file |

### Seed Order

```
1. schools        ← độc lập
2. levels         ← độc lập
3. roles          ← độc lập
4. lessons        ← độc lập
5. classes        ← phụ thuộc levels (qua grade)
6. users          ← phụ thuộc schools, roles, classes
7. quizzes        ← phụ thuộc lessons
8. questions      ← độc lập
9. quizQuestions  ← phụ thuộc quizzes, questions
10. classLessons  ← phụ thuộc classes, lessons
11. groups        ← phụ thuộc classes
12. groupLessons  ← phụ thuộc groups, lessons
13. answers       ← phụ thuộc groups, quizzes, questions
```

### Data Volume

| Collection | Count | Notes |
|---|---|---|
| `schools` | 1 | |
| `levels` | 5 | Khối 1→5 |
| `roles` | 4 | student, elementary-teacher, admin, staff |
| `users` | 5 | 1 admin, 2 teachers, 2 students |
| `lessons` | 8 | Giữ nguyên |
| `classes` | 15 | 5 grade × 3 class mỗi grade |
| `quizzes` | 16 | 8 lessons × 2 quizzes |
| `questions` | 160 | 16 quizzes × 10 questions |
| `quizQuestions` | 160 | 1:1 với questions hiện tại (bridge) |
| `classLessons` | 120 | 15 classes × 8 lessons |
| `groups` | 300 | 15 classes × 20 groups |
| `groupLessons` | 2,400 | 300 groups × 8 lessons |
| `answers` | 40 | 4 groups × 10 questions (sample leaderboard) |

---

## 5. Component Migration: từ Mock sang Hook

### Teacher Dashboard Components (còn dùng mock trực tiếp)

| Component | Mock hiện tại | Chuyển sang |
|---|---|---|
| `today-schedule.tsx` | `from "@/features/elementary/dashboard/mock"` | Schedule data → Firestore `schedules` collection? Hiện chưa có schedule entity. **Giữ mock tạm**, ghi chú future work. |
| `teacher-quick-actions.tsx` | `quickActions` | Static UI config → giữ nguyên (không phải data domain) |
| `class-overview-card.tsx` | `studentHighlights` | Data từ `useClasses` + `useGroupsByClass` |
| `recent-submissions.tsx` | `recentActivities` | Data từ `useGroupLessons` + `useQuizAnswers` |
| `teacher-dashboard-rail.tsx` | `lessons` | Data từ `useLessons` |

### Teacher Groups Page Components

| Component | Mock hiện tại | Chuyển sang |
|---|---|---|
| `groups-page.tsx` | `allClasses`, `allGroups`, `getSummary` | `useClasses` + `useGroupsByClass` |

### Teacher Classes Page

| Component | Mock hiện tại | Chuyển sang |
|---|---|---|
| `classes-page.tsx` | `allClasses`, `grades`, `summary` | `useClasses` |

---

## 6. Login Implementation

### Files thay đổi / tạo mới

| File | Action | Notes |
|---|---|---|
| `features/auth/mock/auth-mock.ts` | Xoá | Không cần mock auth nữa |
| `features/auth/schemas/login.schema.ts` | Giữ | Zod schema vẫn dùng được |
| `features/auth/components/login-form.tsx` | Sửa | Gọi Firestore thay vì mock |
| `lib/auth/session.ts` | **Tạo mới** | Sign/verify JWT cookie helpers |
| `lib/auth/index.ts` | **Tạo mới** | Re-export |

### Cookie Helpers (`lib/auth/session.ts`)

```typescript
import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "seed-phase-secret-key-2026"
)

export interface SessionPayload {
  userId: string
  name: string
  roles: string[]
  schoolId: string
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret)
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
```

---

## 7. Firestore Hook Updates

### Thay đổi ID references trong hooks

Các hook hiện tại query bằng ID string — không cần sửa logic, chỉ seed data thay đổi ID. Tuy nhiên cần đảm bảo:

| Hook | Collection | Filter | ID mới ảnh hưởng? |
|---|---|---|---|
| `useClasses` | `classes` | none | Không — chỉ đổi ID doc |
| `useLessons` | `lessons` | none | Không |
| `useClassLessons` | `classLessons` | `classId` | Cần đảm bảo classId mới khớp |
| `useGroupsByClass` | `groups` | `classId` | Cần đảm bảo classId mới khớp |
| `useGroupLessons` | `groupLessons` | `classId`, `lessonId` | Cần đảm bảo classId/lessonId mới |
| `useQuizQuestions` | `questions` | `quizId` | Cần đảm bảo quizId mới |
| `useLeaderboard` | N/A | computed | Dùng groupId mới |
| `useQuizAnswers` | `answers` | `quizId` | Cần đảm bảo quizId mới |

→ Không cần sửa logic hook, chỉ cần seed data đúng ID.

### Hook `useStudentClass`

Hook này computed data từ nhiều nguồn. Không cần sửa logic — chỉ ID thay đổi trong seed.

---

## 8. Non-Goals (Giữ lại cho future)

- **Firebase Auth** — chưa tích hợp, dùng plain password + JWT cookie tạm
- **Schedule entity** — chưa có Firestore collection cho timetable, mock `todaySchedule` giữ nguyên
- **Real-time notifications** — mock notifications vẫn giữ
- **Courses feature** — mock courses vẫn giữ (không thuộc phạm vi elementary)
- **Staff feature** — mock staff classes vẫn giữ (không thuộc phạm vi)
- **Calendars, Tasks, Assignments** — mock files ở các feature này không đụng tới

---

## 9. Implementation Plan

Sẽ được tạo bởi skill writing-plans sau khi spec được approve. Dự kiến các bước lớn:

1. Cập nhật `seed-data.ts` — thêm collections mới, đổi ID
2. Tạo `lib/auth/session.ts`
3. Sửa `login-form.tsx` — login thật từ Firestore
4. Sửa layout files để check session + redirect theo role
5. Cập nhật `seed-page.tsx` — thêm seed cho collections mới
6. Xoá mock files cũ
7. Cập nhật teacher components dùng hook thay mock
8. Seed thử và verify
