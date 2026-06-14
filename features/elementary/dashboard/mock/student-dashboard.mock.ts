export const studentProfile = {
  name: "Trần Minh Tuấn",
  className: "Lớp 3A",
  semester: "Học kỳ II, năm học 2025 - 2026",
  dateLabel: "Thứ 7, 14/06/2026",
}

export const studentStatCards = [
  {
    variant: "lessons" as const,
    label: "Bài học đã học",
    value: "5/8",
    detail: "Lesson 1 → Lesson 5",
  },
  {
    variant: "score" as const,
    label: "Điểm trung bình",
    value: "8.5",
    detail: "Top 5 lớp 3A",
    trend: "+0.3",
  },
  {
    variant: "streak" as const,
    label: "Chuỗi ngày học",
    value: "12",
    detail: "ngày liên tiếp 🔥",
    spark: true,
  },
  {
    variant: "group" as const,
    label: "Nhóm học",
    value: "Nhóm 2",
    detail: "Hoàn thành 5/6 quiz",
    progress: 83,
  },
]

export interface StudentScheduleSlot {
  time: string
  title: string
  lesson: string
  room: string
  iconTint: "blue" | "green" | "amber" | "red"
  status?: "upcoming" | "done"
}

export const studentTodaySchedule: StudentScheduleSlot[] = [
  {
    time: "07:30 – 08:10",
    title: "Tiếng Anh",
    lesson: "Lesson 5: My Family",
    room: "Phòng 201",
    iconTint: "blue",
    status: "done",
  },
  {
    time: "09:20 – 10:00",
    title: "Tiếng Anh",
    lesson: "Lesson 6: Colors",
    room: "Phòng 201",
    iconTint: "amber",
    status: "upcoming",
  },
]

export interface QuizResult {
  title: string
  lesson: string
  score: number
  maxScore: number
  date: string
  iconTint: "green" | "blue" | "amber" | "red"
}

export const recentQuizzes: QuizResult[] = [
  {
    title: "Quiz — Lesson 5: My Family",
    lesson: "Lesson 5",
    score: 9,
    maxScore: 10,
    date: "Hôm qua",
    iconTint: "green",
  },
  {
    title: "Quiz — Lesson 4: Colors",
    lesson: "Lesson 4",
    score: 8,
    maxScore: 10,
    date: "2 ngày trước",
    iconTint: "blue",
  },
  {
    title: "Quiz — Lesson 3: Greetings",
    lesson: "Lesson 3",
    score: 10,
    maxScore: 10,
    date: "3 ngày trước",
    iconTint: "green",
  },
  {
    title: "Quiz — Lesson 2: Numbers 1-20",
    lesson: "Lesson 2",
    score: 7,
    maxScore: 10,
    date: "5 ngày trước",
    iconTint: "amber",
  },
  {
    title: "Quiz — Lesson 1: Alphabet",
    lesson: "Lesson 1",
    score: 8,
    maxScore: 10,
    date: "1 tuần trước",
    iconTint: "blue",
  },
]

export interface GroupMember {
  name: string
  avatar: string
}

export const myGroup = {
  name: "Nhóm 2",
  classId: "3A",
  members: [
    { name: "Trần Minh Tuấn", avatar: "T" },
    { name: "Lê Thị Hương", avatar: "L" },
  ] as GroupMember[],
  completedLessons: 5,
  totalLessons: 6,
  averageScore: 8.7,
}

export interface StudentQuickAction {
  label: string
  href?: string
  tint: "blue" | "amber" | "indigo" | "red" | "green"
  icon: string
}

export const studentQuickActions: StudentQuickAction[] = [
  { label: "Làm quiz", href: "/elementary-student/quiz", tint: "indigo", icon: "pen-square" },
  { label: "Kết quả", href: "/elementary-student/results", tint: "amber", icon: "star" },
  { label: "Nhóm học", href: "/elementary-student/groups", tint: "green", icon: "users" },
  { label: "Lớp học", href: "/elementary-student/classes", tint: "blue", icon: "users" },
  { label: "Bảng xếp hạng", tint: "red", icon: "trophy" },
  { label: "Từ vựng", tint: "amber", icon: "book-open" },
]

export interface UpcomingQuiz {
  title: string
  lesson: string
  deadline: string
  questionCount: number
  iconTint: "blue" | "green" | "amber" | "red"
}

export const upcomingQuizzes: UpcomingQuiz[] = [
  {
    title: "Quiz — Lesson 6: Colors",
    lesson: "Lesson 6",
    deadline: "15/06/2026",
    questionCount: 10,
    iconTint: "amber",
  },
  {
    title: "Quiz — Lesson 7: Food & Drinks",
    lesson: "Lesson 7",
    deadline: "16/06/2026",
    questionCount: 10,
    iconTint: "green",
  },
  {
    title: "Quiz — Lesson 8: Body Parts",
    lesson: "Lesson 8",
    deadline: "18/06/2026",
    questionCount: 10,
    iconTint: "blue",
  },
]

export interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  avatar: string
  isMe?: true
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Lê Thị Hương", score: 9.2, avatar: "L" },
  { rank: 2, name: "Trần Minh Tuấn", score: 8.5, avatar: "T", isMe: true },
  { rank: 3, name: "Nguyễn Văn Đức", score: 8.3, avatar: "N" },
  { rank: 4, name: "Phạm Thị Lan", score: 7.8, avatar: "P" },
  { rank: 5, name: "Hoàng Văn Nam", score: 7.5, avatar: "H" },
]

export interface LessonProgress {
  lessonNumber: number
  title: string
  score: number
  completed: boolean
}

export const lessonProgress: LessonProgress[] = [
  { lessonNumber: 1, title: "Alphabet & Sounds", score: 8.0, completed: true },
  { lessonNumber: 2, title: "Numbers 1-20", score: 7.5, completed: true },
  { lessonNumber: 3, title: "Greetings", score: 9.0, completed: true },
  { lessonNumber: 4, title: "Colors", score: 8.0, completed: true },
  { lessonNumber: 5, title: "My Family", score: 9.0, completed: true },
  { lessonNumber: 6, title: "Animals", score: 0, completed: false },
  { lessonNumber: 7, title: "Food & Drinks", score: 0, completed: false },
  { lessonNumber: 8, title: "Body Parts", score: 0, completed: false },
]
