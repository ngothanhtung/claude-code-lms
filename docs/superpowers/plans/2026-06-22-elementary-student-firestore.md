# Elementary Student — Switch Hardcoded Data to Firestore

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded/mock data in student-side elementary components with real Firestore data reads via existing and new hooks.

**Architecture:** The teacher side already reads Firestore correctly through hooks in `features/elementary/*/hooks/`. The student side was built with hardcoded mockups during prototyping. This plan wires student components to the same Firestore collections (`classes`, `classLessons`, `groups`, `groupLessons`, `lessons`, `quizzes`, `quizQuestions`, `questions`, `answers`, `users`) via a new `useStudentProfile` hook that resolves the logged-in user's `classId` and `groupId` from the `users` + `groups` collections. Components then consume real data.

**Tech Stack:** Next.js 16 App Router, React hooks, Firebase Firestore (client SDK), TypeScript, shadcn/ui, Tailwind v4

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `features/elementary/profile/hooks/use-student-profile.ts` | **Create** | Resolve current user → classId + groupId from Firestore |
| `features/elementary/quiz/hooks/use-quiz-questions.ts` | **Modify** | Fix `"image_choice"` type cast + map `imageUrl` |
| `features/elementary/groups/components/student-groups-page.tsx` | **Rewrite** | Replace hardcoded `myGroup` with Firestore data |
| `features/elementary/groups/components/student-group-rail.tsx` | **Rewrite** | Replace hardcoded `classGroupsRank` with Firestore data |
| `features/elementary/classes/components/student-class-rail.tsx` | **Modify** | Remove hardcoded leaderboard, derive rank from Firestore |
| `features/elementary/dashboard/components/student-dashboard-rail.tsx` | **Rewrite** | Replace hardcoded leaderboard/lesson progress/quizzes with Firestore |
| `features/elementary/dashboard/components/my-group-card.tsx` | **Rewrite** | Replace hardcoded group info with Firestore |
| `features/elementary/dashboard/components/recent-quiz-results.tsx` | **Rewrite** | Replace hardcoded quiz results with Firestore |
| `features/elementary/dashboard/components/student-stat-card.tsx` | **Rewrite** | Accept props from Firestore-derived data |
| `features/elementary/dashboard/components/student-schedule.tsx` | **Modify** | Derive schedule from current lesson in Firestore |
| `app/elementary-student/dashboard/page.tsx` | **Modify** | Wire Firestore data into stat cards and greeting |
| `app/elementary-student/groups/page.tsx` | **Modify** | Pass groupId/classId from profile |
| `app/elementary-student/classes/[id]/page.tsx` | **Rewrite** | Remove `generateStaticParams`, accept Firestore IDs |
| `features/elementary/quiz/components/quiz-page.tsx` | **Modify** | Dynamic quiz ID from lesson, not hardcoded constant |
| `features/elementary/quiz/constants/quiz.constants.ts` | **Delete** | No longer needed — quiz ID is dynamic |
| `features/elementary/classes/types/student-class.types.ts` | **Modify** | Add optional fields for classmates with scores |

---

## Task 1: Fix `useQuizQuestions` — type cast + imageUrl mapping

**Files:**
- Modify: `features/elementary/quiz/hooks/use-quiz-questions.ts:57,69,81`

This is a bug fix. The hook casts question type to `"quiz" | "fill_in_blank"` but seed data includes `"image_choice"`. It also drops `imageUrl` from the returned object.

- [ ] **Step 1: Fix the type cast on line 81 and add imageUrl**

Change the mapping block at lines 74–84. The `allQuestions` Map value type (line 57) must also include `imageUrl`.

```typescript
// Line 57: Update the Map value type
const allQuestions = new Map<string, {
  content: string
  type: string
  options: { content: string; isCorrect: boolean }[]
  imageUrl?: string
}>()
```

```typescript
// Line 69: Update the type assertion in the loop
for (const doc of snapshot.docs) {
  allQuestions.set(doc.id, doc.data() as {
    content: string
    type: string
    options: { content: string; isCorrect: boolean }[]
    imageUrl?: string
  })
}
```

```typescript
// Lines 74–84: Replace the mapping block entirely
const fetched: QuizQuestion[] = bridgeDocs
  .filter((b) => allQuestions.has(b.questionId))
  .map((b) => {
    const data = allQuestions.get(b.questionId)!
    return {
      id: b.questionId,
      content: data.content,
      type: data.type as "quiz" | "fill_in_blank" | "image_choice",
      options: data.options,
      imageUrl: data.imageUrl,
    }
  })
```

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add features/elementary/quiz/hooks/use-quiz-questions.ts
git commit -m "fix(quiz): add image_choice type cast and imageUrl mapping in useQuizQuestions"
```

---

## Task 2: Create `useStudentProfile` hook

**Files:**
- Create: `features/elementary/profile/hooks/use-student-profile.ts`

The logged-in user's ID comes from `useSession()` (NextAuth client). The `users` collection has a `classId` field for students. We query `groups` to find which group contains this student (by matching `members[].studentId`).

- [ ] **Step 1: Create the hook file**

```typescript
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"

export interface StudentProfile {
  userId: string
  name: string
  classId: string
  groupId: string | null
  groupIndex: number | null
}

interface UseStudentProfileReturn {
  profile: StudentProfile | null
  loading: boolean
  error: string | null
}

export function useStudentProfile(): UseStudentProfileReturn {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      if (status === "unauthenticated") {
        setLoading(false)
      }
      return
    }

    let cancelled = false

    async function fetchProfile() {
      try {
        setLoading(true)
        setError(null)

        const userId = session!.user.id!

        // 1. Read the user document to get classId
        const userQuery = query(
          collection(db, "users"),
          where("__name__", "==", userId)
        )
        const userSnapshot = await getDocs(userQuery)

        if (cancelled) return

        if (userSnapshot.empty) {
          setProfile(null)
          setLoading(false)
          return
        }

        const userData = userSnapshot.docs[0].data()
        const classId = userData.classId as string | undefined

        if (!classId) {
          setProfile({
            userId,
            name: session!.user.name ?? "",
            classId: "",
            groupId: null,
            groupIndex: null,
          })
          setLoading(false)
          return
        }

        // 2. Find the group that contains this student
        const groupsQuery = query(
          collection(db, "groups"),
          where("classId", "==", classId)
        )
        const groupsSnapshot = await getDocs(groupsQuery)

        if (cancelled) return

        let foundGroupId: string | null = null
        let foundGroupIndex: number | null = null

        groupsSnapshot.docs.forEach((groupDoc, groupIdx) => {
          const members = groupDoc.data().members as { name: string; studentId: string }[] ?? []
          // Match by studentId containing userId or by name matching session user
          const isMember = members.some(
            (m) => m.studentId === userId || m.name === session!.user.name
          )
          if (isMember) {
            foundGroupId = groupDoc.id
            // Extract group number from id like "group_class_3_1_02" → 2
            const parts = groupDoc.id.split("_")
            foundGroupIndex = parseInt(parts[parts.length - 1], 10) || null
          }
        })

        setProfile({
          userId,
          name: session!.user.name ?? "",
          classId,
          groupId: foundGroupId,
          groupIndex: foundGroupIndex,
        })
      } catch (err) {
        if (cancelled) return
        console.error("Failed to load student profile:", err)
        setError(err instanceof Error ? err.message : "Không thể tải thông tin học sinh")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProfile()
    return () => { cancelled = true }
  }, [session, status])

  return { profile, loading, error }
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add features/elementary/profile/hooks/use-student-profile.ts
git commit -m "feat(profile): add useStudentProfile hook to resolve classId and groupId from Firestore"
```

---

## Task 3: Fix student class detail route — remove hardcoded IDs

**Files:**
- Modify: `app/elementary-student/classes/[id]/page.tsx`

The current `generateStaticParams` returns IDs like `"3-1"` but Firestore uses `"class_3_1"`. Remove the static params function entirely so the route is fully dynamic.

- [ ] **Step 1: Replace the page file**

```typescript
import { StudentClassesPage } from "@/features/elementary/classes/components/student-classes-page"

export default async function ClassesRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StudentClassesPage classId={id} />
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/elementary-student/classes/\[id\]/page.tsx
git commit -m "fix(classes): remove hardcoded generateStaticParams, use dynamic Firestore class IDs"
```

---

## Task 4: Add classmates scores to `StudentClass` type and `useStudentClass`

**Files:**
- Modify: `features/elementary/classes/types/student-class.types.ts`
- Modify: `features/elementary/classes/hooks/use-student-class.ts`

The `student-class-rail` needs per-classmate scores for the leaderboard. Currently `classmates` only has `name` and `avatar`. Add an `averageScore` field derived from `groupLessons`.

- [ ] **Step 1: Add `averageScore` to `StudentClass.classmates` type**

```typescript
export interface StudentClass {
  id: string
  grade: number
  classNumber: number
  className: string
  homeroomTeacher: string
  studentCount: number
  totalLessons: number
  completedLessons: number
  averageScore: string
  lessons: {
    lessonNumber: number
    title: string
    score: number
    completed: boolean
  }[]
  recentQuizzes: {
    title: string
    score: number
    maxScore: number
    date: string
  }[]
  classmates: {
    name: string
    avatar: string
    averageScore: number
  }[]
}
```

- [ ] **Step 2: Update `useStudentClass` to compute per-classmate scores**

In `use-student-class.ts`, replace the classmates-building block (lines 86–98) with:

```typescript
    // 2. Build classmates — deduplicate by name across all groups
    //    and compute average score per member from groupLessons
    const memberScores = new Map<string, number[]>()
    const seen = new Set<string>()
    const classmates: { name: string; avatar: string; averageScore: number }[] = []

    for (const group of groups) {
      // Get groupLessons for this group that are completed
      const groupGl = groupLessons.filter(
        (gl) => gl.groupId === group.id && gl.status === "completed"
      )

      for (const member of group.members) {
        if (!seen.has(member.name)) {
          seen.add(member.name)

          // Average score of this member's group lessons
          const scores = groupGl.map((gl) => gl.score)
          const avgScore = scores.length > 0
            ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
            : 0

          classmates.push({
            name: member.name,
            avatar: member.studentId.slice(-2),
            averageScore: avgScore,
          })
        }
      }
    }
```

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add features/elementary/classes/types/student-class.types.ts features/elementary/classes/hooks/use-student-class.ts
git commit -m "feat(classes): add averageScore per classmate in StudentClass type and hook"
```

---

## Task 5: Rewrite student groups page with Firestore data

**Files:**
- Rewrite: `features/elementary/groups/components/student-groups-page.tsx`
- Rewrite: `features/elementary/groups/components/student-group-rail.tsx`

The page currently has a hardcoded `myGroup` object. Replace with `useStudentProfile` + `useGroupsByClass` + `useLessons` + `useGroupLessons`.

- [ ] **Step 1: Rewrite `student-groups-page.tsx`**

```typescript
"use client"

import {
  UsersIcon,
  StarIcon,
  BookCheckIcon,
  CheckCircleIcon,
  CircleIcon,
  ArrowRightIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useStudentProfile } from "@/features/elementary/profile/hooks/use-student-profile"
import { useGroupsByClass } from "@/features/elementary/quiz/hooks/use-groups"
import { useLessons } from "@/features/elementary/lessons/hooks/use-lessons"
import { useGroupLessons } from "@/features/elementary/groups/hooks/use-group-lessons"
import { StudentGroupRail } from "@/features/elementary/groups/components/student-group-rail"

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

export function StudentGroupsPage() {
  const { profile, loading: profileLoading } = useStudentProfile()
  const { groups, loading: groupsLoading } = useGroupsByClass(profile?.classId ?? null)
  const { lessons, loading: lessonsLoading } = useLessons()
  const { groupLessons, loading: glLoading } = useGroupLessons(profile?.classId ?? null)

  const loading = profileLoading || groupsLoading || lessonsLoading || glLoading

  // Find the student's group
  const myGroup = profile?.groupId
    ? groups.find((g) => g.id === profile.groupId)
    : null

  // Get group lessons for my group, sorted by lesson number
  const myGroupLessons = myGroup
    ? groupLessons
        .filter((gl) => gl.groupId === myGroup.id)
        .sort((a, b) => {
          const aLesson = lessons.find((l) => l.id === a.lessonId)
          const bLesson = lessons.find((l) => l.id === b.lessonId)
          return (aLesson?.lessonNumber ?? 0) - (bLesson?.lessonNumber ?? 0)
        })
    : []

  // Find next pending quiz (first incomplete lesson)
  const nextPendingLesson = lessons
    .slice()
    .sort((a, b) => a.lessonNumber - b.lessonNumber)
    .find((lesson) => {
      const gl = myGroupLessons.find((gl) => gl.lessonId === lesson.id)
      return !gl || gl.status === "pending"
    })

  // Find the quiz for the next pending lesson
  // We'll link to the quiz page with class + group params
  const quizHref = myGroup && profile?.classId
    ? `/elementary-student/quiz?class=${profile.classId}&group=${myGroup.id}`
    : "/elementary-student/quiz"

  if (loading) {
    return (
      <div className="el-col-main">
        <div className="el-loading">
          <div className="el-spinner" />
          <span>Đang tải thông tin nhóm...</span>
        </div>
      </div>
    )
  }

  if (!profile || !myGroup) {
    return (
      <div className="el-col-main">
        <div className="el-sgrp-header">
          <div>
            <h1>Nhóm của mình</h1>
            <p>Bạn chưa được phân vào nhóm nào.</p>
          </div>
        </div>
      </div>
    )
  }

  const quizPct = myGroup.totalQuizzes > 0
    ? Math.round((myGroup.completedQuizzes / myGroup.totalQuizzes) * 100)
    : 0

  return (
    <>
      <div className="el-col-main">
        {/* Header */}
        <div className="el-sgrp-header">
          <div>
            <h1>Nhóm của mình</h1>
            <p>Lớp {myGroup.className} · Năm học 2025–2026</p>
          </div>
        </div>

        {/* Group card */}
        <div className="el-sgrp-card">
          {/* Card header */}
          <div className="el-sgrp-card-header">
            <div className="el-sgrp-card-left">
              <span className="el-scls-grade" data-grade={myGroup.grade}>
                🦊 Nhóm {profile.groupIndex}
              </span>
              <h2 className="el-sgrp-group-name">{myGroup.className}</h2>
              <div className="el-scls-meta">
                <span className="el-scls-meta-item">
                  <UsersIcon />
                  {myGroup.members.length} thành viên
                </span>
                <span className="el-scls-meta-item">
                  {myGroup.status === "active" ? "Đang hoạt động" : "Chờ bắt đầu"}
                </span>
              </div>
            </div>
            <div className="el-sgrp-score-box">
              <div className="el-sgrp-score-value">{myGroup.averageScore}</div>
              <div className="el-sgrp-score-label">Điểm TB nhóm</div>
            </div>
          </div>

          {/* Stats row */}
          <div className="el-scls-stats-row">
            <div className={cn("el-scls-stat-chip", "teal")}>
              <BookCheckIcon />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1 }}>
                  {myGroup.completedQuizzes}/{myGroup.totalQuizzes}
                </div>
                <div style={{ fontSize: 11, marginTop: 2 }}>Quiz đã làm</div>
              </div>
            </div>
            <div className={cn("el-scls-stat-chip", "gold")}>
              <StarIcon />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1 }}>
                  {quizPct}%
                </div>
                <div style={{ fontSize: 11, marginTop: 2 }}>
                  Tỷ lệ hoàn thành
                </div>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="el-scls-section">
            <h3 className="el-scls-section-title">
              Thành viên nhóm
              <span className="el-scls-classmate-count">
                +{myGroup.members.length}
              </span>
            </h3>
            <div className="el-scls-classmates">
              {myGroup.members.map((mate) => (
                <div key={mate.studentId} className="el-scls-classmate">
                  <div className="el-scls-classmate-avatar">
                    {getInitials(mate.name)}
                  </div>
                  <span className="el-scls-classmate-name">{mate.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz progress */}
          <div className="el-scls-section">
            <h3 className="el-scls-section-title">Tiến độ quiz</h3>
            <div className="el-scls-lesson-list">
              {lessons
                .slice()
                .sort((a, b) => a.lessonNumber - b.lessonNumber)
                .map((lesson) => {
                  const gl = myGroupLessons.find((gl) => gl.lessonId === lesson.id)
                  const completed = gl?.status === "completed" && gl.score > 0
                  const score = gl?.score ?? 0

                  return (
                    <div key={lesson.id} className="el-scls-lesson">
                      <div className="el-scls-lesson-left">
                        <div
                          className={cn(
                            "el-scls-lesson-icon",
                            completed ? "done" : "pending"
                          )}
                        >
                          {completed ? <CheckCircleIcon /> : <CircleIcon />}
                        </div>
                        <div>
                          <div className="el-scls-lesson-title">
                            Quiz — Lesson {lesson.lessonNumber}: {lesson.title}
                          </div>
                          {completed && (
                            <div className="el-scls-lesson-score">
                              Score: {score.toFixed(1)}/10
                            </div>
                          )}
                        </div>
                      </div>
                      {completed && (
                        <div className="el-scls-lesson-bar">
                          <div
                            className="el-scls-lesson-bar-fill"
                            style={{ width: `${(score / 10) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Quick action */}
          <div className="el-scls-section">
            <Link href={quizHref} className="el-sgrp-start-quiz">
              <span>
                {nextPendingLesson
                  ? `Bắt đầu quiz tiếp theo`
                  : "Làm lại quiz"}
              </span>
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>

      {/* Right rail — stats & charts */}
      <StudentGroupRail
        group={myGroup}
        allGroups={groups}
        myGroupId={myGroup.id}
        groupLessons={myGroupLessons}
      />
    </>
  )
}
```

- [ ] **Step 2: Rewrite `student-group-rail.tsx`**

Replace the hardcoded `classGroupsRank` with data from Firestore. The rail receives props instead of defining its own interface.

```typescript
"use client"

import {
  TrendingUpIcon,
  TargetIcon,
  FlameIcon,
  AwardIcon,
  BookOpenIcon,
  UsersIcon,
} from "lucide-react"
import type { Group } from "@/features/elementary/quiz/hooks/use-groups"
import type { GroupLesson } from "@/features/elementary/groups/hooks/use-group-lessons"

interface StudentGroupRailProps {
  group: Group
  allGroups: Group[]
  myGroupId: string
  groupLessons: GroupLesson[]
}

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

export function StudentGroupRail({
  group,
  allGroups,
  myGroupId,
  groupLessons,
}: StudentGroupRailProps) {
  const quizPct = group.totalQuizzes > 0
    ? Math.round((group.completedQuizzes / group.totalQuizzes) * 100)
    : 0

  const completedScores = groupLessons
    .filter((gl) => gl.status === "completed")
    .map((gl) => gl.score)
  const avgScore =
    completedScores.length > 0
      ? (
          completedScores.reduce((a, b) => a + b, 0) / completedScores.length
        ).toFixed(1)
      : "0"

  // Rank among class groups by averageScore
  const sortedGroups = [...allGroups].sort(
    (a, b) => parseFloat(b.averageScore) - parseFloat(a.averageScore)
  )
  const myRank = sortedGroups.findIndex((g) => g.id === myGroupId) + 1

  // Group ranking for rail display
  const groupRanking = sortedGroups.slice(0, 5).map((g, i) => ({
    groupName: `Nhóm ${g.id.split("_").pop()}`,
    averageScore: g.averageScore,
    isMe: g.id === myGroupId,
    rank: i + 1,
  }))

  // Streak — derived from groupLessons completion dates
  // For now show computed count of completed lessons as proxy
  const completedLessonCount = completedScores.length

  return (
    <aside className="el-rail">
      {/* ── Overview Stats ── */}
      <div className="el-scls-rail-card">
        <div className="el-scls-rail-header">
          <h2 className="el-scls-rail-title">
            <TargetIcon className="el-scls-rail-header-icon" />
            Tổng quan nhóm
          </h2>
        </div>
        <div className="el-scls-rail-stats">
          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon teal">
              <UsersIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">
                {group.members.length} thành viên
              </span>
              <span className="el-scls-rail-stat-label">Trong nhóm</span>
            </div>
          </div>
          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon amber">
              <AwardIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">{avgScore}</span>
              <span className="el-scls-rail-stat-label">Điểm TB nhóm</span>
            </div>
          </div>
          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon teal">
              <BookOpenIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">
                {group.completedQuizzes}/{group.totalQuizzes}
              </span>
              <span className="el-scls-rail-stat-label">Quiz đã làm</span>
            </div>
            <div className="el-scls-rail-stat-ring">
              <svg viewBox="0 0 36 36" className="el-scls-rail-ring">
                <path
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--el-muted))"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(172 56% 38%)"
                  strokeWidth="3"
                  strokeDasharray={`${quizPct}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="el-scls-rail-ring-text">{quizPct}%</span>
            </div>
          </div>
          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon indigo">
              <TrendingUpIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">#{myRank}</span>
              <span className="el-scls-rail-stat-label">Trong lớp</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Study Progress ── */}
      <div className="el-scls-rail-card">
        <div className="el-scls-rail-header">
          <h2 className="el-scls-rail-title">
            <FlameIcon className="el-scls-rail-header-icon" />
            Tiến độ học tập
          </h2>
        </div>
        <div className="el-scls-rail-streak-summary">
          <span className="el-scls-rail-streak-count">
            {completedLessonCount} bài đã hoàn thành
          </span>
        </div>
      </div>

      {/* ── Top Groups in Class ── */}
      <div className="el-scls-rail-card">
        <div className="el-scls-rail-header">
          <h2 className="el-scls-rail-title">
            <AwardIcon className="el-scls-rail-header-icon" />
            Xếp hạng nhóm
          </h2>
          <span className="el-scls-rail-header-link">
            Lớp {group.className}
          </span>
        </div>
        <div className="el-scls-rail-leaderboard">
          {groupRanking.map((gr, i) => (
            <div
              key={gr.groupName + i}
              className={`el-scls-rail-lb-row ${gr.isMe ? "is-me" : ""}`}
            >
              <span
                className={`el-scls-rail-lb-rank ${
                  gr.rank <= 3 ? `top-${gr.rank}` : ""
                }`}
              >
                {gr.rank}
              </span>
              <div className="el-scls-rail-lb-avatar">
                <UsersIcon className="h-3 w-3" />
              </div>
              <span className="el-scls-rail-lb-name">
                {gr.groupName}
                {gr.isMe && (
                  <span className="el-scls-rail-lb-me-badge">Nhóm bạn</span>
                )}
              </span>
              <span className="el-scls-rail-lb-score">{gr.averageScore}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add features/elementary/groups/components/student-groups-page.tsx features/elementary/groups/components/student-group-rail.tsx
git commit -m "feat(groups): replace hardcoded student group data with Firestore reads"
```

---

## Task 6: Fix student class rail — real leaderboard from Firestore

**Files:**
- Modify: `features/elementary/classes/components/student-class-rail.tsx`

Replace hardcoded leaderboard, streak, and rank with data derived from props (which come from `useStudentClass` which now has `classmates[].averageScore`).

- [ ] **Step 1: Rewrite the component**

The key changes:
- Leaderboard uses `cls.classmates` sorted by `averageScore` instead of hardcoded array
- Rank is computed from classmates' average scores
- Streak section is replaced with "Bài học đã hoàn thành" (derived from data)
- Remove hardcoded `streakDays` and `streakLabels`

```typescript
"use client"

import {
  TrendingUpIcon,
  TargetIcon,
  FlameIcon,
  AwardIcon,
  BookOpenIcon,
} from "lucide-react"
import type { StudentClass } from "@/features/elementary/classes/types/student-class.types"

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

interface StudentClassRailProps {
  cls: StudentClass
}

export function StudentClassRail({ cls }: StudentClassRailProps) {
  const lessonPct = Math.round((cls.completedLessons / cls.totalLessons) * 100)
  const completedScores = cls.lessons
    .filter((l) => l.completed)
    .map((l) => l.score)
  const avgScore =
    completedScores.length > 0
      ? (
          completedScores.reduce((a, b) => a + b, 0) / completedScores.length
        ).toFixed(1)
      : "0"

  // Quiz score trend for bar chart
  const quizScores = [...cls.recentQuizzes].reverse()

  // Rank among classmates (by averageScore from Firestore)
  const sortedClassmates = [...cls.classmates].sort(
    (a, b) => b.averageScore - a.averageScore
  )
  const myRank =
    sortedClassmates.findIndex((m) => m.averageScore <= parseFloat(avgScore)) +
    1 || sortedClassmates.length

  // Top 5 leaderboard: top classmates + "Bạn"
  const topClassmates = sortedClassmates.slice(0, 5)
  // Insert "Bạn" if not already in top 5
  const leaderboardEntries = topClassmates.map((m) => ({
    name: m.name,
    avatar: m.avatar,
    score: m.averageScore.toFixed(1),
    isMe: false,
  }))
  const meInTop5 = topClassmates.some(
    (m) => m.averageScore <= parseFloat(avgScore)
  )
  if (!meInTop5 && completedScores.length > 0) {
    // Insert at the right position
    let insertIdx = leaderboardEntries.findIndex(
      (e) => parseFloat(e.score) < parseFloat(avgScore)
    )
    if (insertIdx === -1) insertIdx = leaderboardEntries.length
    leaderboardEntries.splice(insertIdx, 0, {
      name: "Bạn",
      avatar: cls.classmates[0]?.avatar ?? "T",
      score: avgScore,
      isMe: true,
    })
    // Keep only top 5
    leaderboardEntries.length = Math.min(leaderboardEntries.length, 5)
  }

  return (
    <aside className="el-rail">
      {/* ── Overview Stats ── */}
      <div className="el-scls-rail-card">
        <div className="el-scls-rail-header">
          <h2 className="el-scls-rail-title">
            <TargetIcon className="el-scls-rail-header-icon" />
            Tổng quan học tập
          </h2>
        </div>

        <div className="el-scls-rail-stats">
          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon teal">
              <BookOpenIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">
                {cls.completedLessons}/{cls.totalLessons}
              </span>
              <span className="el-scls-rail-stat-label">Bài học</span>
            </div>
            <div className="el-scls-rail-stat-ring">
              <svg viewBox="0 0 36 36" className="el-scls-rail-ring">
                <path
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--el-muted))"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(172 56% 38%)"
                  strokeWidth="3"
                  strokeDasharray={`${lessonPct}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="el-scls-rail-ring-text">{lessonPct}%</span>
            </div>
          </div>

          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon amber">
              <AwardIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">{avgScore}</span>
              <span className="el-scls-rail-stat-label">Điểm TB</span>
            </div>
          </div>

          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon indigo">
              <TrendingUpIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">
                {myRank > 0 ? `#${myRank}` : "—"}
              </span>
              <span className="el-scls-rail-stat-label">Trong lớp</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quiz Score Trend ── */}
      {quizScores.length > 0 && (
        <div className="el-scls-rail-card">
          <div className="el-scls-rail-header">
            <h2 className="el-scls-rail-title">
              <TrendingUpIcon className="el-scls-rail-header-icon" />
              Xu hướng điểm quiz
            </h2>
          </div>

          <div className="el-scls-rail-chart">
            {quizScores.map((quiz, i) => {
              const pct = (quiz.score / quiz.maxScore) * 100
              const hue = quiz.score >= 9 ? 142 : quiz.score >= 7.5 ? 217 : 38
              return (
                <div key={i} className="el-scls-rail-chart-bar-group">
                  <div className="el-scls-rail-chart-bar-track">
                    <div
                      className="el-scls-rail-chart-bar-fill"
                      style={{
                        height: `${pct}%`,
                        background: `hsl(${hue} 65% 48%)`,
                      }}
                    />
                  </div>
                  <span className="el-scls-rail-chart-bar-value">
                    {quiz.score}
                  </span>
                  <span className="el-scls-rail-chart-bar-label">
                    L{cls.recentQuizzes.length - i}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Score legend */}
          <div className="el-scls-rail-chart-legend">
            <span className="el-scls-rail-legend-item">
              <span
                className="el-scls-rail-legend-dot"
                style={{ background: "hsl(142 65% 48%)" }}
              />
              ≥9
            </span>
            <span className="el-scls-rail-legend-item">
              <span
                className="el-scls-rail-legend-dot"
                style={{ background: "hsl(217 65% 48%)" }}
              />
              7.5–8.9
            </span>
            <span className="el-scls-rail-legend-item">
              <span
                className="el-scls-rail-legend-dot"
                style={{ background: "hsl(38 65% 48%)" }}
              />
              &lt;7.5
            </span>
          </div>
        </div>
      )}

      {/* ── Top Classmates ── */}
      {leaderboardEntries.length > 0 && (
        <div className="el-scls-rail-card">
          <div className="el-scls-rail-header">
            <h2 className="el-scls-rail-title">
              <AwardIcon className="el-scls-rail-header-icon" />
              Bảng xếp hạng
            </h2>
            <span className="el-scls-rail-header-link">
              Lớp {cls.grade}/{cls.classNumber}
            </span>
          </div>

          <div className="el-scls-rail-leaderboard">
            {leaderboardEntries.map((mate, i) => (
              <div
                key={`${mate.name}-${i}`}
                className={`el-scls-rail-lb-row ${mate.isMe ? "is-me" : ""}`}
              >
                <span
                  className={`el-scls-rail-lb-rank ${
                    i < 3 ? `top-${i + 1}` : ""
                  }`}
                >
                  {i + 1}
                </span>
                <div className="el-scls-rail-lb-avatar">
                  {getInitials(mate.name)}
                </div>
                <span className="el-scls-rail-lb-name">
                  {mate.name}
                  {mate.isMe && (
                    <span className="el-scls-rail-lb-me-badge">Bạn</span>
                  )}
                </span>
                <span className="el-scls-rail-lb-score">{mate.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add features/elementary/classes/components/student-class-rail.tsx features/elementary/classes/types/student-class.types.ts features/elementary/classes/hooks/use-student-class.ts
git commit -m "feat(class-rail): replace hardcoded leaderboard and stats with Firestore-derived data"
```

---

## Task 7: Fix quiz flow — dynamic quiz ID from lesson

**Files:**
- Modify: `features/elementary/quiz/components/quiz-page.tsx`
- Delete: `features/elementary/quiz/constants/quiz.constants.ts`

The `QuizRunner` currently imports `QUIZ_ID` from constants. Instead, it should accept a `quizId` prop (resolved from the lesson's quiz) or let the user pick from their current lesson.

- [ ] **Step 1: Update `QuizRunner` to accept `quizId` and `durationSeconds` as props**

In `quiz-page.tsx`, change the `QuizRunner` function signature and replace `QUIZ_ID` / `QUIZ_DURATION_SECONDS` with props:

```typescript
interface QuizRunnerProps {
  groupId: string
  classId: string
  quizId: string
  durationSeconds: number
}

function QuizRunner({ groupId, classId, quizId, durationSeconds }: QuizRunnerProps) {
```

Then replace all occurrences:
- `QUIZ_ID` → `quizId`
- `QUIZ_DURATION_SECONDS` → `durationSeconds`

Also update the `QuizPage` component to accept and pass through quizId/durationSeconds:

```typescript
interface QuizPageProps {
  groupId?: string
  classId?: string
  quizId?: string
  durationSeconds?: number
}

export function QuizPage({ groupId, classId, quizId, durationSeconds }: QuizPageProps) {
  if (!groupId || !classId || !quizId) {
    return (
      <QuizEntrySelector
        initialClassId={classId}
        initialGroupId={groupId}
        initialQuizId={quizId}
      />
    )
  }

  return (
    <QuizRunner
      groupId={groupId}
      classId={classId}
      quizId={quizId}
      durationSeconds={durationSeconds ?? 600}
    />
  )
}
```

- [ ] **Step 2: Update `QuizEntrySelector` to resolve quizId from lesson**

After the user selects a group, fetch the `classLessons` for the class, find the "current" lesson, then fetch the quiz for that lesson, and pass it to the router:

In `QuizEntrySelector`, update the `handleStart` callback:

```typescript
// Add imports at top of file
import { useLessons } from "@/features/elementary/lessons/hooks/use-lessons"
import { useQuizzesByLesson } from "../hooks/use-quizzes-by-lesson"
import { useClassLessons } from "@/features/elementary/lessons/hooks/use-class-lessons"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
```

Replace `handleStart`:

```typescript
const handleStart = useCallback(async () => {
  if (!selectedClassId || !selectedGroupId) return

  // Find current lesson for this class
  const classLessonsQuery = query(
    collection(db, "classLessons"),
    where("classId", "==", selectedClassId),
    where("status", "==", "current")
  )
  const clSnapshot = await getDocs(classLessonsQuery)

  if (clSnapshot.empty) {
    // No current lesson set — find first pending or use first lesson
    const allClQuery = query(
      collection(db, "classLessons"),
      where("classId", "==", selectedClassId)
    )
    const allClSnapshot = await getDocs(allClQuery)
    const firstLessonId = allClSnapshot.docs[0]?.data()?.lessonId

    if (firstLessonId) {
      // Get quiz for this lesson
      const quizQuery = query(
        collection(db, "quizzes"),
        where("lessonId", "==", firstLessonId)
      )
      const quizSnapshot = await getDocs(quizQuery)
      const quizDoc = quizSnapshot.docs[0]

      if (quizDoc) {
        router.push(
          `/elementary-student/quiz?class=${selectedClassId}&group=${selectedGroupId}&quiz=${quizDoc.id}`
        )
        return
      }
    }
  } else {
    const currentLessonId = clSnapshot.docs[0].data().lessonId

    // Get quiz for current lesson
    const quizQuery = query(
      collection(db, "quizzes"),
      where("lessonId", "==", currentLessonId)
    )
    const quizSnapshot = await getDocs(quizQuery)
    const quizDoc = quizSnapshot.docs[0]

    if (quizDoc) {
      router.push(
        `/elementary-student/quiz?class=${selectedClassId}&group=${selectedGroupId}&quiz=${quizDoc.id}`
      )
      return
    }
  }

  // Fallback — go without quizId (will show error)
  router.push(
    `/elementary-student/quiz?class=${selectedClassId}&group=${selectedGroupId}`
  )
}, [router, selectedClassId, selectedGroupId])
```

- [ ] **Step 3: Update `quiz-page.tsx` to read `quizId` from URL search params**

Find the page component that instantiates `QuizPage` and update it to pass `quizId` from search params. The page route is `app/elementary-student/quiz/page.tsx`:

```typescript
"use client"

import { useSearchParams } from "next/navigation"
import { QuizPage } from "@/features/elementary/quiz/components/quiz-page"

export default function QuizRoute() {
  const searchParams = useSearchParams()
  const groupId = searchParams.get("group") ?? undefined
  const classId = searchParams.get("class") ?? undefined
  const quizId = searchParams.get("quiz") ?? undefined

  return <QuizPage groupId={groupId} classId={classId} quizId={quizId} />
}
```

- [ ] **Step 4: Delete the constants file**

```bash
rm features/elementary/quiz/constants/quiz.constants.ts
```

- [ ] **Step 5: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(quiz): dynamic quiz ID from current lesson, remove hardcoded QUIZ_ID constant"
```

---

## Task 8: Rewrite student dashboard components with Firestore data

**Files:**
- Rewrite: `features/elementary/dashboard/components/student-stat-card.tsx`
- Rewrite: `features/elementary/dashboard/components/my-group-card.tsx`
- Rewrite: `features/elementary/dashboard/components/recent-quiz-results.tsx`
- Rewrite: `features/elementary/dashboard/components/student-dashboard-rail.tsx`
- Modify: `app/elementary-student/dashboard/page.tsx`

The dashboard page currently composes several components that all use hardcoded data. We need to:
1. Create a `useStudentDashboardData` hook that aggregates all data needed by the dashboard
2. Update the dashboard page to pass this data to components
3. Rewrite each component to accept props instead of hardcoding

- [ ] **Step 1: Create `useStudentDashboardData` hook**

Create `features/elementary/dashboard/hooks/use-student-dashboard-data.ts`:

```typescript
"use client"

import { useMemo } from "react"
import { useStudentProfile } from "@/features/elementary/profile/hooks/use-student-profile"
import { useClasses } from "@/features/elementary/quiz/hooks/use-classes"
import { useLessons } from "@/features/elementary/lessons/hooks/use-lessons"
import { useClassLessons } from "@/features/elementary/lessons/hooks/use-class-lessons"
import { useGroupsByClass } from "@/features/elementary/quiz/hooks/use-groups"
import { useGroupLessons } from "@/features/elementary/groups/hooks/use-group-lessons"

interface DashboardData {
  userName: string
  className: string
  grade: number
  classNumber: number
  completedLessons: number
  totalLessons: number
  averageScore: string
  groupName: string
  groupCompletedQuizzes: number
  groupTotalQuizzes: number
  lessons: {
    lessonNumber: number
    title: string
    score: number
    completed: boolean
  }[]
  recentQuizzes: {
    title: string
    score: number
    maxScore: number
    date: string
  }[]
  myGroup: {
    name: string
    members: { name: string; avatar: string }[]
    completedLessons: number
    totalLessons: number
    averageScore: number
  } | null
  leaderboard: {
    rank: number
    name: string
    score: number
    avatar: string
    isMe: boolean
  }[]
}

export function useStudentDashboardData() {
  const { profile, loading: pLoading, error: pError } = useStudentProfile()
  const { classes, loading: cLoading } = useClasses()
  const { lessons, loading: lLoading } = useLessons()
  const { classLessons, loading: clLoading } = useClassLessons(profile?.classId ?? null)
  const { groups, loading: gLoading } = useGroupsByClass(profile?.classId ?? null)
  const { groupLessons, loading: glLoading } = useGroupLessons(profile?.classId ?? null)

  const loading = pLoading || cLoading || lLoading || clLoading || gLoading || glLoading
  const error = pError

  const data = useMemo<DashboardData | null>(() => {
    if (loading || !profile || !profile.classId) return null

    const cls = classes.find((c) => c.id === profile.classId)
    if (!cls) return null

    const className = `Lớp ${cls.grade}/${cls.classNumber}`

    // Lesson progress
    const lessonsSorted = lessons.slice().sort((a, b) => a.lessonNumber - b.lessonNumber)
    const lessonEntries = lessonsSorted.map((lesson) => {
      const cl = classLessons.find((c) => c.lessonId === lesson.id)
      const completed = cl?.status === "completed" || cl?.status === "current"

      const glForLesson = groupLessons.filter(
        (gl) => gl.lessonId === lesson.id && gl.status === "completed"
      )
      const score =
        glForLesson.length > 0
          ? Number(
              (
                glForLesson.reduce((sum, gl) => sum + gl.score, 0) /
                glForLesson.length
              ).toFixed(1)
            )
          : 0

      return { lessonNumber: lesson.lessonNumber, title: lesson.title, completed, score }
    })

    const completedLessons = classLessons.filter((cl) => cl.status === "completed").length

    // Recent quizzes (most recent completed lessons, max 5)
    const completedSorted = [...lessonEntries]
      .filter((l) => l.completed)
      .sort((a, b) => b.lessonNumber - a.lessonNumber)
      .slice(0, 5)
    const recentQuizzes = completedSorted.map((l) => ({
      title: `Quiz — Lesson ${l.lessonNumber}: ${l.title}`,
      score: Math.round(l.score),
      maxScore: 10,
      date: "Gần đây",
    }))

    // My group
    const myGroupData = profile.groupId
      ? groups.find((g) => g.id === profile.groupId)
      : null
    const myGroupLessons = myGroupData
      ? groupLessons.filter((gl) => gl.groupId === myGroupData.id)
      : []
    const groupCompletedLessons = myGroupLessons.filter(
      (gl) => gl.status === "completed"
    ).length
    const myGroupScore = myGroupLessons.filter((gl) => gl.status === "completed")
    const myGroupAvg =
      myGroupScore.length > 0
        ? Number(
            (
              myGroupScore.reduce((sum, gl) => sum + gl.score, 0) /
              myGroupScore.length
            ).toFixed(1)
          )
        : 0

    const myGroup = myGroupData
      ? {
          name: `Nhóm ${profile.groupIndex ?? "?"}`,
          members: myGroupData.members.map((m) => ({
            name: m.name,
            avatar: m.studentId.slice(-2),
          })),
          completedLessons: groupCompletedLessons,
          totalLessons: lessons.length,
          averageScore: myGroupAvg,
        }
      : null

    // Leaderboard (from all classmates via groups)
    const memberScores = new Map<string, { name: string; avatar: string; totalScore: number; count: number }>()
    for (const group of groups) {
      const gLessons = groupLessons.filter(
        (gl) => gl.groupId === group.id && gl.status === "completed"
      )
      for (const member of group.members) {
        if (!memberScores.has(member.name)) {
          memberScores.set(member.name, {
            name: member.name,
            avatar: member.studentId.slice(-2),
            totalScore: 0,
            count: 0,
          })
        }
        const entry = memberScores.get(member.name)!
        for (const gl of gLessons) {
          entry.totalScore += gl.score
          entry.count++
        }
      }
    }

    const leaderboard = [...memberScores.values()]
      .map((m) => ({
        rank: 0,
        name: m.name,
        score: m.count > 0 ? Number((m.totalScore / m.count).toFixed(1)) : 0,
        avatar: m.avatar,
        isMe: m.name === profile.name,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry, i) => ({ ...entry, rank: i + 1 }))

    return {
      userName: profile.name,
      className,
      grade: cls.grade,
      classNumber: cls.classNumber,
      completedLessons,
      totalLessons: lessons.length,
      averageScore: cls.averageScore,
      groupName: myGroup?.name ?? "",
      groupCompletedQuizzes: myGroupData?.completedQuizzes ?? 0,
      groupTotalQuizzes: myGroupData?.totalQuizzes ?? 0,
      lessons: lessonEntries,
      recentQuizzes,
      myGroup,
      leaderboard,
    }
  }, [
    loading,
    profile,
    classes,
    lessons,
    classLessons,
    groups,
    groupLessons,
  ])

  return { data, loading, error }
}
```

- [ ] **Step 2: Update `StudentStatCard` to accept props**

```typescript
import React from "react"
import { cn } from "@/lib/utils"
import { IconTint } from "@/components/icon-tint"
import {
  BookOpenIcon,
  StarIcon,
  FlameIcon,
  UsersIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"

interface StudentStatCardProps {
  variant: "lessons" | "score" | "streak" | "group"
  lessons?: { completed: boolean }[]
  totalLessons?: number
  averageScore?: string
  groupName?: string
  groupCompletedQuizzes?: number
  groupTotalQuizzes?: number
  className?: string
}

export function StudentStatCard({
  variant,
  lessons: lessonData = [],
  totalLessons = 8,
  averageScore = "0",
  groupName = "",
  groupCompletedQuizzes = 0,
  groupTotalQuizzes = 0,
  className,
}: StudentStatCardProps) {
  type StatConfig = {
    icon: React.ComponentType<{ className?: string }>
    iconTint: "indigo" | "green" | "blue" | "amber" | "red"
    label: string
    value: string
    detail?: string
    trend?: string
    spark?: true
    progress?: number
  }

  const completedCount = lessonData.filter((l) => l.completed).length
  const groupPct = groupTotalQuizzes > 0 ? Math.round((groupCompletedQuizzes / groupTotalQuizzes) * 100) : 0

  const configs: Record<StudentStatCardProps["variant"], StatConfig> = {
    lessons: {
      icon: BookOpenIcon,
      iconTint: "blue",
      label: "Bài học đã học",
      value: `${completedCount}/${totalLessons}`,
      detail: completedCount > 0
        ? `Lesson 1 → Lesson ${completedCount}`
        : "Chưa bắt đầu",
    },
    score: {
      icon: StarIcon,
      iconTint: "amber",
      label: "Điểm trung bình",
      value: averageScore,
      detail: parseFloat(averageScore) >= 8 ? "Top lớp" : "Cần cố gắng thêm",
    },
    streak: {
      icon: FlameIcon,
      iconTint: "red",
      label: "Bài đã hoàn thành",
      value: `${completedCount}`,
      detail: `${completedCount} bài đã học`,
      spark: true,
    },
    group: {
      icon: UsersIcon,
      iconTint: "green",
      label: "Nhóm học",
      value: groupName || "Chưa có nhóm",
      detail: `Hoàn thành ${groupCompletedQuizzes}/${groupTotalQuizzes} quiz`,
      progress: groupPct,
    },
  }

  const c = configs[variant]

  return (
    <Card
      className={cn(
        "gap-3 rounded-[var(--radius)] border border-border bg-card p-[18px] py-[18px] shadow-[var(--shadow-card)] ring-0 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <IconTint variant={c.iconTint} size="lg">
          <c.icon className="h-5 w-5" />
        </IconTint>
        {c.spark && (
          <svg className="h-[34px] w-[64px]" viewBox="0 0 64 34" fill="none">
            <polyline
              points="0,28 12,22 22,25 34,14 44,17 56,6 64,9"
              stroke="oklch(0.63 0.19 27)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {c.trend && (
          <span className="text-[13px] font-semibold text-success">
            +{c.trend}
          </span>
        )}
      </div>
      <div className="text-[13px] font-medium text-muted-foreground">
        {c.label}
      </div>
      <div
        className="text-[30px] leading-[1.05] font-extrabold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        {c.value}
      </div>
      {"progress" in c && c.progress !== undefined ? (
        <>
          <div className="mt-[10px] mb-[5px] text-[12.5px] text-muted-foreground">
            {c.detail}
          </div>
          <div className="mt-[4px] h-[7px] overflow-hidden rounded-full bg-[oklch(0.965_0_0)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,hsl(142_71%_50%),hsl(142_71% 42%))]"
              style={{ width: `${c.progress}%` }}
            />
          </div>
        </>
      ) : (
        <div className="mt-[10px] text-[12.5px] text-muted-foreground">
          {c.detail}
        </div>
      )}
    </Card>
  )
}
```

- [ ] **Step 3: Rewrite `MyGroupCard` to accept props**

```typescript
import { Card } from "@/components/ui/card"

interface MyGroupCardProps {
  name: string
  members: { name: string; avatar: string }[]
  completedLessons: number
  totalLessons: number
  averageScore: number
}

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

export function MyGroupCard({
  name,
  members,
  completedLessons,
  totalLessons,
  averageScore,
}: MyGroupCardProps) {
  const progress = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0

  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
          Nhóm của mình
        </h2>
        <span className="text-[13px] font-semibold text-primary hover:underline">
          {name}
        </span>
      </div>

      {/* Members */}
      <div className="mb-4 flex items-center gap-3">
        {members.map((member) => (
          <div key={member.name} className="flex items-center gap-2">
            <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-primary-muted text-[12px] font-bold text-primary">
              {getInitials(member.name)}
            </div>
            <span className="text-[12.5px] font-semibold">{member.name}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mb-3 grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/50 p-3">
        <div className="text-center">
          <div className="text-[11px] text-muted-foreground">
            Bài học hoàn thành
          </div>
          <div
            className="text-[18px] font-extrabold"
            style={{ letterSpacing: "-0.01em" }}
          >
            {completedLessons}/{totalLessons}
          </div>
        </div>
        <div className="border-l border-border text-center">
          <div className="text-[11px] text-muted-foreground">
            Điểm TB nhóm
          </div>
          <div
            className="text-[18px] font-extrabold text-success"
            style={{ letterSpacing: "-0.01em" }}
          >
            {averageScore}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-[4px] h-[7px] overflow-hidden rounded-full bg-[oklch(0.965_0_0)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,hsl(262_83%_58%),hsl(262_83% 50%))]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-[8px] text-center text-[12px] font-medium text-muted-foreground">
        {progress}% hoàn thành
      </div>
    </Card>
  )
}
```

- [ ] **Step 4: Rewrite `RecentQuizResults` to accept props**

```typescript
import { Card } from "@/components/ui/card"
import { IconTint } from "@/components/icon-tint"
import { BadgeStatus } from "@/components/badge-status"
import { LanguagesIcon } from "lucide-react"

interface RecentQuizResultsProps {
  recentQuizzes: {
    title: string
    score: number
    maxScore: number
    date: string
  }[]
}

function getScoreVariant(score: number) {
  if (score >= 9) return "success" as const
  if (score >= 7) return "info" as const
  return "warning" as const
}

function getScoreLabel(score: number) {
  if (score >= 9) return "Giỏi"
  if (score >= 7) return "Khá"
  return "Trung bình"
}

function getIconTint(score: number) {
  if (score >= 9) return "green" as const
  if (score >= 7) return "blue" as const
  return "amber" as const
}

export function RecentQuizResults({ recentQuizzes }: RecentQuizResultsProps) {
  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
          Kết quả quiz gần đây
        </h2>
      </div>

      {recentQuizzes.length === 0 && (
        <p className="text-[13px] text-muted-foreground">
          Chưa có kết quả quiz nào.
        </p>
      )}

      {recentQuizzes.map((quiz) => (
        <div
          key={`${quiz.date}-${quiz.title}`}
          className="flex items-center gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0"
        >
          <IconTint
            variant={getIconTint(quiz.score)}
            className="h-[34px] w-[34px] rounded-[9px]"
          >
            <LanguagesIcon className="h-[14px] w-[14px]" />
          </IconTint>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-semibold">{quiz.title}</div>
            <div className="text-[12px] text-muted-foreground">
              {quiz.score}/{quiz.maxScore} · {quiz.date}
            </div>
          </div>
          <BadgeStatus variant={getScoreVariant(quiz.score)}>
            {getScoreLabel(quiz.score)}
          </BadgeStatus>
        </div>
      ))}
    </Card>
  )
}
```

- [ ] **Step 5: Rewrite `StudentDashboardRail` to accept props**

```typescript
import { Card } from "@/components/ui/card"
import { IconTint } from "@/components/icon-tint"
import {
  TrophyIcon,
  BookOpenIcon,
  CheckCircleIcon,
  CircleIcon,
} from "lucide-react"

interface StudentDashboardRailProps {
  leaderboard: {
    rank: number
    name: string
    score: number
    avatar: string
    isMe: boolean
  }[]
  lessons: {
    lessonNumber: number
    title: string
    score: number
    completed: boolean
  }[]
  className?: string
}

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

export function StudentDashboardRail({
  leaderboard,
  lessons,
  className,
}: StudentDashboardRailProps) {
  return (
    <aside className="el-rail">
      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="m-0 flex items-center gap-2 text-[16.5px] font-bold tracking-tight">
              <TrophyIcon className="h-[18px] w-[18px] text-warning" />
              Bảng xếp hạng
            </h2>
          </div>

          {leaderboard.map((entry) => (
            <div
              key={entry.name}
              className={`flex items-center gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0 ${
                entry.isMe ? "rounded-lg bg-primary-muted/50 -mx-2 px-2" : ""
              }`}
            >
              <div
                className={`grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-[11px] font-extrabold ${
                  entry.rank <= 3
                    ? "bg-warning text-warning-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {entry.rank}
              </div>
              <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-primary-muted text-[12px] font-bold text-primary">
                {getInitials(entry.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold">
                  {entry.name}{" "}
                  {entry.isMe && <span className="text-primary">(Bạn)</span>}
                </div>
              </div>
              <span
                className="text-[14px] font-extrabold"
                style={{ letterSpacing: "-0.01em" }}
              >
                {entry.score.toFixed(1)}
              </span>
            </div>
          ))}
        </Card>
      )}

      {/* Lesson progress */}
      {lessons.length > 0 && (
        <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
          <h2 className="mb-4 text-[16.5px] font-bold tracking-tight">
            Tiến độ bài học
          </h2>
          {lessons.map((lp) => (
            <div
              key={lp.lessonNumber}
              className="flex items-center gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0"
            >
              <IconTint
                variant={lp.completed ? "green" : "blue"}
                className="h-[30px] w-[30px] rounded-[8px]"
              >
                {lp.completed ? (
                  <CheckCircleIcon className="h-[13px] w-[13px]" />
                ) : (
                  <CircleIcon className="h-[13px] w-[13px]" />
                )}
              </IconTint>
              <div className="min-w-0 flex-1">
                <div className="mb-[4px] flex items-center justify-between">
                  <span className="text-[12px] font-semibold">
                    Lesson {lp.lessonNumber}: {lp.title}
                  </span>
                  {lp.completed ? (
                    <span
                      className="text-[13px] font-extrabold text-success"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {lp.score.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Chưa học
                    </span>
                  )}
                </div>
                {lp.completed ? (
                  <div className="h-[5px] overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-success"
                      style={{ width: `${(lp.score / 10) * 100}%` }}
                    />
                  </div>
                ) : (
                  <div className="h-[5px] overflow-hidden rounded-full bg-muted" />
                )}
              </div>
            </div>
          ))}
        </Card>
      )}
    </aside>
  )
}
```

- [ ] **Step 6: Update `app/elementary-student/dashboard/page.tsx`**

```typescript
"use client"

import { useStudentDashboardData } from "@/features/elementary/dashboard/hooks/use-student-dashboard-data"
import { StudentGreetingCard } from "@/features/elementary/dashboard/components/student-greeting-card"
import { StudentStatCard } from "@/features/elementary/dashboard/components/student-stat-card"
import { RecentQuizResults } from "@/features/elementary/dashboard/components/recent-quiz-results"
import { MyGroupCard } from "@/features/elementary/dashboard/components/my-group-card"
import { StudentDashboardRail } from "@/features/elementary/dashboard/components/student-dashboard-rail"

export default function DashboardPage() {
  const { data, loading } = useStudentDashboardData()

  if (loading || !data) {
    return (
      <div className="el-loading">
        <div className="el-spinner" />
        <span>Đang tải dữ liệu...</span>
      </div>
    )
  }

  return (
    <>
      <div className="el-col-main">
        <StudentGreetingCard
          userName={data.userName}
          className={data.className}
          semester="Học kỳ II, năm học 2025 - 2026"
          dateLabel={new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        />

        <div className="el-dash-grid-4">
          <StudentStatCard
            variant="lessons"
            lessons={data.lessons}
            totalLessons={data.totalLessons}
          />
          <StudentStatCard
            variant="score"
            averageScore={data.averageScore}
          />
          <StudentStatCard
            variant="streak"
            lessons={data.lessons}
          />
          <StudentStatCard
            variant="group"
            groupName={data.groupName}
            groupCompletedQuizzes={data.groupCompletedQuizzes}
            groupTotalQuizzes={data.groupTotalQuizzes}
          />
        </div>

        <RecentQuizResults recentQuizzes={data.recentQuizzes} />

        {data.myGroup && (
          <MyGroupCard
            name={data.myGroup.name}
            members={data.myGroup.members}
            completedLessons={data.myGroup.completedLessons}
            totalLessons={data.myGroup.totalLessons}
            averageScore={data.myGroup.averageScore}
          />
        )}
      </div>

      <StudentDashboardRail
        leaderboard={data.leaderboard}
        lessons={data.lessons}
      />
    </>
  )
}
```

- [ ] **Step 7: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(dashboard): replace all hardcoded student dashboard data with Firestore reads"
```

---

## Task 9: Final verification and cleanup

- [ ] **Step 1: Full typecheck**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: Build succeeds (no runtime errors in compilation)

- [ ] **Step 3: Clean up unused imports**

Check for any unused imports across the modified files and remove them.

- [ ] **Step 4: Final commit if cleanup needed**

```bash
git add -A
git commit -m "chore: clean up unused imports after elementary student data migration"
```
