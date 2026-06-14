"use client"

import type { LeaderboardEntry } from "../types/quiz.types"
import styles from "./quiz-result.module.css"

const MEDALS = ["🥇", "🥈", "🥉"]

interface QuizResultProps {
  rank: number
  score: number
  correctCount: number
  totalTime: number
  groupName: string
  leaderboard: LeaderboardEntry[]
  onBackToGroups: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function QuizResult({
  rank,
  score,
  correctCount,
  totalTime,
  groupName,
  leaderboard,
  onBackToGroups,
}: QuizResultProps) {
  const medal = rank <= 3 ? MEDALS[rank - 1] : null

  return (
    <div className={styles.container}>
      <div className={styles.medal}>{medal || "🎯"}</div>

      <div className={styles.rankTitle}>Xếp hạng #{rank}</div>
      <div className={styles.groupLabel}>{groupName}</div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{score}</div>
          <div className={styles.statLabel}>điểm</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{correctCount}/10</div>
          <div className={styles.statLabel}>đúng</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{formatTime(totalTime)}</div>
          <div className={styles.statLabel}>thời gian</div>
        </div>
      </div>

      <div className={styles.finalLeaderboard}>
        <div className={styles.finalTitle}>🏆 Bảng xếp hạng cuối cùng</div>
        <div className={styles.finalList}>
          {leaderboard.slice(0, 5).map((entry) => {
            const m = entry.rank <= 3 ? MEDALS[entry.rank - 1] : `${entry.rank}.`
            const isCurrent = entry.groupId === groupName
            return (
              <div key={entry.groupId}>
                {m}{" "}
                <span className={isCurrent ? styles.finalHighlight : undefined}>
                  {entry.groupName}
                </span>{" "}
                — {entry.score} điểm
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        className={styles.backBtn}
        onClick={onBackToGroups}
      >
        Về danh sách nhóm
      </button>
    </div>
  )
}
