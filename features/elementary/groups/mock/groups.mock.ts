import { allClasses, type GradeLevel } from "@/features/elementary/classes/mock"

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
  currentLesson: string
  lessonScore: number
  lessonCompletionPct: number
  overallPoints: number
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

const familyNames = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Phan",
  "Vũ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Hồ",
  "Ngô",
  "Dương",
  "Lý",
]

const middleNames = [
  "Minh",
  "Gia",
  "Thanh",
  "Hoài",
  "Khánh",
  "Ngọc",
  "Bảo",
  "Tuấn",
  "Thảo",
  "Quỳnh",
  "Đức",
  "Hà",
  "Nhật",
  "An",
]

const givenNames = [
  "An",
  "Bình",
  "Chi",
  "Duy",
  "Hân",
  "Khang",
  "Linh",
  "Long",
  "Mai",
  "Nam",
  "Nhi",
  "Phúc",
  "Quân",
  "Tâm",
  "Vy",
  "Yến",
  "Huy",
  "Trang",
  "Tùng",
  "My",
  "Khoa",
  "Ngân",
  "Thư",
  "Kiệt",
  "Lan",
  "Đạt",
  "Hương",
  "Khôi",
]

function makeStudentName(index: number) {
  return [
    familyNames[index % familyNames.length],
    middleNames[Math.floor(index / familyNames.length) % middleNames.length],
    givenNames[
      Math.floor(index / (familyNames.length * middleNames.length)) %
        givenNames.length
    ],
  ].join(" ")
}

function makeMembers(
  grade: GradeLevel,
  classNumber: number,
  groupNumber: number
): [GroupMember, GroupMember] {
  const firstStudentNumber = groupNumber * 2 - 1
  const classSeed = (grade - 1) * 3 * 40 + (classNumber - 1) * 40
  const firstNameIndex = classSeed + firstStudentNumber - 1

  return [
    {
      name: makeStudentName(firstNameIndex),
      studentId: `HS${grade}${classNumber}${String(firstStudentNumber).padStart(2, "0")}`,
    },
    {
      name: makeStudentName(firstNameIndex + 1),
      studentId: `HS${grade}${classNumber}${String(firstStudentNumber + 1).padStart(2, "0")}`,
    },
  ]
}

/* ─── Every class has 20 active groups, 2 students per group (40 students) ─── */
export const allGroups: Group[] = allClasses.flatMap((cls) =>
  Array.from({ length: 20 }, (_, index): Group => {
    const groupNumber = index + 1
    const completionOffset = (groupNumber + cls.grade + cls.classNumber) % 5
    const completedQuizzes = Math.max(1, cls.totalQuizzes - completionOffset)
    const score =
      7.2 + ((groupNumber * 7 + cls.grade * 3 + cls.classNumber) % 27) / 10
    const lessonScore =
      7 + ((groupNumber * 11 + cls.grade + cls.classNumber * 2) % 31) / 10
    const lessonCompletionPct = Math.min(
      100,
      62 + ((groupNumber * 9 + cls.grade * 5 + cls.classNumber) % 39)
    )
    const overallPoints = Math.round(
      score * 10 + lessonScore * 6 + (completedQuizzes / cls.totalQuizzes) * 40
    )

    return {
      id: `g-${cls.grade}-${cls.classNumber}-${String(groupNumber).padStart(2, "0")}`,
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
      lessonScore: Number(lessonScore.toFixed(1)),
      lessonCompletionPct,
      overallPoints,
    }
  })
)

export const summary = getSummary(allGroups)
