export interface StudentClass {
  id: string
  grade: number
  classNumber: number
  className: string
  homeroomTeacher: string
  studentCount: number
  totalLessons: number
  completedLessons: number
  averageScore: string
  lessons: {
    lessonNumber: number
    title: string
    score: number
    completed: boolean
  }[]
  recentQuizzes: {
    title: string
    score: number
    maxScore: number
    date: string
  }[]
  classmates: {
    name: string
    avatar: string
  }[]
}

export const myClass: StudentClass = {
  id: "3-1",
  grade: 3,
  classNumber: 1,
  className: "Lớp 3A",
  homeroomTeacher: "Đỗ Thị Lan",
  studentCount: 31,
  totalLessons: 8,
  completedLessons: 5,
  averageScore: "8.5",
  lessons: [
    { lessonNumber: 1, title: "Alphabet & Sounds", score: 8.0, completed: true },
    { lessonNumber: 2, title: "Numbers 1-20", score: 7.5, completed: true },
    { lessonNumber: 3, title: "Greetings", score: 9.0, completed: true },
    { lessonNumber: 4, title: "Colors", score: 8.0, completed: true },
    { lessonNumber: 5, title: "My Family", score: 9.0, completed: true },
    { lessonNumber: 6, title: "Animals", score: 0, completed: false },
    { lessonNumber: 7, title: "Food & Drinks", score: 0, completed: false },
    { lessonNumber: 8, title: "Body Parts", score: 0, completed: false },
  ],
  recentQuizzes: [
    { title: "Quiz — Lesson 5: My Family", score: 9, maxScore: 10, date: "Hôm qua" },
    { title: "Quiz — Lesson 4: Colors", score: 8, maxScore: 10, date: "2 ngày trước" },
    { title: "Quiz — Lesson 3: Greetings", score: 10, maxScore: 10, date: "3 ngày trước" },
    { title: "Quiz — Lesson 2: Numbers", score: 8, maxScore: 10, date: "5 ngày trước" },
    { title: "Quiz — Lesson 1: Alphabet", score: 8, maxScore: 10, date: "1 tuần trước" },
  ],
  classmates: [
    { name: "Lê Thị Hương", avatar: "L" },
    { name: "Nguyễn Văn Đức", avatar: "N" },
    { name: "Phạm Thị Lan", avatar: "P" },
    { name: "Hoàng Văn Nam", avatar: "H" },
    { name: "Vũ Thị Mai", avatar: "V" },
    { name: "Đặng Minh Tuấn", avatar: "Đ" },
    { name: "Bùi Thanh Hằng", avatar: "B" },
    { name: "Trịnh Văn Phúc", avatar: "T" },
    { name: "Mai Thị Thúy", avatar: "M" },
    { name: "Lý Đức Khoa", avatar: "L" },
  ],
}
