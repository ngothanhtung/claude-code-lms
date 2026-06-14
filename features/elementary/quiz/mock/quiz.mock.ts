import type { QuizAnswer, LeaderboardEntry } from "../types/quiz.types"

/** Mock quiz ID used across the feature */
export const MOCK_QUIZ_ID = "quiz-1-1-english-01"

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
