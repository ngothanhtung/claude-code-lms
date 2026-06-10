export type AssignmentStatus = "pending" | "submitted" | "overdue" | "graded"

export interface PersonalAssignment {
  id: string
  title: string
  course: string
  courseCategory: "violet" | "green" | "blue" | "amber" | "teal" | "rust"
  description: string
  dueDate: string // e.g. "20/05/2026"
  dueTime: string // e.g. "23:59"
  status: AssignmentStatus
  grade?: string
  submittedAt?: string
}

export const personalAssignments: PersonalAssignment[] = [
  {
    id: "pa-1",
    title: "Bài tập lớn chương 3 – Quản lý sinh viên",
    course: "Lập trình hướng đối tượng",
    courseCategory: "violet",
    description: "Xây dựng chương trình quản lý sinh viên bằng Java, áp dụng các nguyên lý OOP.",
    dueDate: "10/06/2026",
    dueTime: "23:59",
    status: "overdue",
    grade: "—",
  },
  {
    id: "pa-2",
    title: "Lab 1 – Build REST API với Claude Code",
    course: "Claude Code for BackEnd",
    courseCategory: "rust",
    description: "Xây dựng REST API đơn giản sử dụng Claude Code và Express.",
    dueDate: "11/06/2026",
    dueTime: "22:00",
    status: "pending",
  },
  {
    id: "pa-3",
    title: "Quiz Java – Bài kiểm tra giữa kỳ",
    course: "Lập trình Java",
    courseCategory: "amber",
    description: "Bài kiểm tra trắc nghiệm online về Java Core.",
    dueDate: "12/06/2026",
    dueTime: "20:00",
    status: "submitted",
    submittedAt: "12/06/2026 19:30",
  },
  {
    id: "pa-4",
    title: "Bài tập Entity-Relationship Diagram",
    course: "Cơ sở dữ liệu",
    courseCategory: "green",
    description: "Vẽ ERD cho hệ thống quản lý thư viện.",
    dueDate: "11/06/2026",
    dueTime: "23:59",
    status: "graded",
    grade: "8.5",
  },
  {
    id: "pa-5",
    title: "Bài tập Stack & Queue",
    course: "Cấu trúc dữ liệu và giải thuật",
    courseCategory: "blue",
    description: "Cài đặt Stack và Queue bằng C++ và giải bài toán ứng dụng.",
    dueDate: "15/06/2026",
    dueTime: "23:59",
    status: "pending",
  },
  {
    id: "pa-6",
    title: "Lab 2 – Phân tích thuật toán sắp xếp",
    course: "Cấu trúc dữ liệu và giải thuật",
    courseCategory: "blue",
    description: "So sánh hiệu năng các thuật toán sắp xếp: Bubble, Quick, Merge.",
    dueDate: "18/06/2026",
    dueTime: "23:59",
    status: "submitted",
    submittedAt: "17/06/2026 15:45",
  },
  {
    id: "pa-7",
    title: "Bài tập Passive Voice & Conditional Sentences",
    course: "Tiếng Anh học thuật",
    courseCategory: "teal",
    description: "Hoàn thành bài tập ngữ pháp về câu bị động và câu điều kiện.",
    dueDate: "09/06/2026",
    dueTime: "23:59",
    status: "graded",
    grade: "9.0",
  },
  {
    id: "pa-8",
    title: "Bài tập SQL – Truy vấn nâng cao",
    course: "Cơ sở dữ liệu",
    courseCategory: "green",
    description: "Viết các truy vấn SQL với JOIN, GROUP BY, subquery.",
    dueDate: "20/06/2026",
    dueTime: "23:59",
    status: "pending",
  },
  {
    id: "pa-9",
    title: "Bài tập Generics & Collections",
    course: "Lập trình hướng đối tượng",
    courseCategory: "violet",
    description: "Sử dụng Generics và Collections Framework trong Java.",
    dueDate: "25/06/2026",
    dueTime: "23:59",
    status: "pending",
  },
]

/** Computed stats derived from personalAssignments */
export const assignmentStats = {
  total: personalAssignments.length,
  pending: personalAssignments.filter((a) => a.status === "pending").length,
  submitted: personalAssignments.filter((a) => a.status === "submitted" || a.status === "graded").length,
  overdue: personalAssignments.filter((a) => a.status === "overdue").length,
}
