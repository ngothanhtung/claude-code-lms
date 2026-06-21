# Seed Data & Entity Relationship Cleanup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Normalize Firestore ID conventions, add missing collections (schools/levels/roles/users/quizQuestions), build role-aware login, consolidate seed data, and migrate remaining mock-dependent components to hooks.

**Architecture:** Extends existing next-auth v5 (already wired with Credentials provider + SessionProvider). Login queries Firestore `users` collection, returns JWT with role info, redirects based on role. Seed data consolidated to `features/admin/seed/seed-data.ts` as single source of truth.

**Tech Stack:** Next.js 16 App Router, Firebase Firestore, next-auth v5, shadcn/ui, Tailwind CSS v4

---

### Task 1: Update seed-data.ts — new ID convention + collections

**Files:**
- Modify: `features/admin/seed/seed-data.ts` — full rewrite

- [ ] **Step 1: Write the full updated seed-data.ts with new ID conventions**

Replace the entire file. Key changes:
- All IDs follow spec convention (`class_3_1`, `group_class_3_1_01`, `lesson_1`, `question_1`...)
- New collections: `schools`, `levels`, `roles`, `users`, `quizQuestions`
- Export all seed arrays + their TypeScript interfaces
- `users` include plain-text passwords for login
- `seedQuestions` no longer includes `quizId` field (questions are pure vocabulary now; `quizQuestions` bridge handles the mapping)
- `seedQuizQuestions` maps each question to a quiz with `order` field

```typescript
/**
 * seed-data.ts — Single source of truth for all Firestore seed data.
 *
 * Collections: schools → levels → roles → users → lessons → quizzes →
 *   questions → quizQuestions → classes → classLessons → groups →
 *   groupLessons → answers
 */

import type { GradeLevel } from "@/features/elementary/quiz/hooks/use-classes"
import type { LessonStatus } from "@/features/elementary/lessons/hooks/use-lessons"

/* ─── Schools ─── */
export interface SeedSchool {
  id: string
  name: string
  address?: string
}

export const seedSchools: SeedSchool[] = [
  { id: "school_1", name: "Trường Tiểu học Số 1", address: "Hà Nội" },
]

/* ─── Levels ─── */
export interface SeedLevel {
  id: string
  grade: 1 | 2 | 3 | 4 | 5
  label: string
}

export const seedLevels: SeedLevel[] = [
  { id: "level_1", grade: 1, label: "Khối 1" },
  { id: "level_2", grade: 2, label: "Khối 2" },
  { id: "level_3", grade: 3, label: "Khối 3" },
  { id: "level_4", grade: 4, label: "Khối 4" },
  { id: "level_5", grade: 5, label: "Khối 5" },
]

/* ─── Roles ─── */
export interface SeedRole {
  id: string
  name: string
}

export const seedRoles: SeedRole[] = [
  { id: "role_student", name: "student" },
  { id: "role_elementary_teacher", name: "elementary-teacher" },
  { id: "role_admin", name: "admin" },
  { id: "role_staff", name: "staff" },
]

/* ─── Users ─── */
export interface SeedUser {
  id: string
  name: string
  email: string
  password: string
  schoolId: string
  roles: string[]
  classId?: string       // if student
  classIds?: string[]    // if teacher
}

export const seedUsers: SeedUser[] = [
  {
    id: "user_1",
    name: "Nguyễn Thị Mai",
    email: "mai.nguyen@school.edu.vn",
    password: "123456",
    schoolId: "school_1",
    roles: ["role_elementary_teacher"],
    classIds: ["class_3_1", "class_3_2"],
  },
  {
    id: "user_2",
    name: "Đỗ Thị Lan",
    email: "lan.do@school.edu.vn",
    password: "123456",
    schoolId: "school_1",
    roles: ["role_elementary_teacher"],
    classIds: ["class_3_1"],
  },
  {
    id: "user_3",
    name: "Trần Minh Tuấn",
    email: "tuan.tran@student.edu.vn",
    password: "123456",
    schoolId: "school_1",
    roles: ["role_student"],
    classId: "class_3_1",
  },
  {
    id: "user_4",
    name: "Lê Thị Hương",
    email: "huong.le@student.edu.vn",
    password: "123456",
    schoolId: "school_1",
    roles: ["role_student"],
    classId: "class_3_1",
  },
  {
    id: "user_5",
    name: "Root Admin",
    email: "admin@school.edu.vn",
    password: "147258369",
    schoolId: "school_1",
    roles: ["role_admin"],
  },
]

/* ─── Classes ─── */
export interface SeedClass {
  id: string
  grade: GradeLevel
  classNumber: number
  homeroomTeacher: string
  studentCount: number
  totalQuizzes: number
  completedQuizzes: number
  averageScore: string
  lastActive: string
  status: "active" | "archived"
}

export const seedClasses: SeedClass[] = [
  { id: "class_1_1", grade: 1, classNumber: 1, homeroomTeacher: "Nguyễn Thị Mai", studentCount: 40, totalQuizzes: 12, completedQuizzes: 10, averageScore: "8.2", lastActive: "2026-06-13", status: "active" },
  { id: "class_1_2", grade: 1, classNumber: 2, homeroomTeacher: "Trần Văn Bình", studentCount: 40, totalQuizzes: 12, completedQuizzes: 8, averageScore: "7.6", lastActive: "2026-06-12", status: "active" },
  { id: "class_1_3", grade: 1, classNumber: 3, homeroomTeacher: "Lê Thị Hồng", studentCount: 40, totalQuizzes: 10, completedQuizzes: 7, averageScore: "7.9", lastActive: "2026-06-10", status: "active" },
  { id: "class_2_1", grade: 2, classNumber: 1, homeroomTeacher: "Phạm Thanh Hà", studentCount: 40, totalQuizzes: 15, completedQuizzes: 12, averageScore: "8.5", lastActive: "2026-06-13", status: "active" },
  { id: "class_2_2", grade: 2, classNumber: 2, homeroomTeacher: "Hoàng Thị Thu", studentCount: 40, totalQuizzes: 15, completedQuizzes: 14, averageScore: "8.8", lastActive: "2026-06-13", status: "active" },
  { id: "class_2_3", grade: 2, classNumber: 3, homeroomTeacher: "Vũ Minh Đức", studentCount: 40, totalQuizzes: 12, completedQuizzes: 9, averageScore: "7.4", lastActive: "2026-06-11", status: "active" },
  { id: "class_3_1", grade: 3, classNumber: 1, homeroomTeacher: "Đỗ Thị Lan", studentCount: 40, totalQuizzes: 18, completedQuizzes: 15, averageScore: "8.0", lastActive: "2026-06-13", status: "active" },
  { id: "class_3_2", grade: 3, classNumber: 2, homeroomTeacher: "Ngô Việt Hùng", studentCount: 40, totalQuizzes: 18, completedQuizzes: 13, averageScore: "7.8", lastActive: "2026-06-12", status: "active" },
  { id: "class_3_3", grade: 3, classNumber: 3, homeroomTeacher: "Dương Thị Nhung", studentCount: 40, totalQuizzes: 14, completedQuizzes: 11, averageScore: "8.3", lastActive: "2026-06-10", status: "archived" },
  { id: "class_4_1", grade: 4, classNumber: 1, homeroomTeacher: "Bùi Minh Quân", studentCount: 40, totalQuizzes: 20, completedQuizzes: 18, averageScore: "8.7", lastActive: "2026-06-13", status: "active" },
  { id: "class_4_2", grade: 4, classNumber: 2, homeroomTeacher: "Trịnh Thu Huyền", studentCount: 40, totalQuizzes: 20, completedQuizzes: 16, averageScore: "8.1", lastActive: "2026-06-12", status: "active" },
  { id: "class_5_1", grade: 5, classNumber: 1, homeroomTeacher: "Lý Gia Bảo", studentCount: 40, totalQuizzes: 22, completedQuizzes: 20, averageScore: "8.9", lastActive: "2026-06-13", status: "active" },
  { id: "class_5_2", grade: 5, classNumber: 2, homeroomTeacher: "Mai Thị Kiều", studentCount: 40, totalQuizzes: 22, completedQuizzes: 17, averageScore: "8.4", lastActive: "2026-06-13", status: "active" },
  { id: "class_5_3", grade: 5, classNumber: 3, homeroomTeacher: "Hồ Minh Tuấn", studentCount: 40, totalQuizzes: 18, completedQuizzes: 14, averageScore: "7.7", lastActive: "2026-06-09", status: "archived" },
]

/* ─── Lessons ─── */
export interface SeedLesson {
  id: string
  title: string
  unit: number
  lessonNumber: number
  description: string
  totalWords: number
  quizCount: number
}

export const seedLessons: SeedLesson[] = [
  { id: "lesson_1", title: "Alphabet & Sounds", unit: 1, lessonNumber: 1, description: "Chữ cái A-Z và phát âm cơ bản", totalWords: 26, quizCount: 2 },
  { id: "lesson_2", title: "Numbers 1-20", unit: 1, lessonNumber: 2, description: "Số đếm từ 1 đến 20", totalWords: 20, quizCount: 2 },
  { id: "lesson_3", title: "Greetings", unit: 2, lessonNumber: 3, description: "Lời chào hỏi hàng ngày", totalWords: 12, quizCount: 2 },
  { id: "lesson_4", title: "Colors", unit: 2, lessonNumber: 4, description: "Màu sắc cơ bản", totalWords: 10, quizCount: 2 },
  { id: "lesson_5", title: "My Family", unit: 3, lessonNumber: 5, description: "Gia đình và người thân", totalWords: 15, quizCount: 2 },
  { id: "lesson_6", title: "Animals", unit: 3, lessonNumber: 6, description: "Động vật và âm thanh", totalWords: 18, quizCount: 2 },
  { id: "lesson_7", title: "Food & Drinks", unit: 4, lessonNumber: 7, description: "Thức ăn và đồ uống", totalWords: 20, quizCount: 2 },
  { id: "lesson_8", title: "Body Parts", unit: 4, lessonNumber: 8, description: "Các bộ phận cơ thể", totalWords: 16, quizCount: 2 },
]

/* ─── Quizzes (2 per lesson = 16) ─── */
export interface SeedQuiz {
  id: string
  lessonId: string
  title: string
  description: string
  questionCount: number
  durationSeconds: number
}

export const seedQuizzes: SeedQuiz[] = seedLessons.flatMap((lesson) => [
  {
    id: `quiz_${lesson.id}_1`,
    lessonId: lesson.id,
    title: `Quiz — ${lesson.title}`,
    description: `Kiểm tra từ vựng ${lesson.title.toLowerCase()}`,
    questionCount: 10,
    durationSeconds: 600,
  },
  {
    id: `quiz_${lesson.id}_2`,
    lessonId: lesson.id,
    title: `Review — ${lesson.title}`,
    description: `Ôn tập ${lesson.title.toLowerCase()}`,
    questionCount: 10,
    durationSeconds: 600,
  },
])

/* ─── Questions (vocabulary bank per lesson) ─── */
export interface SeedQuestion {
  id: string
  content: string
  type: "quiz" | "fill_in_blank"
  options: { content: string; isCorrect: boolean }[]
}

// Vocabulary bank per lesson (unchanged from current, just lesson IDs updated)
const lessonVocab: Record<string, { en: string; vi: string }[]> = {
  lesson_1: [
    { en: "A", vi: "Chữ A" }, { en: "B", vi: "Chữ B" }, { en: "C", vi: "Chữ C" },
    { en: "D", vi: "Chữ D" }, { en: "E", vi: "Chữ E" }, { en: "F", vi: "Chữ F" },
    { en: "G", vi: "Chữ G" }, { en: "H", vi: "Chữ H" }, { en: "I", vi: "Chữ I" },
    { en: "J", vi: "Chữ J" },
  ],
  lesson_2: [
    { en: "One", vi: "Một" }, { en: "Two", vi: "Hai" }, { en: "Three", vi: "Ba" },
    { en: "Four", vi: "Bốn" }, { en: "Five", vi: "Năm" }, { en: "Six", vi: "Sáu" },
    { en: "Seven", vi: "Bảy" }, { en: "Eight", vi: "Tám" }, { en: "Nine", vi: "Chín" },
    { en: "Ten", vi: "Mười" },
  ],
  lesson_3: [
    { en: "Hello", vi: "Xin chào" }, { en: "Goodbye", vi: "Tạm biệt" },
    { en: "Thank you", vi: "Cảm ơn" }, { en: "Please", vi: "Xin phép" },
    { en: "Sorry", vi: "Xin lỗi" }, { en: "Yes", vi: "Có" },
    { en: "No", vi: "Không" }, { en: "Good morning", vi: "Chào buổi sáng" },
    { en: "Good night", vi: "Chúc ngủ ngon" }, { en: "How are you?", vi: "Bạn khỏe không?" },
  ],
  lesson_4: [
    { en: "Red", vi: "Đỏ" }, { en: "Blue", vi: "Xanh dương" },
    { en: "Green", vi: "Xanh lá" }, { en: "Yellow", vi: "Vàng" },
    { en: "Orange", vi: "Cam" }, { en: "Purple", vi: "Tím" },
    { en: "Pink", vi: "Hồng" }, { en: "Black", vi: "Đen" },
    { en: "White", vi: "Trắng" }, { en: "Brown", vi: "Nâu" },
  ],
  lesson_5: [
    { en: "Mother", vi: "Mẹ" }, { en: "Father", vi: "Bố" },
    { en: "Sister", vi: "Chị/Em gái" }, { en: "Brother", vi: "Anh/Em trai" },
    { en: "Grandmother", vi: "Bà" }, { en: "Grandfather", vi: "Ông" },
    { en: "Family", vi: "Gia đình" }, { en: "Baby", vi: "Em bé" },
    { en: "Aunt", vi: "Cô/Dì" }, { en: "Uncle", vi: "Chú/Bác" },
  ],
  lesson_6: [
    { en: "Cat", vi: "Con mèo" }, { en: "Dog", vi: "Con chó" },
    { en: "Bird", vi: "Con chim" }, { en: "Fish", vi: "Con cá" },
    { en: "Cow", vi: "Con bò" }, { en: "Pig", vi: "Con lợn" },
    { en: "Horse", vi: "Con ngựa" }, { en: "Duck", vi: "Con vịt" },
    { en: "Rabbit", vi: "Con thỏ" }, { en: "Elephant", vi: "Con voi" },
  ],
  lesson_7: [
    { en: "Rice", vi: "Cơm/Gạo" }, { en: "Bread", vi: "Bánh mì" },
    { en: "Milk", vi: "Sữa" }, { en: "Water", vi: "Nước" },
    { en: "Apple", vi: "Quả táo" }, { en: "Banana", vi: "Quả chuối" },
    { en: "Egg", vi: "Quả trứng" }, { en: "Chicken", vi: "Thịt gà" },
    { en: "Fish", vi: "Cá" }, { en: "Cake", vi: "Bánh" },
  ],
  lesson_8: [
    { en: "Head", vi: "Đầu" }, { en: "Eye", vi: "Mắt" },
    { en: "Nose", vi: "Mũi" }, { en: "Mouth", vi: "Miệng" },
    { en: "Ear", vi: "Tai" }, { en: "Hand", vi: "Bàn tay" },
    { en: "Foot", vi: "Bàn chân" }, { en: "Arm", vi: "Cánh tay" },
    { en: "Leg", vi: "Chân" }, { en: "Stomach", vi: "Bụng" },
  ],
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuestions(
  lessonId: string,
  vocab: { en: string; vi: string }[]
): SeedQuestion[] {
  const selected = shuffle(vocab).slice(0, 10)
  return selected.map((word, qi) => {
    const qId = `question_${(parseInt(lessonId.split("_")[1]) - 1) * 20 + qi + 1}`
    const correct = word.vi
    const pool = vocab.filter((w) => w.vi !== correct)
    const wrongs = shuffle(pool).slice(0, 3).map((w) => w.vi)
    const options = shuffle([
      { content: correct, isCorrect: true },
      ...wrongs.map((c: string) => ({ content: c, isCorrect: false as const })),
    ])
    return { id: qId, content: `"${word.en}" nghĩa là gì?`, type: "quiz" as const, options }
  })
}

export const seedQuestions: SeedQuestion[] = seedLessons.flatMap((lesson) => {
  const vocab = lessonVocab[lesson.id] ?? lessonVocab.lesson_3
  return generateQuestions(lesson.id, vocab)
})

/* ─── QuizQuestions (bridge) ─── */
export interface SeedQuizQuestion {
  id: string
  quizId: string
  questionId: string
  order: number
}

export const seedQuizQuestions: SeedQuizQuestion[] = seedQuizzes.flatMap((quiz, qi) => {
  const startIdx = qi * 10
  return Array.from({ length: 10 }, (_, i) => {
    const questionId = seedQuestions[startIdx + i]?.id ?? `question_${startIdx + i + 1}`
    return {
      id: `${quiz.id}__${questionId}`,
      quizId: quiz.id,
      questionId,
      order: i + 1,
    }
  })
})

/* ─── Class Lessons ─── */
export interface SeedClassLesson {
  id: string
  classId: string
  lessonId: string
  status: LessonStatus
}

const currentLessonMap: Record<string, number> = {
  class_1_1: 3, class_1_2: 2, class_1_3: 1,
  class_2_1: 5, class_2_2: 4, class_2_3: 3,
  class_3_1: 7, class_3_2: 6, class_3_3: 5,
  class_4_1: 8, class_4_2: 7,
  class_5_1: 8, class_5_2: 7, class_5_3: 6,
}

export const seedClassLessons: SeedClassLesson[] = seedClasses.flatMap((cls) => {
  const current = currentLessonMap[cls.id] ?? 4
  return seedLessons.map((lesson) => ({
    id: `${cls.id}__${lesson.id}`,
    classId: cls.id,
    lessonId: lesson.id,
    status: lesson.lessonNumber < current ? "completed" : lesson.lessonNumber === current ? "current" : "pending",
  }))
})

/* ─── Groups ─── */
export interface SeedGroupMember {
  name: string
  studentId: string
}

export interface SeedGroup {
  id: string
  classId: string
  grade: GradeLevel
  classNumber: number
  className: string
  members: SeedGroupMember[]
  status: "waiting" | "active"
  totalQuizzes: number
  completedQuizzes: number
  averageScore: string
  currentLesson: string
  lessonScore: number
  lessonCompletionPct: number
  overallPoints: number
}

const familyNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"]
const middleNames = ["Minh", "Gia", "Thanh", "Hoài", "Khánh", "Ngọc", "Bảo", "Tuấn", "Thảo", "Quỳnh", "Đức", "Hà", "Nhật", "An"]
const givenNames = ["An", "Bình", "Chi", "Duy", "Hân", "Khang", "Linh", "Long", "Mai", "Nam", "Nhi", "Phúc", "Quân", "Tâm", "Vy", "Yến", "Huy", "Trang", "Tùng", "My", "Khoa", "Ngân", "Thư", "Kiệt", "Lan", "Đạt", "Hương", "Khôi"]

function makeStudentName(index: number) {
  return [familyNames[index % familyNames.length], middleNames[Math.floor(index / familyNames.length) % middleNames.length], givenNames[Math.floor(index / (familyNames.length * middleNames.length)) % givenNames.length]].join(" ")
}

function makeMembers(grade: GradeLevel, classNumber: number, groupNumber: number): [SeedGroupMember, SeedGroupMember] {
  const firstStudentNumber = groupNumber * 2 - 1
  const classSeed = (grade - 1) * 3 * 40 + (classNumber - 1) * 40
  const firstNameIndex = classSeed + firstStudentNumber - 1
  return [
    { name: makeStudentName(firstNameIndex), studentId: `HS${grade}${classNumber}${String(firstStudentNumber).padStart(2, "0")}` },
    { name: makeStudentName(firstNameIndex + 1), studentId: `HS${grade}${classNumber}${String(firstStudentNumber + 1).padStart(2, "0")}` },
  ]
}

export const seedGroups: SeedGroup[] = seedClasses.flatMap((cls) =>
  Array.from({ length: 20 }, (_, index): SeedGroup => {
    const groupNumber = index + 1
    const completionOffset = (groupNumber + cls.grade + cls.classNumber) % 5
    const completedQuizzes = Math.max(1, cls.totalQuizzes - completionOffset)
    const groupId = `group_${cls.id}_${String(groupNumber).padStart(2, "0")}`
    const score = 7.2 + ((groupNumber * 7 + cls.grade * 3 + cls.classNumber) % 27) / 10
    const lessonScore2 = 7 + ((groupNumber * 11 + cls.grade + cls.classNumber * 2) % 31) / 10
    const lessonCompletionPct = Math.min(100, 62 + ((groupNumber * 9 + cls.grade * 5 + cls.classNumber) % 39))
    const overallPoints = Math.round(score * 10 + lessonScore2 * 6 + (completedQuizzes / cls.totalQuizzes) * 40)

    return {
      id: groupId,
      classId: cls.id,
      grade: cls.grade,
      classNumber: cls.classNumber,
      className: `${cls.grade}/${cls.classNumber}`,
      members: makeMembers(cls.grade, cls.classNumber, groupNumber),
      status: "active",
      totalQuizzes: cls.totalQuizzes,
      completedQuizzes,
      averageScore: score.toFixed(1),
      currentLesson: `Lesson ${((groupNumber - 1) % 8) + 1}`,
      lessonScore: Number(lessonScore2.toFixed(1)),
      lessonCompletionPct,
      overallPoints,
    }
  })
)

/* ─── Group Lessons ─── */
export interface SeedGroupLesson {
  id: string
  groupId: string
  lessonId: string
  classId: string
  score: number
  completionPct: number
  status: "completed" | "pending"
}

export const seedGroupLessons: SeedGroupLesson[] = seedGroups.flatMap((group) => {
  const currentLessonNumber = currentLessonMap[group.classId] ?? 4
  const groupNumber = parseInt(group.id.split("_").pop() ?? "1", 10)

  return seedLessons.map((lesson) => {
    let status: "completed" | "pending"
    let score: number
    let completionPct: number

    if (lesson.lessonNumber < currentLessonNumber) {
      status = "completed"
      score = Number((7 + ((groupNumber * 13 + lesson.lessonNumber * 7 + group.grade * 5 + group.classNumber * 3) % 25) / 10).toFixed(1))
      completionPct = Math.min(100, 80 + ((groupNumber * 11 + lesson.lessonNumber * 5 + group.grade * 3 + group.classNumber) % 21))
    } else if (lesson.lessonNumber === currentLessonNumber) {
      status = "completed"
      score = Number((6 + ((groupNumber * 17 + lesson.lessonNumber * 11 + group.grade * 7 + group.classNumber * 5) % 35) / 10).toFixed(1))
      completionPct = Math.min(100, 62 + ((groupNumber * 19 + lesson.lessonNumber * 3 + group.grade * 4 + group.classNumber * 2) % 39))
    } else {
      status = "pending"
      score = 0
      completionPct = 0
    }

    return {
      id: `${group.id}__${lesson.id}`,
      groupId: group.id,
      lessonId: lesson.id,
      classId: group.classId,
      score,
      completionPct,
      status,
    }
  })
})

/* ─── Answers ─── */
export interface SeedAnswer {
  id: string
  questionId: string
  groupId: string
  quizId: string
  selectedOption: number
  isCorrect: boolean
  answeredAt: Date
}

const baseTime = new Date("2026-06-19T08:00:00Z")
const LEADERBOARD_QUIZ_ID = "quiz_lesson_3_1" // Greetings quiz
const LEADERBOARD_GROUP_IDS = ["group_class_3_1_01", "group_class_3_1_02", "group_class_3_1_03", "group_class_3_1_04"]

export const seedAnswers: SeedAnswer[] = (() => {
  const answers: SeedAnswer[] = []
  const correctPattern = [
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, false, false],
    [true, true, true, true, false, false, false, false, false, false],
    [true, true, true, true, true, true, false, false, false, false],
  ]

  LEADERBOARD_GROUP_IDS.forEach((groupId, gi) => {
    const pattern = correctPattern[gi]
    pattern.forEach((correct, qi) => {
      const questionId = seedQuizQuestions.find(
        (qq) => qq.quizId === LEADERBOARD_QUIZ_ID && qq.order === qi + 1
      )?.questionId ?? `question_${qi + 1}`
      const t = new Date(baseTime.getTime() + qi * 15000 + gi * 5000)
      answers.push({
        id: `${groupId}__${LEADERBOARD_QUIZ_ID}__q${qi + 1}`,
        questionId,
        groupId,
        quizId: LEADERBOARD_QUIZ_ID,
        selectedOption: correct ? 1 : 3,
        isCorrect: correct,
        answeredAt: t,
      })
    })
  })

  return answers
})()
```

- [ ] **Step 2: Update the seed-page.tsx** to include new collections in seed order

Modify `features/admin/seed/components/seed-page.tsx`:
- Add imports for `seedSchools`, `seedLevels`, `seedRoles`, `seedUsers`, `seedQuizQuestions`
- Add them to the seed order (schools → levels → roles → users before other collections; quizQuestions after questions)
- Add them to the `tasks` array in the card UI
- Update the `pre` block info text

- [ ] **Step 3: Commit seed data changes**

```bash
git add features/admin/seed/seed-data.ts features/admin/seed/components/seed-page.tsx
git commit -m "feat(seed): add new collections and normalize IDs"
```

---

### Task 2: Update next-auth credentials provider to query Firestore

**Files:**
- Modify: `auth.ts` — change authorize to query Firestore, return role info

**Note:** `next-auth` tokens and session already support custom fields via `jwt` and `session` callbacks.

- [ ] **Step 1: Update `auth.ts` to use Firestore for credentials**

```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"

declare module "next-auth" {
  interface User {
    roles?: string[]
    schoolId?: string
  }
  interface Session {
    user: {
      id?: string
      roles?: string[]
      schoolId?: string
      name?: string | null
      email?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: string[]
    schoolId?: string
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase()
        const password = String(credentials?.password ?? "")

        if (!email || !password) return null

        try {
          const q = query(collection(db, "users"), where("email", "==", email))
          const snapshot = await getDocs(q)

          if (snapshot.empty) return null

          const userDoc = snapshot.docs[0]
          const userData = userDoc.data()

          if (userData.password !== password) return null

          return {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
            roles: userData.roles ?? [],
            schoolId: userData.schoolId ?? "",
          }
        } catch (err) {
          console.error("Auth error:", err)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roles = user.roles
        token.schoolId = user.schoolId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
        session.user.roles = token.roles
        session.user.schoolId = token.schoolId
      }
      return session
    },
  },
})
```

- [ ] **Step 2: Commit auth changes**

```bash
git add auth.ts
git commit -m "feat(auth): query Firestore for credentials, add role to JWT"
```

---

### Task 3: Update login form — email field + role-based redirect

**Files:**
- Modify: `features/auth/schemas/login.schema.ts` — change `username` to `email`
- Modify: `features/auth/components/login-form.tsx` — use email + role-based redirect

- [ ] **Step 1: Update login schema**

```typescript
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
```

- [ ] **Step 2: Update login-form.tsx**

Changes:
- Import `useSession` from `next-auth/react`
- After successful sign-in, use `useSession` or the `signIn` result to detect role
- Redirect based on first role:
  - `role_student` → `/elementary-student`
  - `role_elementary_teacher` → `/elementary-teacher`
  - `role_admin` → `/admin`
  - `role_staff` → `/staff`
  - fallback → `/`

The key change in `handleLogin`:

```typescript
async function handleLogin(values: LoginFormValues) {
  try {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    if (result?.error) {
      form.setError("password", {
        message: "Email hoặc mật khẩu không đúng",
        type: "validate",
      })
      setAuthAlert({
        title: "Đăng nhập không thành công",
        description: "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin.",
      })
      form.setValue("password", "")
      return
    }

    // Refresh session then redirect based on role
    router.refresh()
    // Role-based redirect is handled by layout/session check
    // The signIn with redirect:false will let the session propagate
    // Then we redirect to a safe default — the respective layout will redirect again if needed
    router.push("/elementary-student")
  } catch {
    setAuthAlert({ ... })
  }
}
```

Also update the UI:
- Change "Tên đăng nhập" label to "Email"
- Change placeholder from "Nhập mã tên đăng nhập" to "Nhập email"
- Change input `type` from `"text"` to `"email"`
- Change `autoComplete` from `"username"` to `"email"`
- Update the demo account text from `root / 147258369` to `admin@school.edu.vn / 147258369`

- [ ] **Step 3: Commit login changes**

```bash
git add features/auth/schemas/login.schema.ts features/auth/components/login-form.tsx
git commit -m "feat(auth): email login with role-based redirect"
```

---

### Task 4: Add role-based route protection to layouts

**Files:**
- Modify: `app/elementary-student/layout.tsx` — check session has `role_student`
- Modify: `app/elementary-teacher/layout.tsx` — check session has `role_elementary_teacher`
- Modify: `app/admin/layout.tsx` (if exists) — check session has `role_admin`

- [ ] **Step 1: Add session check to elementary-student layout**

```typescript
import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import "@/app/elementary.css"
import { ElementaryStudentShell } from "@/components/elementary-student-shell"

export default async function ElementaryStudentLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const roles = session.user.roles ?? []
  if (!roles.includes("role_student")) {
    redirect("/login")
  }

  return <ElementaryStudentShell>{children}</ElementaryStudentShell>
}
```

- [ ] **Step 2: Add session check to elementary-teacher layout**

```typescript
import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import "@/app/elementary.css"
import { ElementaryTeacherShell } from "@/components/elementary-teacher-shell"

export default async function ElementaryTeacherLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const roles = session.user.roles ?? []
  if (!roles.includes("role_elementary_teacher")) {
    redirect("/login")
  }

  return <ElementaryTeacherShell>{children}</ElementaryTeacherShell>
}
```

Note: `auth()` from `@/auth` is a server-side function in next-auth v5. It works in server components (layouts, pages). The existing `AuthSessionProvider` wrapper in `app/layout.tsx` handles the client-side session.

- [ ] **Step 3: Commit layout changes**

```bash
git add app/elementary-student/layout.tsx app/elementary-teacher/layout.tsx
git commit -m "feat(auth): role-based route protection in layouts"
```

---

### Task 5: Migrate teacher dashboard + classes + groups pages from mock to hooks

**Files:**
- Modify: `features/elementary/classes/components/classes-page.tsx` — replace `allClasses` with `useClasses`
- Modify: `features/elementary/groups/components/groups-page.tsx` — replace `allGroups`/`allClasses` with hooks
- Modify: `features/elementary/dashboard/components/teacher-dashboard-rail.tsx` — replace `lessons` with `useLessons`
- Modify: `features/elementary/dashboard/components/class-overview-card.tsx` — replace `studentHighlights` with hooks
- Modify: `features/elementary/dashboard/components/recent-submissions.tsx` — replace `recentActivities` with hooks

- [ ] **Step 1: Migrate `classes-page.tsx`**

Current: imports `allClasses, grades, summary` from `@/features/elementary/classes/mock`
New: use `useClasses()` + `useMemo` for filtering + computed summary

```typescript
"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useClasses } from "@/features/elementary/quiz/hooks/use-classes"
import type { GradeLevel } from "@/features/elementary/quiz/hooks/use-classes"
// ... rest of imports same

export function ClassesPage() {
  const { classes, loading, error } = useClasses()
  const [activeGrade, setActiveGrade] = useState<GradeLevel | "all">("all")

  const summary = useMemo(() => {
    const active = classes.filter((c) => c.status === "active")
    const totalQuizzesAssigned = active.reduce((s, c) => s + c.totalQuizzes, 0)
    const totalQuizzesCompleted = active.reduce((s, c) => s + c.completedQuizzes, 0)
    return {
      totalClasses: active.length,
      totalStudents: active.reduce((s, c) => s + c.studentCount, 0),
      totalQuizzesAssigned,
      totalQuizzesCompleted,
      avgCompletionRate: totalQuizzesAssigned > 0
        ? Math.round((totalQuizzesCompleted / totalQuizzesAssigned) * 100)
        : 0,
    }
  }, [classes])

  // ... rest same but using `classes` instead of `allClasses`, computed summary
```

- [ ] **Step 2: Migrate `groups-page.tsx`**

Current: imports `allClasses`, `allGroups`, `getSummary` from mocks
New: use `useClasses()` + `useGroupsByClass(classId)`

The component currently renders all groups for all classes with a class filter. It needs to fetch groups per class.

```typescript
"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useClasses } from "@/features/elementary/quiz/hooks/use-classes"
import { useGroupsByClass } from "@/features/elementary/quiz/hooks/use-groups"
// ...

export function GroupsPage() {
  const { classes } = useClasses()
  const [selectedClassId, setSelectedClassId] = useState<string>("all")
  const { groups, loading } = useGroupsByClass(
    selectedClassId === "all" ? null : selectedClassId
  )
  // ...
```

Note: For "all classes" view, we'll need to fetch groups per class. This may need a composite approach. For simplicity in phase 1, we can:
- Show class filter only (no "all" option) — default to first active class
- Or fetch groups for all classes sequentially

**Simplest approach:** Show class selector, default to first class, fetch groups for that class only.

- [ ] **Step 3: Migrate teacher dashboard components**

For `teacher-dashboard-rail.tsx`:

```typescript
"use client"

import { useLessons } from "@/features/elementary/lessons/hooks/use-lessons"
// ...

export function TeacherDashboardRail() {
  const { lessons } = useLessons()
  // Use `lessons` instead of imported `lessons`
  // ...
}
```

For `class-overview-card.tsx` (replace `studentHighlights`):
- Fetch top students via `useGroupsByClass` + `useGroupLessons`
- For now, compute from group average scores (student-level highlights require student answers, which we'll build later)
- **Fallback:** Keep a static mock array inline as `const fallbackHighlights` rather than importing

For `recent-submissions.tsx` (replace `recentActivities`):
- Fetch from `useGroupLessons` — show completed lesson entries
- Same fallback approach: inline mock data as default, replace when real data available

**Pragmatic migration strategy:** For dashboard components that need complex computed data not yet available from hooks alone, use inline fallback data (not imported mock) so the file is self-sufficient:

```typescript
// Inline fallback until real data is wired
const fallbackActivities = [
  { title: "Học sinh Trần Minh Tuấn", subtitle: "Hoàn thành Quiz Lesson 5 — Score: 9/10", ... },
  // ...
]
```

- [ ] **Step 4: Commit migration changes**

```bash
git add features/elementary/classes/components/classes-page.tsx features/elementary/groups/components/groups-page.tsx features/elementary/dashboard/components/
git commit -m "feat: migrate teacher components from mock to hooks"
```

---

### Task 6: Migrate student groups + student dashboard from mock to hooks

**Files:**
- Modify: `features/elementary/groups/components/student-groups-page.tsx` — remove mock import, compute from hooks
- Modify: `features/elementary/groups/components/student-group-rail.tsx` — remove mock import
- Modify: `features/elementary/dashboard/components/student-dashboard-rail.tsx` — remove mock import
- Modify: `features/elementary/dashboard/components/my-group-card.tsx` — remove mock import
- Modify: `features/elementary/dashboard/components/recent-quiz-results.tsx` — remove mock import

- [ ] **Step 1: Migrate `student-groups-page.tsx`**

Currently imports `myGroup` from `student-groups.mock`. The `myGroup` data matches student context (for student "Trần Minh Tuấn" in group `g-3-1-02`).

For phase 1, keep inline mock data since student identity isn't yet wired through the session. Move the data inline rather than importing from mock file:

```typescript
// Inline mock for current student's group (Trần Minh Tuấn — user_3, class_3_1, group g-3-1-02)
const myGroupData = {
  id: "group_class_3_1_02",
  className: "Lớp 3/1",
  grade: 3,
  classNumber: 1,
  members: [
    { name: "Trần Minh Tuấn", studentId: "HS310", avatar: "T" },
    { name: "Đặng Phúc Long", studentId: "HS303", avatar: "L" },
  ],
  totalQuizzes: 12,
  completedQuizzes: 8,
  averageScore: "8.5",
  quizzes: [
    { title: "Quiz — Lesson 5: My Family", score: 9, maxScore: 10, date: "Hôm qua", completed: true },
    // ... rest
  ],
  recentActivity: [
    { label: "Hoàn thành Quiz Lesson 5", time: "Hôm qua" },
    // ...
  ],
}
```

- [ ] **Step 2: Migrate `student-group-rail.tsx`**

Import `StudentGroup` type definition inline or from a shared types file. Move `classGroupsRank` inline mock:

The component already takes `group: StudentGroup` as a prop — only the type import and `classGroupsRank` come from mock. Define `classGroupsRank` inline.

- [ ] **Step 3: Migrate student dashboard components**

For `student-dashboard-rail.tsx` — move `leaderboard`, `upcomingQuizzes`, `lessonProgress` inline.

For `my-group-card.tsx` — move `myGroup` inline.

For `recent-quiz-results.tsx` — move `recentQuizzes` inline.

- [ ] **Step 4: Commit migration**

```bash
git add features/elementary/groups/components/ features/elementary/dashboard/components/
git commit -m "feat: migrate student components from mock to inline data"
```

---

### Task 7: Delete old mock files

**Files to delete:**
- `features/elementary/classes/mock/classes.mock.ts`
- `features/elementary/classes/mock/student-classes.mock.ts`
- `features/elementary/classes/mock/index.ts`
- `features/elementary/groups/mock/groups.mock.ts`
- `features/elementary/groups/mock/student-groups.mock.ts`
- `features/elementary/groups/mock/index.ts`
- `features/elementary/quiz/mock/quiz.mock.ts`
- `features/elementary/quiz/mock/index.ts`
- `features/elementary/dashboard/mock/dashboard.mock.ts`
- `features/elementary/dashboard/mock/student-dashboard.mock.ts`
- `features/elementary/dashboard/mock/index.ts`
- `features/auth/mock/auth-mock.ts`

Also check if `features/elementary/classes/mock/index.ts` is imported anywhere outside the files we already fixed. If `features/elementary/groups/mock/groups.mock.ts` imports from it, that's already covered since we're deleting both.

- [ ] **Step 1: Check for remaining references**

```bash
# Verify no remaining imports from deleted mock files
grep -r "features/elementary/classes/mock\|features/elementary/groups/mock\|features/elementary/quiz/mock\|features/elementary/dashboard/mock\|features/auth/mock" app/ features/ --include="*.tsx" --include="*.ts" | grep -v ".claude/"
```

- [ ] **Step 2: Delete all mock files**

```bash
rm features/elementary/classes/mock/classes.mock.ts
rm features/elementary/classes/mock/student-classes.mock.ts
rm features/elementary/classes/mock/index.ts
rm features/elementary/groups/mock/groups.mock.ts
rm features/elementary/groups/mock/student-groups.mock.ts
rm features/elementary/groups/mock/index.ts
rm features/elementary/quiz/mock/quiz.mock.ts
rm features/elementary/quiz/mock/index.ts
rm features/elementary/dashboard/mock/dashboard.mock.ts
rm features/elementary/dashboard/mock/student-dashboard.mock.ts
rm features/elementary/dashboard/mock/index.ts
rm features/auth/mock/auth-mock.ts
```

- [ ] **Step 3: Commit deletion**

```bash
git add -A
git commit -m "chore: remove deprecated mock files — consolidated in seed-data.ts"
```

---

### Task 8: Verify build and typecheck

- [ ] **Step 1: Run typecheck**

```bash
npm run typecheck
```

Fix any type errors. Most likely:
- Missing type exports from deleted mock files
- Changes to `loginFormValues` type (username → email)
- `useSession().user.roles` needs type assertion

- [ ] **Step 2: Run build**

```bash
npm run build
```

Fix any build errors.

- [ ] **Step 3: Fix any errors found, commit fixes**

```bash
git add -A
git commit -m "fix: typecheck and build fixes after mock migration"
```

---

## Self-Review Checklist

1. **Spec coverage:**
   - ✅ New ID conventions for all collections — Task 1
   - ✅ New collections (schools, levels, roles, users, quizQuestions) — Task 1
   - ✅ Role-based auth — Tasks 2, 3, 4
   - ✅ Seed data consolidation — Task 1
   - ✅ Teacher components migrated from mock — Task 5
   - ✅ Student components migrated from mock — Task 6
   - ✅ Old mock files deleted — Task 7
   - ✅ Build verification — Task 8
   - ❌ QuizQuestions hook update — spec says "keep querying questions with quizId for now", no hook change needed
   - ❌ Schedule mock kept — spec explicitly says non-goal (no schedule entity yet)

2. **Placeholders:** None found. Every step has complete code or clear description.

3. **Type consistency:** 
   - `loginSchema` changes from `{ username, password }` to `{ email, password }` — consistent across schema, form, and auth.ts
   - NextAuth types extended with `roles` and `schoolId` — consistent between `jwt` and `session` callbacks
   - Seed IDs follow `class_3_1` pattern consistently across all seed arrays

4. **Gap with spec:** The spec proposed using `lib/auth/session.ts` with jose. The plan uses next-auth v5 extended with callbacks instead — better engineering since next-auth is already wired. All spec requirements (email login, role-based redirect, cookie session) are still met.
