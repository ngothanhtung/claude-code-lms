export interface GroupMember {
  name: string
  studentId: string
  avatar: string
}

export interface GroupQuiz {
  title: string
  score: number
  maxScore: number
  date: string
  completed: boolean
}

export interface StudentGroup {
  id: string
  className: string
  grade: number
  classNumber: number
  members: GroupMember[]
  totalQuizzes: number
  completedQuizzes: number
  averageScore: string
  quizzes: GroupQuiz[]
  recentActivity: { label: string; time: string }[]
}

export const myGroup: StudentGroup = {
  id: "g-3-1-02",
  className: "Lớp 3A",
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
    { title: "Quiz — Lesson 4: Colors", score: 8, maxScore: 10, date: "2 ngày trước", completed: true },
    { title: "Quiz — Lesson 3: Greetings", score: 10, maxScore: 10, date: "3 ngày trước", completed: true },
    { title: "Quiz — Lesson 2: Numbers", score: 8, maxScore: 10, date: "5 ngày trước", completed: true },
    { title: "Quiz — Lesson 1: Alphabet", score: 8, maxScore: 10, date: "1 tuần trước", completed: true },
    { title: "Quiz — Lesson 6: Animals", score: 0, maxScore: 10, date: "Chưa làm", completed: false },
    { title: "Quiz — Lesson 7: Food & Drinks", score: 0, maxScore: 10, date: "Chưa làm", completed: false },
    { title: "Quiz — Lesson 8: Body Parts", score: 0, maxScore: 10, date: "Chưa làm", completed: false },
  ],
  recentActivity: [
    { label: "Hoàn thành Quiz Lesson 5", time: "Hôm qua" },
    { label: "Làm Quiz Lesson 4", time: "2 ngày trước" },
    { label: "Bắt đầu Quiz Lesson 3", time: "3 ngày trước" },
  ],
}

/* ─── Other groups in same class (for rail leaderboard) ─── */
export interface ClassGroupRank {
  groupName: string
  averageScore: string
  completedQuizzes: number
  totalQuizzes: number
  isMe?: boolean
}

export const classGroupsRank: ClassGroupRank[] = [
  { groupName: "Nhóm 1", averageScore: "8.6", completedQuizzes: 10, totalQuizzes: 12, isMe: false },
  { groupName: "Nhóm 2", averageScore: "8.5", completedQuizzes: 8, totalQuizzes: 12, isMe: true },
  { groupName: "Nhóm 3", averageScore: "9.1", completedQuizzes: 11, totalQuizzes: 12, isMe: false },
]
