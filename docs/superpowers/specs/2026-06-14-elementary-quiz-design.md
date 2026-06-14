# Elementary Quiz Feature — Design

**Date:** 2026-06-14
**Status:** Draft for review

## Overview

Quiz feature cho học sinh tiểu học. Học sinh vào lớp → chọn nhóm → làm quiz trắc nghiệm (10 câu, multiple choice) cùng nhau trên 1 thiết bị. Các nhóm thi đua realtime — leaderboard hiển thị bên phải trong khi đang làm. Kết quả hiển thị điểm tổng + xếp hạng (chi tiết từng câu chỉ giáo viên xem được).

## Requirements Summary

- **Flow:** Lớp → Nhóm → Quiz
- **2 học sinh/1 thiết bị**, cùng chọn đáp án
- **10 câu trắc nghiệm** (multiple choice), có countdown timer
- **Leaderboard realtime** sidebar bên phải — hiển thị điểm + thứ hạng tất cả nhóm
- **Kết quả:** điểm tổng + xếp hạng (không hiển thị chi tiết từng câu)
- **Firebase Firestore** client SDK realtime (`onSnapshot`)

## Firebase Data Model

### `questions` collection

```typescript
interface QuizQuestion {
  id: string;
  content: string;              // "Từ nào sau đây là từ đồng nghĩa với 'vui'?"
  type: "quiz" | "fill_in_blank"; // scope: chỉ implement "quiz" hiện tại
  options: {
    content: string;            // "Hạnh phúc"
    isCorrect: boolean;         // true/false
  }[];
}
```

### `answers` collection

```typescript
interface QuizAnswer {
  id: string;
  questionId: string;
  groupId: string;
  selectedOption: number;       // index into options array (0, 1, 2, 3)
  isCorrect: boolean;
  answeredAt: Timestamp;        // Firestore timestamp
}
```

### Query strategy

- **Load questions:** `getDocs(collection(db, "questions"))` — load 10 câu một lần, không realtime cần thiết vì câu hỏi cố định
- **Ghi answers:** `addDoc(collection(db, "answers"), { ... })` — mỗi lần nhóm chọn đáp án
- **Leaderboard realtime:** `onSnapshot(query(collection(db, "answers"), where("quizId", "==", quizId)))` → client tính điểm + xếp hạng

### Leaderboard calculation (client-side)

```
1. Group answers by groupId
2. For each group: count correct answers × 10 = score
3. Sort by score DESC, then by fastest total time ASC (tiebreak)
4. Display rank + score + group name
```

## File Structure

```
features/elementary/
  quiz/
    components/
      quiz-page.tsx          — Main page layout (quiz area + leaderboard sidebar)
      quiz-page.module.css   — Styles for quiz layout
      quiz-question.tsx      — Single question card (option selection + nav buttons)
      quiz-timer.tsx         — Countdown timer component
      quiz-leaderboard.tsx   — Realtime leaderboard sidebar
      quiz-result.tsx        — Result screen after submission
    hooks/
      use-quiz-questions.ts  — Fetch questions from Firestore
      use-quiz-answers.ts    — Write answers + subscribe to all answers (realtime)
      use-leaderboard.ts     — Derived: compute leaderboard from answers
      use-quiz-timer.ts      — Countdown timer logic
    types/
      quiz.types.ts          — Shared TypeScript interfaces
    mock/
      quiz.mock.ts           — Mock data for development/testing
      index.ts

app/elementary-student/
  quiz/
    page.tsx                 — Thin page composing <QuizPage />
```

## User Flow

### 1. Student enters class

From `/elementary-student` → select a class → navigates to `/elementary-student/groups?class=<classId>`

### 2. Student selects group

Groups page shows list of groups. Student clicks "Bắt đầu quiz" → navigates to `/elementary-student/quiz?group=<groupId>&class=<classId>`

### 3. Quiz starts

- Load 10 questions from Firestore
- Start countdown timer (configurable per quiz, default 10 minutes)
- Show question 1/10 with 4 options
- Leaderboard sidebar loads realtime

### 4. Answering questions

- Student clicks an option → immediately write answer to Firestore
- Answer record: `{ questionId, groupId, selectedOption: index, isCorrect: boolean, answeredAt: Timestamp }`
- Auto-advance to next question after selection (with brief 500ms "correct/incorrect" feedback animation)
- Can go back to previous questions (answer is already saved, clicking a new option overwrites)
- Leaderboard updates in realtime as all groups answer

### 5. Quiz ends

- Timer reaches 0 → auto-submit remaining unanswered questions (no answer recorded for skipped)
- Or student clicks "Nộp bài" button after answering all questions
- Show result screen: rank, score, time, final leaderboard

## Components Design

### `QuizPage` — `features/elementary/quiz/components/quiz-page.tsx`

Layout: flex row with `quiz-area` (flex: 1) + `leaderboard-sidebar` (width: 240px)

**States:**

| State | Behavior |
|-------|----------|
| Loading | Show skeleton/spinner while fetching questions |
| Active | Quiz in progress — question card + timer + leaderboard |
| Result | Show result screen after submission |

Props: `groupId`, `classId` (from URL searchParams)

### `QuizQuestion` — `features/elementary/quiz/components/quiz-question.tsx`

Single question card:

- Header: "Câu X / 10"
- Question content (large text, readable for young students)
- 4 option buttons (A, B, C, D) — large tap targets for kids
- Selected option highlights with brand color (violet)
- Brief feedback animation: correct → green flash, wrong → red flash (500ms) then auto-advance
- Navigation: "← Câu trước" / "Câu tiếp →"
- "Nộp bài" button appears on last question (or when all answered)

Props: `question`, `selectedIndex`, `questionNumber`, `totalQuestions`, `onSelect`, `onPrev`, `onNext`, `onSubmit`

### `QuizTimer` — `features/elementary/quiz/components/quiz-timer.tsx`

- Countdown display: "MM:SS" format
- Props: `totalSeconds`, `onTimeUp`
- Warning state: turns red when < 60 seconds remaining
- When hits 0 → calls `onTimeUp` to trigger auto-submit

### `QuizLeaderboard` — `features/elementary/quiz/components/quiz-leaderboard.tsx`

- Title: "🏆 Bảng xếp hạng"
- List of groups sorted by score DESC
- Highlight current group with border/accent
- Show medal emoji (🥇🥈🥉) for top 3
- Show score for each group
- "Cập nhật realtime" indicator at bottom
- Updates smoothly as answers stream in via Firestore realtime

Props: `leaderboard: LeaderboardEntry[]`, `currentGroupId`

### `QuizResult` — `features/elementary/quiz/components/quiz-result.tsx`

- Medal display (large) based on rank
- Stats: score (điểm), correct count, time taken
- Final leaderboard (static snapshot)
- "Về danh sách nhóm" button → back to groups page

Props: `rank`, `score`, `correctCount`, `totalTime`, `leaderboard`, `onBackToGroups`

## Hooks Design

### `useQuizQuestions(quizId)`

```typescript
function useQuizQuestions(quizId: string): {
  questions: QuizQuestion[];
  loading: boolean;
  error: string | null;
}
```

- Fetch questions from Firestore on mount
- Return questions array (not realtime — questions are static)

### `useQuizAnswers(quizId, groupId)`

```typescript
function useQuizAnswers(quizId: string, groupId: string): {
  answers: QuizAnswer[];
  submitAnswer: (questionId: string, selectedIndex: number, isCorrect: boolean) => Promise<void>;
  loading: boolean;
}
```

- `submitAnswer`: write to `answers` collection
- Subscribe to all answers for this quiz via `onSnapshot` — used by leaderboard

### `useLeaderboard(answers, groupId)`

```typescript
function useLeaderboard(allAnswers: QuizAnswer[], currentGroupId: string): {
  leaderboard: LeaderboardEntry[];
  currentRank: number;
}
```

- Pure computation from answers data
- Groups answers by groupId, calculates scores, sorts

### `useQuizTimer(totalSeconds, onTimeUp)`

```typescript
function useQuizTimer(totalSeconds: number, onTimeUp: () => void): {
  timeRemaining: number;
  isWarning: boolean; // true when < 60s
  start: () => void;
  stop: () => void;
}
```

- Starts on `start()` call
- Calls `onTimeUp` when countdown reaches 0

## Styling

- CSS Modules for feature components (follows existing elementary pattern)
- Large touch targets (min 48px) for student usability
- Brand violet (#7c3aed) for selected option, navigation buttons
- Green flash for correct, red flash for wrong answer feedback
- Warning red for timer < 60s
- Medal colors: gold/silver/bronze for leaderboard ranks
- Leaderboard sidebar: subtle background (#fafafa), 240px width, fixed position in layout

## Not In Scope

- **fill_in_blank** question type — deferred to future iteration
- **Quiz creation/editing** by teacher — teacher quiz management is separate feature
- **Quiz settings** (time limit, question count) — hardcoded defaults for now
- **Persistent quiz state** — if student refreshes page, quiz resets (no resume)
- **Admin/teacher quiz detail view** — separate feature
- **Multiple quiz sessions** — one quiz per group per class
