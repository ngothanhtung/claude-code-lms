import type { QuizQuestion, QuizAnswer, LeaderboardEntry } from "../types/quiz.types"

/** Mock quiz ID used across the feature */
export const MOCK_QUIZ_ID = "quiz-1-1-vietnamese-01"

/** 10 mock questions — Vietnamese language for class 1/1 */
export const mockQuestions: QuizQuestion[] = [
  {
    id: "q1",
    content: "Từ nào sau đây là từ đồng nghĩa với 'vui'?",
    type: "quiz",
    options: [
      { content: "Buồn", isCorrect: false },
      { content: "Hạnh phúc", isCorrect: true },
      { content: "Mệt mỏi", isCorrect: false },
      { content: "Tức giận", isCorrect: false },
    ],
  },
  {
    id: "q2",
    content: "Hình nào sau đây là hình tròn?",
    type: "quiz",
    options: [
      { content: "Hình vuông", isCorrect: false },
      { content: "Hình tam giác", isCorrect: false },
      { content: "Hình tròn", isCorrect: true },
      { content: "Hình chữ nhật", isCorrect: false },
    ],
  },
  {
    id: "q3",
    content: "Con vật nào sau đây biết bay?",
    type: "quiz",
    options: [
      { content: "Con chó", isCorrect: false },
      { content: "Con mèo", isCorrect: false },
      { content: "Con chim", isCorrect: true },
      { content: "Con cá", isCorrect: false },
    ],
  },
  {
    id: "q4",
    content: "1 + 1 = ?",
    type: "quiz",
    options: [
      { content: "1", isCorrect: false },
      { content: "2", isCorrect: true },
      { content: "3", isCorrect: false },
      { content: "4", isCorrect: false },
    ],
  },
  {
    id: "q5",
    content: "Màu của bầu trời là gì?",
    type: "quiz",
    options: [
      { content: "Xanh lá", isCorrect: false },
      { content: "Đỏ", isCorrect: false },
      { content: "Vàng", isCorrect: false },
      { content: "Xanh dương", isCorrect: true },
    ],
  },
  {
    id: "q6",
    content: "Nước nào có hình dáng giống chữ S?",
    type: "quiz",
    options: [
      { content: "Trung Quốc", isCorrect: false },
      { content: "Việt Nam", isCorrect: true },
      { content: "Nhật Bản", isCorrect: false },
      { content: "Hàn Quốc", isCorrect: false },
    ],
  },
  {
    id: "q7",
    content: "Mùa nào có tuyết rơi ở miền Bắc?",
    type: "quiz",
    options: [
      { content: "Mùa xuân", isCorrect: false },
      { content: "Mùa hạ", isCorrect: false },
      { content: "Mùa đông", isCorrect: true },
      { content: "Mùa thu", isCorrect: false },
    ],
  },
  {
    id: "q8",
    content: "Từ trái nghĩa với 'nóng' là gì?",
    type: "quiz",
    options: [
      { content: "Lạnh", isCorrect: true },
      { content: "Nắng", isCorrect: false },
      { content: "Khô", isCorrect: false },
      { content: "Ẩm", isCorrect: false },
    ],
  },
  {
    id: "q9",
    content: "Cái nào dùng để viết trên bảng?",
    type: "quiz",
    options: [
      { content: "Giấy", isCorrect: false },
      { content: "Bút chì", isCorrect: false },
      { content: "Phấn", isCorrect: true },
      { content: "Cọ vẽ", isCorrect: false },
    ],
  },
  {
    id: "q10",
    content: "3 + 4 = ?",
    type: "quiz",
    options: [
      { content: "5", isCorrect: false },
      { content: "6", isCorrect: false },
      { content: "7", isCorrect: true },
      { content: "8", isCorrect: false },
    ],
  },
]

/** Mock leaderboard entries for development */
export const mockLeaderboard: LeaderboardEntry[] = [
  { groupId: "g-1-1-03", groupName: "Nhóm 3", score: 90, correctCount: 9, totalTime: 135, rank: 1 },
  { groupId: "g-1-1-01", groupName: "Nhóm 1", score: 80, correctCount: 8, totalTime: 150, rank: 2 },
  { groupId: "g-1-1-02", groupName: "Nhóm 2", score: 70, correctCount: 7, totalTime: 165, rank: 3 },
  { groupId: "g-1-1-04", groupName: "Nhóm 4", score: 60, correctCount: 6, totalTime: 180, rank: 4 },
]

/** Helper: compute correct count from answers */
export function computeScore(answers: QuizAnswer[]): {
  score: number
  correctCount: number
} {
  const correctCount = answers.filter((a) => a.isCorrect).length
  return { score: correctCount * 10, correctCount }
}

/** Helper: compute total time in seconds from first to last answer */
export function computeTotalTime(answers: QuizAnswer[]): number {
  if (answers.length < 2) return 0
  const sorted = [...answers].sort(
    (a, b) => a.answeredAt.toMillis() - b.answeredAt.toMillis()
  )
  const first = sorted[0].answeredAt.toMillis()
  const last = sorted[sorted.length - 1].answeredAt.toMillis()
  return Math.round((last - first) / 1000)
}

/** Default quiz duration in seconds (10 minutes) */
export const QUIZ_DURATION_SECONDS = 600
