"use client"

import { useMemo } from "react"
import type { QuizAnswer, LeaderboardEntry } from "../types/quiz.types"

const GROUP_NAMES: Record<string, string> = {
  "g-1-1-01": "Nhóm 1",
  "g-1-1-02": "Nhóm 2",
  "g-1-1-03": "Nhóm 3",
  "g-1-1-04": "Nhóm 4",
  "g-1-1-05": "Nhóm 5",
}

interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[]
  currentRank: number
}

export function useLeaderboard(
  allAnswers: QuizAnswer[],
  currentGroupId: string
): UseLeaderboardReturn {
  return useMemo(() => {
    if (allAnswers.length === 0) {
      return { leaderboard: [], currentRank: -1 }
    }

    const latestByGroup = new Map<string, Map<string, QuizAnswer>>()

    const sorted = [...allAnswers].sort(
      (a, b) => a.answeredAt.toMillis() - b.answeredAt.toMillis()
    )

    for (const answer of sorted) {
      if (!latestByGroup.has(answer.groupId)) {
        latestByGroup.set(answer.groupId, new Map())
      }
      latestByGroup.get(answer.groupId)!.set(answer.questionId, answer)
    }

    const entries: LeaderboardEntry[] = []
    for (const [groupId, questionMap] of latestByGroup) {
      const answers = Array.from(questionMap.values())
      const correctCount = answers.filter((a) => a.isCorrect).length
      const score = correctCount * 10

      let totalTime = 0
      if (answers.length >= 2) {
        const timestamps = answers
          .map((a) => a.answeredAt.toMillis())
          .sort((a, b) => a - b)
        totalTime = Math.round(
          (timestamps[timestamps.length - 1] - timestamps[0]) / 1000
        )
      }

      entries.push({
        groupId,
        groupName: GROUP_NAMES[groupId] || groupId,
        score,
        correctCount,
        totalTime,
        rank: 0,
      })
    }

    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.totalTime - b.totalTime
    })

    entries.forEach((entry, i) => {
      entry.rank = i + 1
    })

    const currentEntry = entries.find((e) => e.groupId === currentGroupId)

    return {
      leaderboard: entries,
      currentRank: currentEntry?.rank ?? -1,
    }
  }, [allAnswers, currentGroupId])
}
