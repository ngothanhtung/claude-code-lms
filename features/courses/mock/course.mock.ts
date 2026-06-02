export type CourseCategory =
  | "violet"
  | "green"
  | "blue"
  | "amber"
  | "teal"
  | "rust"

export interface DashboardCourse {
  title: string
  category: CourseCategory
  instructor: string
  progress: number
  assignments: number
  grade: string
}

export interface Course extends DashboardCourse {
  schedule: string // e.g. "Thứ 2 · 07:00"
  credits: number
  status: "learning" | "done"
}

export const dashboardCourses: DashboardCourse[] = [
  {
    title: "Lập trình hướng đối tượng",
    category: "violet",
    instructor: "Nguyễn Minh Tuấn",
    progress: 66,
    assignments: 2,
    grade: "8.5",
  },
  {
    title: "Cơ sở dữ liệu",
    category: "green",
    instructor: "Trần Thị Hương",
    progress: 48,
    assignments: 1,
    grade: "7.0",
  },
  {
    title: "Cấu trúc dữ liệu và giải thuật",
    category: "blue",
    instructor: "Lê Văn Nam",
    progress: 72,
    assignments: 0,
    grade: "8.0",
  },
  {
    title: "Lập trình Java",
    category: "amber",
    instructor: "Phạm Quốc Bảo",
    progress: 30,
    assignments: 3,
    grade: "6.5",
  },
  {
    title: "Tiếng Anh học thuật",
    category: "teal",
    instructor: "Đỗ Thu Trang",
    progress: 60,
    assignments: 1,
    grade: "9.0",
  },
  {
    title: "Claude Code for BackEnd",
    category: "rust",
    instructor: "Hoàng Anh Khoa",
    progress: 15,
    assignments: 1,
    grade: "—",
  },
]

export const allCourses: Course[] = [
  {
    title: "Lập trình hướng đối tượng",
    category: "violet",
    instructor: "Nguyễn Minh Tuấn",
    progress: 66,
    assignments: 2,
    grade: "8.5",
    schedule: "Thứ 2 · 07:00",
    credits: 3,
    status: "learning",
  },
  {
    title: "Cơ sở dữ liệu",
    category: "green",
    instructor: "Trần Thị Hương",
    progress: 48,
    assignments: 1,
    grade: "7.0",
    schedule: "Thứ 3 · 09:30",
    credits: 3,
    status: "learning",
  },
  {
    title: "Cấu trúc dữ liệu và giải thuật",
    category: "blue",
    instructor: "Lê Văn Nam",
    progress: 72,
    assignments: 0,
    grade: "8.0",
    schedule: "Thứ 4 · 13:00",
    credits: 4,
    status: "learning",
  },
  {
    title: "Lập trình Java",
    category: "amber",
    instructor: "Phạm Quốc Bảo",
    progress: 30,
    assignments: 3,
    grade: "6.5",
    schedule: "Thứ 5 · 07:00",
    credits: 3,
    status: "learning",
  },
  {
    title: "Tiếng Anh học thuật",
    category: "teal",
    instructor: "Đỗ Thu Trang",
    progress: 60,
    assignments: 1,
    grade: "9.0",
    schedule: "Thứ 6 · 09:30",
    credits: 2,
    status: "learning",
  },
  {
    title: "Claude Code for BackEnd",
    category: "rust",
    instructor: "Hoàng Anh Khoa",
    progress: 15,
    assignments: 1,
    grade: "—",
    schedule: "Thứ 7 · 13:00",
    credits: 3,
    status: "learning",
  },
]

export const totalCredits = allCourses.reduce((sum, c) => sum + c.credits, 0)
export const totalAssignments = allCourses.reduce(
  (sum, c) => sum + c.assignments,
  0
)
export const averageGrade = (() => {
  const graded = allCourses.filter((c) => c.grade !== "—")
  if (!graded.length) return "—"
  const sum = graded.reduce((s, c) => s + parseFloat(c.grade), 0)
  return (sum / graded.length).toFixed(1)
})()
