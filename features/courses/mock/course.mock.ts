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
