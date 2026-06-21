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
