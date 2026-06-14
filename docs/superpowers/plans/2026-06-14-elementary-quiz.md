# Elementary Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a quiz feature for elementary students — 2 students per device answer 10 multiple-choice questions with a countdown timer, realtime leaderboard sidebar, and a results screen showing score + rank.

**Architecture:** Feature lives in `features/elementary/quiz/` with types, hooks, components, and mock data. Firebase Firestore client SDK handles realtime data. Route is a thin page in `app/elementary-student/quiz/page.tsx`. All UI uses CSS Modules following the existing elementary pattern.

**Tech Stack:** Next.js 16 App Router, Firebase Firestore (client SDK), CSS Modules, lucide-react icons, `cn()` from `@/lib/utils`

---

## File Structure

```
features/elementary/quiz/
  types/
    quiz.types.ts              — TypeScript interfaces
  mock/
    quiz.mock.ts               — Mock questions + answers for development
    index.ts                   — Barrel re-export
  hooks/
    use-quiz-questions.ts      — Fetch questions from Firestore
    use-quiz-answers.ts        — Write + subscribe to answers (realtime)
    use-leaderboard.ts         — Derive leaderboard from answers
    use-quiz-timer.ts          — Countdown timer logic
  components/
    quiz-page.tsx              — Main layout: quiz area + leaderboard sidebar
    quiz-page.module.css       — Styles for quiz layout
    quiz-question.tsx          — Single question card with options
    quiz-question.module.css   — Styles for question card
    quiz-timer.tsx             — Countdown display
    quiz-leaderboard.tsx       — Realtime leaderboard sidebar
    quiz-leaderboard.module.css — Styles for leaderboard
    quiz-result.tsx            — Result screen after submission
    quiz-result.module.css     — Styles for result screen

app/elementary-student/
  quiz/
    page.tsx                   — Thin route composing <QuizPage />

lib/firebase/
  firestore.ts                 — Firestore getFirestore export (new file)
```

---

### Task 1: Add Firestore SDK and export Firestore instance

**Files:**
- Install: `firebase` (already in project as dependency)
- Create: `lib/firebase/firestore.ts`

- [ ] **Step 1: Verify firebase is installed**

Run: `cat package.json | grep firebase`
Expected: Shows `firebase` in dependencies (already present for analytics)

- [ ] **Step 2: Create Firestore export**

Create `lib/firebase/firestore.ts`:

```typescript
import { getFirestore, type Firestore } from "firebase/firestore"
import { firebaseApp } from "@/lib/firebase/client"

export const db: Firestore = getFirestore(firebaseApp)
```

- [ ] **Step 3: Verify typecheck**

Run: `npm run typecheck`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add lib/firebase/firestore.ts
git commit -m "feat(firebase): add Firestore instance export"
```

---

### Task 2: Create quiz types

**Files:**
- Create: `features/elementary/quiz/types/quiz.types.ts`

- [ ] **Step 1: Create types file**

Create `features/elementary/quiz/types/quiz.types.ts`:

```typescript
import type { Timestamp } from "firebase/firestore"

/** A single quiz question stored in Firestore `questions` collection */
export interface QuizQuestion {
  id: string
  content: string
  type: "quiz" | "fill_in_blank"
  options: QuizOption[]
}

export interface QuizOption {
  content: string
  isCorrect: boolean
}

/** An answer record stored in Firestore `answers` collection */
export interface QuizAnswer {
  id: string
  questionId: string
  groupId: string
  quizId: string
  selectedOption: number
  isCorrect: boolean
  answeredAt: Timestamp
}

/** Derived leaderboard entry computed from answers */
export interface LeaderboardEntry {
  groupId: string
  groupName: string
  score: number
  correctCount: number
  totalTime: number
  rank: number
}

/** Quiz state machine */
export type QuizStatus = "loading" | "active" | "result"
```

- [ ] **Step 2: Commit**

```bash
git add features/elementary/quiz/types/quiz.types.ts
git commit -m "feat(quiz): add TypeScript interfaces for quiz feature"
```

---

### Task 3: Create mock data for development

**Files:**
- Create: `features/elementary/quiz/mock/quiz.mock.ts`
- Create: `features/elementary/quiz/mock/index.ts`

- [ ] **Step 1: Create mock questions and helpers**

Create `features/elementary/quiz/mock/quiz.mock.ts`:

```typescript
import type { QuizQuestion, QuizAnswer, LeaderboardEntry } from "../types/quiz.types"

/** Mock quiz ID used across the feature */
export const MOCK_QUIZ_ID = "quiz-1-1-vietnamese-01"

/** 10 mock questions — Vietnamese language for class 1/1 */
export const mockQuestions: QuizQuestion[] = [
  {
    id: "q1",
    content: "Từ nào sau đây là từ đồng nghĩa với 'vui'?",
    type: "quiz",
    options: [
      { content: "Buồn", isCorrect: false },
      { content: "Hạnh phúc", isCorrect: true },
      { content: "Mệt mỏi", isCorrect: false },
      { content: "Tức giận", isCorrect: false },
    ],
  },
  {
    id: "q2",
    content: "Hình nào sau đây là hình tròn?",
    type: "quiz",
    options: [
      { content: "Hình vuông", isCorrect: false },
      { content: "Hình tam giác", isCorrect: false },
      { content: "Hình tròn", isCorrect: true },
      { content: "Hình chữ nhật", isCorrect: false },
    ],
  },
  {
    id: "q3",
    content: "Con vật nào sau đây biết bay?",
    type: "quiz",
    options: [
      { content: "Con chó", isCorrect: false },
      { content: "Con mèo", isCorrect: false },
      { content: "Con chim", isCorrect: true },
      { content: "Con cá", isCorrect: false },
    ],
  },
  {
    id: "q4",
    content: "1 + 1 = ?",
    type: "quiz",
    options: [
      { content: "1", isCorrect: false },
      { content: "2", isCorrect: true },
      { content: "3", isCorrect: false },
      { content: "4", isCorrect: false },
    ],
  },
  {
    id: "q5",
    content: "Màu của bầu trời là gì?",
    type: "quiz",
    options: [
      { content: "Xanh lá", isCorrect: false },
      { content: "Đỏ", isCorrect: false },
      { content: "Vàng", isCorrect: false },
      { content: "Xanh dương", isCorrect: true },
    ],
  },
  {
    id: "q6",
    content: "Nước nào có hình dáng giống chữ S?",
    type: "quiz",
    options: [
      { content: "Trung Quốc", isCorrect: false },
      { content: "Việt Nam", isCorrect: true },
      { content: "Nhật Bản", isCorrect: false },
      { content: "Hàn Quốc", isCorrect: false },
    ],
  },
  {
    id: "q7",
    content: "Mùa nào có tuyết rơi ở miền Bắc?",
    type: "quiz",
    options: [
      { content: "Mùa xuân", isCorrect: false },
      { content: "Mùa hạ", isCorrect: false },
      { content: "Mùa đông", isCorrect: true },
      { content: "Mùa thu", isCorrect: false },
    ],
  },
  {
    id: "q8",
    content: "Từ trái nghĩa với 'nóng' là gì?",
    type: "quiz",
    options: [
      { content: "Lạnh", isCorrect: true },
      { content: "Nắng", isCorrect: false },
      { content: "Khô", isCorrect: false },
      { content: "Ẩm", isCorrect: false },
    ],
  },
  {
    id: "q9",
    content: "Cái nào dùng để viết trên bảng?",
    type: "quiz",
    options: [
      { content: "Giấy", isCorrect: false },
      { content: "Bút chì", isCorrect: false },
      { content: "Phấn", isCorrect: true },
      { content: "Cọ vẽ", isCorrect: false },
    ],
  },
  {
    id: "q10",
    content: "3 + 4 = ?",
    type: "quiz",
    options: [
      { content: "5", isCorrect: false },
      { content: "6", isCorrect: false },
      { content: "7", isCorrect: true },
      { content: "8", isCorrect: false },
    ],
  },
]

/** Mock leaderboard entries for development */
export const mockLeaderboard: LeaderboardEntry[] = [
  { groupId: "g-1-1-03", groupName: "Nhóm 3", score: 90, correctCount: 9, totalTime: 135, rank: 1 },
  { groupId: "g-1-1-01", groupName: "Nhóm 1", score: 80, correctCount: 8, totalTime: 150, rank: 2 },
  { groupId: "g-1-1-02", groupName: "Nhóm 2", score: 70, correctCount: 7, totalTime: 165, rank: 3 },
  { groupId: "g-1-1-04", groupName: "Nhóm 4", score: 60, correctCount: 6, totalTime: 180, rank: 4 },
]

/** Helper: compute correct count from answers */
export function computeScore(answers: QuizAnswer[]): {
  score: number
  correctCount: number
} {
  const correctCount = answers.filter((a) => a.isCorrect).length
  return { score: correctCount * 10, correctCount }
}

/** Helper: compute total time in seconds from first to last answer */
export function computeTotalTime(answers: QuizAnswer[]): number {
  if (answers.length < 2) return 0
  const sorted = [...answers].sort(
    (a, b) => a.answeredAt.toMillis() - b.answeredAt.toMillis()
  )
  const first = sorted[0].answeredAt.toMillis()
  const last = sorted[sorted.length - 1].answeredAt.toMillis()
  return Math.round((last - first) / 1000)
}

/** Default quiz duration in seconds (10 minutes) */
export const QUIZ_DURATION_SECONDS = 600
```

- [ ] **Step 2: Create barrel export**

Create `features/elementary/quiz/mock/index.ts`:

```typescript
export * from "./quiz.mock"
```

- [ ] **Step 3: Commit**

```bash
git add features/elementary/quiz/mock/
git commit -m "feat(quiz): add mock questions and leaderboard data"
```

---

### Task 4: Create useQuizTimer hook

**Files:**
- Create: `features/elementary/quiz/hooks/use-quiz-timer.ts`

- [ ] **Step 1: Create the timer hook**

Create `features/elementary/quiz/hooks/use-quiz-timer.ts`:

```typescript
"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface UseQuizTimerReturn {
  timeRemaining: number
  isWarning: boolean
  isRunning: boolean
  start: () => void
  stop: () => void
  reset: (seconds: number) => void
}

export function useQuizTimer(
  initialSeconds: number,
  onTimeUp: () => void
): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTimeUpRef = useRef(onTimeUp)

  // Keep callback ref fresh without re-triggering the effect
  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const reset = useCallback(
    (seconds: number) => {
      stop()
      setTimeRemaining(seconds)
    },
    [stop]
  )

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          stop()
          onTimeUpRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, stop])

  return {
    timeRemaining,
    isWarning: timeRemaining <= 60 && timeRemaining > 0,
    isRunning,
    start,
    stop,
    reset,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add features/elementary/quiz/hooks/use-quiz-timer.ts
git commit -m "feat(quiz): add useQuizTimer hook with countdown logic"
```

---

### Task 5: Create useQuizQuestions hook

**Files:**
- Create: `features/elementary/quiz/hooks/use-quiz-questions.ts`

- [ ] **Step 1: Create the questions hook**

Create `features/elementary/quiz/hooks/use-quiz-questions.ts`:

```typescript
"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
import type { QuizQuestion } from "../types/quiz.types"
import { mockQuestions } from "../mock/quiz.mock"

interface UseQuizQuestionsReturn {
  questions: QuizQuestion[]
  loading: boolean
  error: string | null
}

/**
 * Fetch quiz questions from Firestore.
 * Falls back to mock data if Firestore is unavailable (development).
 */
export function useQuizQuestions(quizId: string): UseQuizQuestionsReturn {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchQuestions() {
      try {
        setLoading(true)
        setError(null)

        const snapshot = await getDocs(collection(db, "questions"))

        if (cancelled) return

        if (snapshot.empty) {
          // Fallback to mock data when Firestore has no questions yet
          setQuestions(mockQuestions)
        } else {
          const fetched: QuizQuestion[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            content: doc.data().content,
            type: doc.data().type,
            options: doc.data().options,
          }))
          setQuestions(fetched)
        }
      } catch (err) {
        if (cancelled) return
        console.warn("Firestore unavailable, using mock data:", err)
        // Fallback to mock data on error (e.g., no Firestore rules configured yet)
        setQuestions(mockQuestions)
        setError(null) // Don't show error — mock data is fine for dev
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchQuestions()
    return () => { cancelled = true }
  }, [quizId])

  return { questions, loading, error }
}
```

- [ ] **Step 2: Commit**

```bash
git add features/elementary/quiz/hooks/use-quiz-questions.ts
git commit -m "feat(quiz): add useQuizQuestions hook with Firestore + mock fallback"
```

---

### Task 6: Create useQuizAnswers hook (realtime)

**Files:**
- Create: `features/elementary/quiz/hooks/use-quiz-answers.ts`

- [ ] **Step 1: Create the answers hook**

Create `features/elementary/quiz/hooks/use-quiz-answers.ts`:

```typescript
"use client"

import { useEffect, useState, useCallback } from "react"
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
import type { QuizAnswer } from "../types/quiz.types"

interface UseQuizAnswersReturn {
  /** All answers across all groups for this quiz (for leaderboard) */
  allAnswers: QuizAnswer[]
  /** This group's answers only */
  groupAnswers: QuizAnswer[]
  /** Submit or update an answer for this group */
  submitAnswer: (
    questionId: string,
    selectedIndex: number,
    isCorrect: boolean
  ) => Promise<void>
  loading: boolean
}

/**
 * Manages quiz answers for a group:
 * - Subscribes to ALL answers for the quiz (realtime, for leaderboard)
 * - Provides submitAnswer to write/update this group's answers
 */
export function useQuizAnswers(
  quizId: string,
  groupId: string
): UseQuizAnswersReturn {
  const [allAnswers, setAllAnswers] = useState<QuizAnswer[]>([])
  const [loading, setLoading] = useState(true)

  // Subscribe to all answers for this quiz — realtime updates for leaderboard
  useEffect(() => {
    const q = query(
      collection(db, "answers"),
      where("quizId", "==", quizId)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const answers: QuizAnswer[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          questionId: doc.data().questionId,
          groupId: doc.data().groupId,
          quizId: doc.data().quizId,
          selectedOption: doc.data().selectedOption,
          isCorrect: doc.data().isCorrect,
          answeredAt: doc.data().answeredAt,
        }))
        setAllAnswers(answers)
        setLoading(false)
      },
      (err) => {
        console.warn("Firestore subscription error, using empty answers:", err)
        setAllAnswers([])
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [quizId])

  // Filter answers for this specific group
  const groupAnswers = allAnswers.filter((a) => a.groupId === groupId)

  // Submit an answer — if the group already answered this question, we need to update
  // Using addDoc for simplicity (each selection creates a new record).
  // For the leaderboard, we take the LATEST answer per questionId per groupId.
  const submitAnswer = useCallback(
    async (
      questionId: string,
      selectedIndex: number,
      isCorrect: boolean
    ): Promise<void> => {
      try {
        await addDoc(collection(db, "answers"), {
          questionId,
          groupId,
          quizId,
          selectedOption: selectedIndex,
          isCorrect,
          answeredAt: serverTimestamp(),
        })
      } catch (err) {
        console.error("Failed to submit answer:", err)
        throw err
      }
    },
    [quizId, groupId]
  )

  return { allAnswers, groupAnswers, submitAnswer, loading }
}
```

- [ ] **Step 2: Commit**

```bash
git add features/elementary/quiz/hooks/use-quiz-answers.ts
git commit -m "feat(quiz): add useQuizAnswers hook with Firestore realtime subscription"
```

---

### Task 7: Create useLeaderboard hook

**Files:**
- Create: `features/elementary/quiz/hooks/use-leaderboard.ts`

- [ ] **Step 1: Create the leaderboard hook**

Create `features/elementary/quiz/hooks/use-leaderboard.ts`:

```typescript
"use client"

import { useMemo } from "react"
import type { QuizAnswer, LeaderboardEntry } from "../types/quiz.types"

/** Group names for mock display — in production, fetch from Firestore groups collection */
const GROUP_NAMES: Record<string, string> = {
  "g-1-1-01": "Nhóm 1",
  "g-1-1-02": "Nhóm 2",
  "g-1-1-03": "Nhóm 3",
  "g-1-1-04": "Nhóm 4",
  "g-1-1-05": "Nhóm 5",
}

interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[]
  currentRank: number
}

/**
 * Derives leaderboard from all answers.
 * Groups answers by groupId, computes scores, and sorts by rank.
 * Latest answer per question per group wins (handles re-answers).
 */
export function useLeaderboard(
  allAnswers: QuizAnswer[],
  currentGroupId: string
): UseLeaderboardReturn {
  return useMemo(() => {
    if (allAnswers.length === 0) {
      return { leaderboard: [], currentRank: -1 }
    }

    // Keep only the latest answer per question per group
    const latestByGroup = new Map<string, Map<string, QuizAnswer>>()

    // Sort by answeredAt ascending so last write wins
    const sorted = [...allAnswers].sort(
      (a, b) => a.answeredAt.toMillis() - b.answeredAt.toMillis()
    )

    for (const answer of sorted) {
      if (!latestByGroup.has(answer.groupId)) {
        latestByGroup.set(answer.groupId, new Map())
      }
      latestByGroup.get(answer.groupId)!.set(answer.questionId, answer)
    }

    // Compute score for each group
    const entries: LeaderboardEntry[] = []
    for (const [groupId, questionMap] of latestByGroup) {
      const answers = Array.from(questionMap.values())
      const correctCount = answers.filter((a) => a.isCorrect).length
      const score = correctCount * 10

      // Compute total time from first to last answer
      let totalTime = 0
      if (answers.length >= 2) {
        const timestamps = answers
          .map((a) => a.answeredAt.toMillis())
          .sort((a, b) => a - b)
        totalTime = Math.round(
          (timestamps[timestamps.length - 1] - timestamps[0]) / 1000
        )
      }

      entries.push({
        groupId,
        groupName: GROUP_NAMES[groupId] || groupId,
        score,
        correctCount,
        totalTime,
        rank: 0,
      })
    }

    // Sort by score DESC, then totalTime ASC (faster = better for tiebreak)
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.totalTime - b.totalTime
    })

    // Assign ranks
    entries.forEach((entry, i) => {
      entry.rank = i + 1
    })

    const currentEntry = entries.find((e) => e.groupId === currentGroupId)

    return {
      leaderboard: entries,
      currentRank: currentEntry?.rank ?? -1,
    }
  }, [allAnswers, currentGroupId])
}
```

- [ ] **Step 2: Commit**

```bash
git add features/elementary/quiz/hooks/use-leaderboard.ts
git commit -m "feat(quiz): add useLeaderboard hook with score calculation"
```

---

### Task 8: Create QuizTimer component

**Files:**
- Create: `features/elementary/quiz/components/quiz-timer.tsx`

- [ ] **Step 1: Create the timer component**

Create `features/elementary/quiz/components/quiz-timer.tsx`:

```tsx
"use client"

import { ClockIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizTimerProps {
  timeRemaining: number
  isWarning: boolean
}

/** Format seconds to MM:SS */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function QuizTimer({ timeRemaining, isWarning }: QuizTimerProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold tabular-nums",
        isWarning
          ? "bg-red-50 text-red-600 animate-pulse"
          : "bg-gray-100 text-gray-700"
      )}
    >
      <ClockIcon className="h-4 w-4" />
      {formatTime(timeRemaining)}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/elementary/quiz/components/quiz-timer.tsx
git commit -m "feat(quiz): add QuizTimer component"
```

---

### Task 9: Create QuizQuestion component

**Files:**
- Create: `features/elementary/quiz/components/quiz-question.tsx`
- Create: `features/elementary/quiz/components/quiz-question.module.css`

- [ ] **Step 1: Create the question styles**

Create `features/elementary/quiz/components/quiz-question.module.css`:

```css
.card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.questionNum {
  font-size: 14px;
  color: hsl(var(--muted-foreground));
}

.questionContent {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 8px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 2px solid hsl(var(--border));
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.15s ease;
  background: transparent;
  text-align: left;
  width: 100%;
}

.option:hover {
  border-color: hsl(var(--primary));
  background: hsl(var(--primary) / 0.04);
}

.optionSelected {
  border-color: hsl(var(--primary));
  background: hsl(var(--primary) / 0.08);
}

.optionCorrect {
  border-color: hsl(var(--success, 142 71% 45%));
  background: hsl(var(--success, 142 71% 45%) / 0.1);
  animation: flashCorrect 0.5s ease;
}

.optionWrong {
  border-color: hsl(var(--danger, 0 84% 60%));
  background: hsl(var(--danger, 0 84% 60%) / 0.1);
  animation: flashWrong 0.5s ease;
}

.optionLetter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 14px;
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  flex-shrink: 0;
}

.optionSelected .optionLetter {
  background: hsl(var(--primary));
  color: white;
}

.optionCorrect .optionLetter {
  background: hsl(var(--success, 142 71% 45%));
  color: white;
}

.optionWrong .optionLetter {
  background: hsl(var(--danger, 0 84% 60%));
  color: white;
}

.nav {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.navBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s;
}

.navBtnPrev {
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
}

.navBtnPrev:hover {
  background: hsl(var(--muted) / 0.8);
}

.navBtnNext {
  background: hsl(var(--primary));
  color: white;
}

.navBtnNext:hover {
  opacity: 0.9;
}

.navBtnSubmit {
  background: hsl(var(--success, 142 71% 45%));
  color: white;
}

.navBtnSubmit:hover {
  opacity: 0.9;
}

.navBtnDisabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes flashCorrect {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

@keyframes flashWrong {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

- [ ] **Step 2: Create the question component**

Create `features/elementary/quiz/components/quiz-question.tsx`:

```tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeftIcon, ChevronRightIcon, SendIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuizQuestion as QuizQuestionType } from "../types/quiz.types"
import styles from "./quiz-question.module.css"

const OPTION_LETTERS = ["A", "B", "C", "D"]

interface QuizQuestionProps {
  question: QuizQuestionType
  questionNumber: number
  totalQuestions: number
  /** Currently selected option index (from previous answer), -1 if not answered */
  selectedIndex: number
  /** Called when user selects an option — parent decides whether to auto-advance */
  onSelect: (optionIndex: number) => void
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
  /** True when on the last question */
  isLast: boolean
  /** True when on the first question */
  isFirst: boolean
  /** All questions answered (for showing submit button) */
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

  // Reset feedback when question changes
  useEffect(() => {
    setFeedback(null)
  }, [question.id])

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (feedback !== null) return // Don't allow re-select during feedback
      onSelect(optionIndex)

      // Show feedback
      const isCorrect = question.options[optionIndex].isCorrect
      setFeedback(isCorrect ? "correct" : "wrong")
    },
    [feedback, onSelect, question.options]
  )

  return (
    <div className={styles.card}>
      {/* Header: question number */}
      <div className={styles.header}>
        <span className={styles.questionNum}>
          Câu <strong>{questionNumber}</strong> / {totalQuestions}
        </span>
      </div>

      {/* Question content */}
      <div className={styles.questionContent}>{question.content}</div>

      {/* Options */}
      <div className={styles.options}>
        {question.options.map((option, idx) => {
          let optionClass = styles.option
          if (idx === selectedIndex) {
            if (feedback === "correct") optionClass = cn(styles.option, styles.optionCorrect)
            else if (feedback === "wrong") optionClass = cn(styles.option, styles.optionWrong)
            else optionClass = cn(styles.option, styles.optionSelected)
          }

          return (
            <button
              key={idx}
              type="button"
              className={optionClass}
              onClick={() => handleSelect(idx)}
              disabled={feedback !== null}
            >
              <span className={styles.optionLetter}>{OPTION_LETTERS[idx]}</span>
              <span>{option.content}</span>
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className={styles.nav}>
        <button
          type="button"
          className={cn(styles.navBtn, styles.navBtnPrev, isFirst && styles.navBtnDisabled)}
          onClick={onPrev}
          disabled={isFirst}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Câu trước
        </button>

        {isLast && allAnswered ? (
          <button
            type="button"
            className={cn(styles.navBtn, styles.navBtnSubmit)}
            onClick={onSubmit}
          >
            Nộp bài
            <SendIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            className={cn(styles.navBtn, styles.navBtnNext)}
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

- [ ] **Step 3: Commit**

```bash
git add features/elementary/quiz/components/quiz-question.tsx features/elementary/quiz/components/quiz-question.module.css
git commit -m "feat(quiz): add QuizQuestion component with option selection and feedback"
```

---

### Task 10: Create QuizLeaderboard component

**Files:**
- Create: `features/elementary/quiz/components/quiz-leaderboard.tsx`
- Create: `features/elementary/quiz/components/quiz-leaderboard.module.css`

- [ ] **Step 1: Create the leaderboard styles**

Create `features/elementary/quiz/components/quiz-leaderboard.module.css`:

```css
.sidebar {
  width: 240px;
  border-left: 1px solid hsl(var(--border));
  padding: 16px;
  background: hsl(var(--muted) / 0.3);
  flex-shrink: 0;
  overflow-y: auto;
}

.title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  background: transparent;
  transition: background 0.2s;
}

.entryGold {
  background: hsl(48 96% 53% / 0.1);
}

.entrySilver {
  background: hsl(142 71% 45% / 0.05);
}

.entryCurrent {
  background: hsl(var(--primary) / 0.06);
  border: 2px solid hsl(var(--primary));
  font-weight: 600;
}

.rank {
  font-size: 16px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.rankNum {
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--muted-foreground));
}

.groupName {
  flex: 1;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.score {
  font-size: 13px;
  font-weight: 700;
  color: hsl(var(--primary));
}

.footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid hsl(var(--border));
  text-align: center;
  font-size: 11px;
  color: hsl(var(--muted-foreground));
}

.liveIndicator {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: hsl(var(--success, 142 71% 45%));
  animation: pulse 1.5s infinite;
  margin-right: 4px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Mobile: hide sidebar */
@media (max-width: 680px) {
  .sidebar {
    display: none;
  }
}
```

- [ ] **Step 2: Create the leaderboard component**

Create `features/elementary/quiz/components/quiz-leaderboard.tsx`:

```tsx
"use client"

import type { LeaderboardEntry } from "../types/quiz.types"
import { cn } from "@/lib/utils"
import styles from "./quiz-leaderboard.module.css"

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
    <div className={styles.sidebar}>
      <div className={styles.title}>
        🏆 Bảng xếp hạng
      </div>

      <div className={styles.list}>
        {leaderboard.map((entry) => {
          const isCurrent = entry.groupId === currentGroupId
          const medal = entry.rank <= 3 ? MEDALS[entry.rank - 1] : null

          return (
            <div
              key={entry.groupId}
              className={cn(
                styles.entry,
                entry.rank === 1 && styles.entryGold,
                entry.rank === 2 && !isCurrent && styles.entrySilver,
                isCurrent && styles.entryCurrent
              )}
            >
              <span className={styles.rank}>
                {medal || <span className={styles.rankNum}>{entry.rank}</span>}
              </span>
              <span className={styles.groupName}>
                {entry.groupName}
                {isCurrent && " (bạn)"}
              </span>
              <span className={styles.score}>{entry.score}</span>
            </div>
          )
        })}

        {leaderboard.length === 0 && (
          <div style={{ textAlign: "center", padding: "16px 0", fontSize: 13, color: "hsl(var(--muted-foreground))" }}>
            Chưa có dữ liệu
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.liveIndicator} />
        Cập nhật realtime
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add features/elementary/quiz/components/quiz-leaderboard.tsx features/elementary/quiz/components/quiz-leaderboard.module.css
git commit -m "feat(quiz): add QuizLeaderboard component with realtime indicator"
```

---

### Task 11: Create QuizResult component

**Files:**
- Create: `features/elementary/quiz/components/quiz-result.tsx`
- Create: `features/elementary/quiz/components/quiz-result.module.css`

- [ ] **Step 1: Create the result styles**

Create `features/elementary/quiz/components/quiz-result.module.css`:

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  text-align: center;
}

.medal {
  font-size: 64px;
  margin-bottom: 8px;
}

.rankTitle {
  font-size: 24px;
  font-weight: 700;
}

.groupLabel {
  font-size: 14px;
  color: hsl(var(--muted-foreground));
  margin-top: 4px;
  margin-bottom: 24px;
}

.stats {
  display: flex;
  gap: 32px;
  margin-bottom: 28px;
}

.statItem {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.statValue {
  font-size: 28px;
  font-weight: 700;
  color: hsl(var(--primary));
}

.statLabel {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
}

.finalLeaderboard {
  width: 100%;
  max-width: 320px;
  padding: 16px;
  background: hsl(var(--muted) / 0.5);
  border-radius: 12px;
  margin-bottom: 24px;
}

.finalTitle {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.finalList {
  font-size: 13px;
  line-height: 1.8;
  color: hsl(var(--muted-foreground));
}

.finalHighlight {
  font-weight: 700;
  color: hsl(var(--foreground));
}

.backBtn {
  padding: 12px 32px;
  border-radius: 10px;
  border: none;
  background: hsl(var(--primary));
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.backBtn:hover {
  opacity: 0.9;
}
```

- [ ] **Step 2: Create the result component**

Create `features/elementary/quiz/components/quiz-result.tsx`:

```tsx
"use client"

import type { LeaderboardEntry } from "../types/quiz.types"
import styles from "./quiz-result.module.css"

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

/** Format seconds to MM:SS */
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
    <div className={styles.container}>
      {/* Medal */}
      <div className={styles.medal}>{medal || "🎯"}</div>

      {/* Rank */}
      <div className={styles.rankTitle}>Xếp hạng #{rank}</div>
      <div className={styles.groupLabel}>{groupName}</div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{score}</div>
          <div className={styles.statLabel}>điểm</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{correctCount}/10</div>
          <div className={styles.statLabel}>đúng</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{formatTime(totalTime)}</div>
          <div className={styles.statLabel}>thời gian</div>
        </div>
      </div>

      {/* Final leaderboard */}
      <div className={styles.finalLeaderboard}>
        <div className={styles.finalTitle}>🏆 Bảng xếp hạng cuối cùng</div>
        <div className={styles.finalList}>
          {leaderboard.slice(0, 5).map((entry) => {
            const m = entry.rank <= 3 ? MEDALS[entry.rank - 1] : `${entry.rank}.`
            const isCurrent = entry.groupId === groupName
            return (
              <div key={entry.groupId}>
                {m}{" "}
                <span className={isCurrent ? styles.finalHighlight : undefined}>
                  {entry.groupName}
                </span>{" "}
                — {entry.score} điểm
              </div>
            )
          })}
        </div>
      </div>

      {/* Back button */}
      <button
        type="button"
        className={styles.backBtn}
        onClick={onBackToGroups}
      >
        Về danh sách nhóm
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add features/elementary/quiz/components/quiz-result.tsx features/elementary/quiz/components/quiz-result.module.css
git commit -m "feat(quiz): add QuizResult component with stats and final leaderboard"
```

---

### Task 12: Create QuizPage component + styles

**Files:**
- Create: `features/elementary/quiz/components/quiz-page.tsx`
- Create: `features/elementary/quiz/components/quiz-page.module.css`

- [ ] **Step 1: Create the page styles**

Create `features/elementary/quiz/components/quiz-page.module.css`:

```css
.pageWrap {
  display: flex;
  min-height: 100vh;
}

.quizArea {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  max-width: 700px;
}

.quizHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.progressBar {
  height: 4px;
  background: hsl(var(--muted));
  border-radius: 2px;
  margin-bottom: 24px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: hsl(var(--primary));
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Loading state */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 12px;
  color: hsl(var(--muted-foreground));
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid hsl(var(--muted));
  border-top-color: hsl(var(--primary));
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Mobile */
@media (max-width: 680px) {
  .quizArea {
    padding: 16px;
  }
}
```

- [ ] **Step 2: Create the QuizPage component**

Create `features/elementary/quiz/components/quiz-page.tsx`:

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
import styles from "./quiz-page.module.css"

interface QuizPageProps {
  groupId?: string
  classId?: string
}

export function QuizPage({ groupId = "g-1-1-01", classId = "1-1" }: QuizPageProps) {
  const router = useRouter()
  const [status, setStatus] = useState<QuizStatus>("loading")
  const [currentIdx, setCurrentIdx] = useState(0)

  // Fetch questions
  const { questions } = useQuizQuestions(MOCK_QUIZ_ID)

  // Answers: write + subscribe realtime
  const { allAnswers, groupAnswers, submitAnswer } = useQuizAnswers(
    MOCK_QUIZ_ID,
    groupId
  )

  // Leaderboard
  const { leaderboard, currentRank } = useLeaderboard(allAnswers, groupId)

  // Determine which questions this group has answered (latest answer per question)
  const answeredMap = useMemo(() => {
    const map = new Map<string, { selectedOption: number; isCorrect: boolean }>()
    const sorted = [...groupAnswers].sort(
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

  // Start loading → active transition
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

  // Loading state
  if (status === "loading" || !currentQuestion) {
    return (
      <div className={styles.pageWrap}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Đang tải câu hỏi...</span>
        </div>
      </div>
    )
  }

  // Result state
  if (status === "result") {
    const currentGroup = leaderboard.find((e) => e.groupId === groupId)
    return (
      <div className={styles.pageWrap}>
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

  // Active quiz state
  const answer = answeredMap.get(currentQuestion.id)
  const selectedIndex = answer?.selectedOption ?? -1
  const answeredCount = answeredMap.size

  return (
    <div className={styles.pageWrap}>
      <div className={styles.quizArea}>
        {/* Header with timer */}
        <div className={styles.quizHeader}>
          <span style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
            Nhóm {groupId.split("-").pop()}
          </span>
          <QuizTimer timeRemaining={timeRemaining} isWarning={isWarning} />
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
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

      {/* Leaderboard sidebar */}
      <QuizLeaderboard
        leaderboard={leaderboard}
        currentGroupId={groupId}
      />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add features/elementary/quiz/components/quiz-page.tsx features/elementary/quiz/components/quiz-page.module.css
git commit -m "feat(quiz): add QuizPage main layout component"
```

---

### Task 13: Wire up route page

**Files:**
- Modify: `app/elementary-student/quiz/page.tsx`

- [ ] **Step 1: Write the route page**

Replace content of `app/elementary-student/quiz/page.tsx` with:

```tsx
import { QuizPage } from "@/features/elementary/quiz/components/quiz-page"

export default async function QuizRoute({
  searchParams,
}: {
  searchParams: Promise<{ group?: string; class?: string }>
}) {
  const params = await searchParams
  return <QuizPage groupId={params.group} classId={params.class} />
}
```

- [ ] **Step 2: Verify build**

Run: `npm run typecheck`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/elementary-student/quiz/page.tsx
git commit -m "feat(quiz): wire route page to QuizPage component"
```

---

### Task 14: Final verification

- [ ] **Step 1: Run typecheck**

Run: `npm run typecheck`
Expected: No TypeScript errors.

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds. Quiz page is statically analyzed without errors.

- [ ] **Step 3: Run dev server and test manually**

Run: `npm run dev`
Navigate to: `http://localhost:3000/elementary-student/quiz?group=g-1-1-01&class=1-1`

Verify:
- Loading spinner shows briefly, then quiz loads
- Timer counts down from 10:00
- Options are clickable with selection highlight
- "Câu trước" / "Câu tiếp" navigation works
- Progress bar updates
- Leaderboard sidebar shows (may be empty if no other groups have answered yet)
- "Nộp bài" appears on last question when all answered
- Result screen shows after submission

- [ ] **Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "fix(quiz): final adjustments and polish"
```

---

## Self-Review Checklist

**Spec coverage:**
- Flow Lớp → Nhóm → Quiz → route wired at `/elementary-student/quiz` → Task 13
- 2 students per device → single device design, no auth needed per student → Tasks 12
- 10 multiple choice questions → mock data has 10 questions → Task 3
- Countdown timer → useQuizTimer hook + QuizTimer component → Tasks 4, 8
- Leaderboard realtime sidebar → useQuizAnswers (onSnapshot) + useLeaderboard + QuizLeaderboard → Tasks 6, 7, 10
- Result: score + rank only (no detail) → QuizResult shows medal, score, correctCount, leaderboard → Task 11
- Firebase Firestore client SDK → Firestore instance export + Firestore queries in hooks → Tasks 1, 5, 6
- CSS Modules styling → all components have .module.css files → Tasks 9, 10, 11, 12

**Placeholder scan:** No TBD, TODO, or vague steps. All code is complete.

**Type consistency:**
- `QuizQuestion`, `QuizAnswer`, `LeaderboardEntry`, `QuizStatus` defined in `quiz.types.ts` → used consistently across all hooks and components
- `MOCK_QUIZ_ID` from mock → used in QuizPage and hooks
- `QUIZ_DURATION_SECONDS` from mock → used in QuizPage timer init
- `useQuizQuestions` returns `{ questions, loading, error }` → consumed by QuizPage
- `useQuizAnswers` returns `{ allAnswers, groupAnswers, submitAnswer, loading }` → consumed by QuizPage
- `useLeaderboard` returns `{ leaderboard, currentRank }` → consumed by QuizPage
- `useQuizTimer` returns `{ timeRemaining, isWarning, isRunning, start, stop, reset }` → consumed by QuizPage
- `QuizResult` props: `{ rank, score, correctCount, totalTime, groupName, leaderboard, onBackToGroups }` → QuizPage passes all correctly
