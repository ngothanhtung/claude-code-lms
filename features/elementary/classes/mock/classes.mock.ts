export type GradeLevel = 1 | 2 | 3 | 4 | 5

export interface ElementaryClass {
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

export interface ClassesSummary {
  totalClasses: number
  totalStudents: number
  totalQuizzesAssigned: number
  totalQuizzesCompleted: number
  avgCompletionRate: number
}

export const grades: { level: GradeLevel; label: string }[] = [
  { level: 1, label: "Lớp 1" },
  { level: 2, label: "Lớp 2" },
  { level: 3, label: "Lớp 3" },
  { level: 4, label: "Lớp 4" },
  { level: 5, label: "Lớp 5" },
]

export const allClasses: ElementaryClass[] = [
  // Lớp 1
  {
    id: "1-1",
    grade: 1,
    classNumber: 1,
    homeroomTeacher: "Nguyễn Thị Mai",
    studentCount: 28,
    totalQuizzes: 12,
    completedQuizzes: 10,
    averageScore: "8.2",
    lastActive: "2026-06-13",
    status: "active",
  },
  {
    id: "1-2",
    grade: 1,
    classNumber: 2,
    homeroomTeacher: "Trần Văn Bình",
    studentCount: 27,
    totalQuizzes: 12,
    completedQuizzes: 8,
    averageScore: "7.6",
    lastActive: "2026-06-12",
    status: "active",
  },
  {
    id: "1-3",
    grade: 1,
    classNumber: 3,
    homeroomTeacher: "Lê Thị Hồng",
    studentCount: 25,
    totalQuizzes: 10,
    completedQuizzes: 7,
    averageScore: "7.9",
    lastActive: "2026-06-10",
    status: "active",
  },
  // Lớp 2
  {
    id: "2-1",
    grade: 2,
    classNumber: 1,
    homeroomTeacher: "Phạm Thanh Hà",
    studentCount: 30,
    totalQuizzes: 15,
    completedQuizzes: 12,
    averageScore: "8.5",
    lastActive: "2026-06-13",
    status: "active",
  },
  {
    id: "2-2",
    grade: 2,
    classNumber: 2,
    homeroomTeacher: "Hoàng Thị Thu",
    studentCount: 32,
    totalQuizzes: 15,
    completedQuizzes: 14,
    averageScore: "8.8",
    lastActive: "2026-06-13",
    status: "active",
  },
  {
    id: "2-3",
    grade: 2,
    classNumber: 3,
    homeroomTeacher: "Vũ Minh Đức",
    studentCount: 29,
    totalQuizzes: 12,
    completedQuizzes: 9,
    averageScore: "7.4",
    lastActive: "2026-06-11",
    status: "active",
  },
  // Lớp 3
  {
    id: "3-1",
    grade: 3,
    classNumber: 1,
    homeroomTeacher: "Đỗ Thị Lan",
    studentCount: 31,
    totalQuizzes: 18,
    completedQuizzes: 15,
    averageScore: "8.0",
    lastActive: "2026-06-13",
    status: "active",
  },
  {
    id: "3-2",
    grade: 3,
    classNumber: 2,
    homeroomTeacher: "Ngô Việt Hùng",
    studentCount: 28,
    totalQuizzes: 18,
    completedQuizzes: 13,
    averageScore: "7.8",
    lastActive: "2026-06-12",
    status: "active",
  },
  {
    id: "3-3",
    grade: 3,
    classNumber: 3,
    homeroomTeacher: "Dương Thị Nhung",
    studentCount: 26,
    totalQuizzes: 14,
    completedQuizzes: 11,
    averageScore: "8.3",
    lastActive: "2026-06-10",
    status: "archived",
  },
  // Lớp 4
  {
    id: "4-1",
    grade: 4,
    classNumber: 1,
    homeroomTeacher: "Bùi Minh Quân",
    studentCount: 33,
    totalQuizzes: 20,
    completedQuizzes: 18,
    averageScore: "8.7",
    lastActive: "2026-06-13",
    status: "active",
  },
  {
    id: "4-2",
    grade: 4,
    classNumber: 2,
    homeroomTeacher: "Trịnh Thu Huyền",
    studentCount: 30,
    totalQuizzes: 20,
    completedQuizzes: 16,
    averageScore: "8.1",
    lastActive: "2026-06-12",
    status: "active",
  },
  // Lớp 5
  {
    id: "5-1",
    grade: 5,
    classNumber: 1,
    homeroomTeacher: "Lý Gia Bảo",
    studentCount: 34,
    totalQuizzes: 22,
    completedQuizzes: 20,
    averageScore: "8.9",
    lastActive: "2026-06-13",
    status: "active",
  },
  {
    id: "5-2",
    grade: 5,
    classNumber: 2,
    homeroomTeacher: "Mai Thị Kiều",
    studentCount: 31,
    totalQuizzes: 22,
    completedQuizzes: 17,
    averageScore: "8.4",
    lastActive: "2026-06-13",
    status: "active",
  },
  {
    id: "5-3",
    grade: 5,
    classNumber: 3,
    homeroomTeacher: "Hồ Minh Tuấn",
    studentCount: 28,
    totalQuizzes: 18,
    completedQuizzes: 14,
    averageScore: "7.7",
    lastActive: "2026-06-09",
    status: "archived",
  },
]

export const summary: ClassesSummary = (() => {
  const active = allClasses.filter((c) => c.status === "active")
  const totalQuizzesAssigned = active.reduce((s, c) => s + c.totalQuizzes, 0)
  const totalQuizzesCompleted = active.reduce((s, c) => s + c.completedQuizzes, 0)

  return {
    totalClasses: active.length,
    totalStudents: active.reduce((s, c) => s + c.studentCount, 0),
    totalQuizzesAssigned,
    totalQuizzesCompleted,
    avgCompletionRate: Math.round(
      (totalQuizzesCompleted / totalQuizzesAssigned) * 100
    ),
  }
})()
