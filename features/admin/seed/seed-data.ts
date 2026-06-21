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
  classId?: string
  classIds?: string[]
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
  { id: "lesson_1", title: "Alphabet & Sounds", unit: 1, lessonNumber: 1, description: "Chữ cái A-Z và phát âm cơ bản", totalWords: 26, quizCount: 1 },
  { id: "lesson_2", title: "Numbers 1-20", unit: 1, lessonNumber: 2, description: "Số đếm từ 1 đến 20", totalWords: 20, quizCount: 1 },
  { id: "lesson_3", title: "Greetings", unit: 2, lessonNumber: 3, description: "Lời chào hỏi hàng ngày", totalWords: 12, quizCount: 1 },
  { id: "lesson_4", title: "Colors", unit: 2, lessonNumber: 4, description: "Màu sắc cơ bản", totalWords: 10, quizCount: 1 },
  { id: "lesson_5", title: "My Family", unit: 3, lessonNumber: 5, description: "Gia đình và người thân", totalWords: 15, quizCount: 1 },
  { id: "lesson_6", title: "Animals", unit: 3, lessonNumber: 6, description: "Động vật và âm thanh", totalWords: 18, quizCount: 1 },
  { id: "lesson_7", title: "Food & Drinks", unit: 4, lessonNumber: 7, description: "Thức ăn và đồ uống", totalWords: 20, quizCount: 1 },
  { id: "lesson_8", title: "Body Parts", unit: 4, lessonNumber: 8, description: "Các bộ phận cơ thể", totalWords: 16, quizCount: 1 },
]

/* ─── Quizzes (1 per lesson = 8) ─── */
export interface SeedQuiz {
  id: string
  lessonId: string
  title: string
  description: string
  questionCount: number
  durationSeconds: number
}

export const seedQuizzes: SeedQuiz[] = seedLessons.map((lesson) => ({
  id: `quiz_${lesson.id}_1`,
  lessonId: lesson.id,
  title: `Quiz — ${lesson.title}`,
  description: `Kiểm tra từ vựng ${lesson.title.toLowerCase()}`,
  questionCount: 10,
  durationSeconds: 600,
}))

/* ─── Questions (vocabulary bank per lesson) ─── */
export interface SeedQuestion {
  id: string
  content: string
  type: "quiz" | "fill_in_blank"
  options: { content: string; isCorrect: boolean }[]
}

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
    const qId = `question_${(parseInt(lessonId.split("_")[1]) - 1) * 10 + qi + 1}`
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
    status: lesson.lessonNumber < current ? ("completed" as const) : lesson.lessonNumber === current ? ("current" as const) : ("pending" as const),
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
