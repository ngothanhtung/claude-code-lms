import type { GradeLevel } from "@/features/elementary/classes/mock"

export type GroupStatus = "waiting" | "active"

export interface GroupMember {
  name: string
  studentId: string
}

export interface Group {
  id: string
  classId: string
  grade: GradeLevel
  classNumber: number
  className: string
  members: [GroupMember] | [GroupMember, GroupMember]
  status: GroupStatus
  totalQuizzes: number
  completedQuizzes: number
  averageScore: string
}

/* ─── Summary stats ─── */
export interface GroupsSummary {
  totalGroups: number
  activeGroups: number
  waitingGroups: number
  totalStudents: number
  avgScore: string
}

export function getSummary(groups: Group[]): GroupsSummary {
  const active = groups.filter((g) => g.status === "active")
  const waiting = groups.filter((g) => g.status === "waiting")
  const totalStudents = groups.reduce((s, g) => s + g.members.length, 0)
  const scores = active
    .filter((g) => g.averageScore !== "—")
    .map((g) => parseFloat(g.averageScore))
  const avgScore = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : "—"

  return {
    totalGroups: groups.length,
    activeGroups: active.length,
    waitingGroups: waiting.length,
    totalStudents,
    avgScore,
  }
}

/* ─── 20 groups with 2 students each ─── */
export const allGroups: Group[] = [
  // ─── Lớp 1/1 ───
  {
    id: "g-1-1-01",
    classId: "1-1",
    grade: 1,
    classNumber: 1,
    className: "1/1",
    members: [
      { name: "Trần Minh Khôi", studentId: "HS101" },
      { name: "Lý Thanh Hằng", studentId: "HS102" },
    ],
    status: "active",
    totalQuizzes: 8,
    completedQuizzes: 6,
    averageScore: "8.5",
  },
  {
    id: "g-1-1-02",
    classId: "1-1",
    grade: 1,
    classNumber: 1,
    className: "1/1",
    members: [
      { name: "Phạm Gia Hân", studentId: "HS103" },
      { name: "Nguyễn Đức Phúc", studentId: "HS104" },
    ],
    status: "active",
    totalQuizzes: 8,
    completedQuizzes: 5,
    averageScore: "7.8",
  },
  // ─── Lớp 1/2 ───
  {
    id: "g-1-2-01",
    classId: "1-2",
    grade: 1,
    classNumber: 2,
    className: "1/2",
    members: [
      { name: "Hoàng Văn Tùng", studentId: "HS111" },
      { name: "Đỗ Thị Kim Ngân", studentId: "HS112" },
    ],
    status: "active",
    totalQuizzes: 8,
    completedQuizzes: 7,
    averageScore: "9.0",
  },
  {
    id: "g-1-2-02",
    classId: "1-2",
    grade: 1,
    classNumber: 2,
    className: "1/2",
    members: [{ name: "Vũ Ngọc Mai", studentId: "HS113" }],
    status: "waiting",
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: "—",
  },
  // ─── Lớp 2/1 ───
  {
    id: "g-2-1-01",
    classId: "2-1",
    grade: 2,
    classNumber: 1,
    className: "2/1",
    members: [
      { name: "Ngô Tiến Đạt", studentId: "HS201" },
      { name: "Bùi Thanh Tâm", studentId: "HS202" },
    ],
    status: "active",
    totalQuizzes: 10,
    completedQuizzes: 8,
    averageScore: "8.2",
  },
  {
    id: "g-2-1-02",
    classId: "2-1",
    grade: 2,
    classNumber: 1,
    className: "2/1",
    members: [
      { name: "Mai Quỳnh Anh", studentId: "HS203" },
      { name: "Hồ Nam Hải", studentId: "HS204" },
    ],
    status: "active",
    totalQuizzes: 10,
    completedQuizzes: 9,
    averageScore: "8.8",
  },
  {
    id: "g-2-1-03",
    classId: "2-1",
    grade: 2,
    classNumber: 1,
    className: "2/1",
    members: [
      { name: "Trịnh Quốc Bảo", studentId: "HS205" },
      { name: "Dương Lê Vy", studentId: "HS206" },
    ],
    status: "waiting",
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: "—",
  },
  // ─── Lớp 2/2 ───
  {
    id: "g-2-2-01",
    classId: "2-2",
    grade: 2,
    classNumber: 2,
    className: "2/2",
    members: [
      { name: "Lê Minh Anh", studentId: "HS211" },
      { name: "Cao Thị Bích Ngọc", studentId: "HS212" },
    ],
    status: "active",
    totalQuizzes: 10,
    completedQuizzes: 10,
    averageScore: "9.2",
  },
  {
    id: "g-2-2-02",
    classId: "2-2",
    grade: 2,
    classNumber: 2,
    className: "2/2",
    members: [
      { name: "Phan Văn Khoa", studentId: "HS213" },
      { name: "Nguyễn Thanh Trà", studentId: "HS214" },
    ],
    status: "active",
    totalQuizzes: 10,
    completedQuizzes: 6,
    averageScore: "7.5",
  },
  // ─── Lớp 3/1 ───
  {
    id: "g-3-1-01",
    classId: "3-1",
    grade: 3,
    classNumber: 1,
    className: "3/1",
    members: [
      { name: "Đinh Gia Huy", studentId: "HS301" },
      { name: "Tạ Thùy Linh", studentId: "HS302" },
    ],
    status: "active",
    totalQuizzes: 12,
    completedQuizzes: 10,
    averageScore: "8.6",
  },
  {
    id: "g-3-1-02",
    classId: "3-1",
    grade: 3,
    classNumber: 1,
    className: "3/1",
    members: [
      { name: "Đặng Phúc Long", studentId: "HS303" },
      { name: "Hà Thanh Vy", studentId: "HS304" },
    ],
    status: "active",
    totalQuizzes: 12,
    completedQuizzes: 8,
    averageScore: "7.9",
  },
  {
    id: "g-3-1-03",
    classId: "3-1",
    grade: 3,
    classNumber: 1,
    className: "3/1",
    members: [
      { name: "Tô Nhật Minh", studentId: "HS305" },
      { name: "Lương Thị Thảo", studentId: "HS306" },
    ],
    status: "active",
    totalQuizzes: 12,
    completedQuizzes: 11,
    averageScore: "9.1",
  },
  {
    id: "g-3-1-04",
    classId: "3-1",
    grade: 3,
    classNumber: 1,
    className: "3/1",
    members: [{ name: "Cù Văn Hùng", studentId: "HS307" }],
    status: "waiting",
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: "—",
  },
  // ─── Lớp 3/2 ───
  {
    id: "g-3-2-01",
    classId: "3-2",
    grade: 3,
    classNumber: 2,
    className: "3/2",
    members: [
      { name: "La Gia Kiệt", studentId: "HS311" },
      { name: "Tôn Thị Ngọc Hân", studentId: "HS312" },
    ],
    status: "active",
    totalQuizzes: 12,
    completedQuizzes: 7,
    averageScore: "7.4",
  },
  // ─── Lớp 4/1 ───
  {
    id: "g-4-1-01",
    classId: "4-1",
    grade: 4,
    classNumber: 1,
    className: "4/1",
    members: [
      { name: "Mã Đức Duy", studentId: "HS401" },
      { name: "Thạch Thị Yến Nhi", studentId: "HS402" },
    ],
    status: "active",
    totalQuizzes: 15,
    completedQuizzes: 13,
    averageScore: "8.9",
  },
  {
    id: "g-4-1-02",
    classId: "4-1",
    grade: 4,
    classNumber: 1,
    className: "4/1",
    members: [
      { name: "Lâm Quốc Khánh", studentId: "HS403" },
      { name: "Văn Thanh Hằng", studentId: "HS404" },
    ],
    status: "active",
    totalQuizzes: 15,
    completedQuizzes: 11,
    averageScore: "8.1",
  },
  // ─── Lớp 4/2 ───
  {
    id: "g-4-2-01",
    classId: "4-2",
    grade: 4,
    classNumber: 2,
    className: "4/2",
    members: [
      { name: "Ksor Thanh Phúc", studentId: "HS411" },
      { name: "Bế Thị Minh Châ", studentId: "HS412" },
    ],
    status: "active",
    totalQuizzes: 15,
    completedQuizzes: 14,
    averageScore: "9.3",
  },
  // ─── Lớp 5/1 ───
  {
    id: "g-5-1-01",
    classId: "5-1",
    grade: 5,
    classNumber: 1,
    className: "5/1",
    members: [
      { name: "Từ Minh Triết", studentId: "HS501" },
      { name: "Phùng Thị Thanh Tâm", studentId: "HS502" },
    ],
    status: "active",
    totalQuizzes: 18,
    completedQuizzes: 16,
    averageScore: "9.0",
  },
  {
    id: "g-5-1-02",
    classId: "5-1",
    grade: 5,
    classNumber: 1,
    className: "5/1",
    members: [
      { name: "Nghiêm Gia Hân", studentId: "HS503" },
      { name: "Tạ Văn Quốc", studentId: "HS504" },
    ],
    status: "active",
    totalQuizzes: 18,
    completedQuizzes: 12,
    averageScore: "8.4",
  },
  // ─── Lớp 5/2 ───
  {
    id: "g-5-2-01",
    classId: "5-2",
    grade: 5,
    classNumber: 2,
    className: "5/2",
    members: [
      { name: "Từ Gia Hân", studentId: "HS511" },
      { name: "Nghiêm Thanh Tùng", studentId: "HS512" },
    ],
    status: "active",
    totalQuizzes: 18,
    completedQuizzes: 15,
    averageScore: "8.7",
  },
]

export const summary = getSummary(allGroups)
