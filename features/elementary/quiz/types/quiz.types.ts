import type { Timestamp } from "firebase/firestore"

/** A single quiz question stored in Firestore `questions` collection */
export interface QuizQuestion {
  id: string
  content: string
  type: "quiz" | "fill_in_blank"
  options: QuizOption[]
}

export interface QuizOption {
  content: string
  isCorrect: boolean
}

/** An answer record stored in Firestore `answers` collection */
export interface QuizAnswer {
  id: string
  questionId: string
  groupId: string
  quizId: string
  selectedOption: number
  isCorrect: boolean
  answeredAt: Timestamp
}

/** Derived leaderboard entry computed from answers */
export interface LeaderboardEntry {
  groupId: string
  groupName: string
  score: number
  correctCount: number
  totalTime: number
  rank: number
}

/** Quiz state machine */
export type QuizStatus = "loading" | "active" | "result"
