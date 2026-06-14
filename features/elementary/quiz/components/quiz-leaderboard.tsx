"use client"

import type { LeaderboardEntry } from "../types/quiz.types"
import { cn } from "@/lib/utils"
import styles from "./quiz-leaderboard.module.css"

const MEDALS = ["🥇", "🥈", "🥉"]

interface QuizLeaderboardProps {
  leaderboard: LeaderboardEntry[]
  currentGroupId: string
}

export function QuizLeaderboard({
  leaderboard,
  currentGroupId,
}: QuizLeaderboardProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>
        🏆 Bảng xếp hạng
      </div>

      <div className={styles.list}>
        {leaderboard.map((entry) => {
          const isCurrent = entry.groupId === currentGroupId
          const medal = entry.rank <= 3 ? MEDALS[entry.rank - 1] : null

          return (
            <div
              key={entry.groupId}
              className={cn(
                styles.entry,
                entry.rank === 1 && styles.entryGold,
                entry.rank === 2 && !isCurrent && styles.entrySilver,
                isCurrent && styles.entryCurrent
              )}
            >
              <span className={styles.rank}>
                {medal || <span className={styles.rankNum}>{entry.rank}</span>}
              </span>
              <span className={styles.groupName}>
                {entry.groupName}
                {isCurrent && " (bạn)"}
              </span>
              <span className={styles.score}>{entry.score}</span>
            </div>
          )
        })}

        {leaderboard.length === 0 && (
          <div style={{ textAlign: "center", padding: "16px 0", fontSize: 13, color: "hsl(var(--muted-foreground))" }}>
            Chưa có dữ liệu
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.liveIndicator} />
        Cập nhật realtime
      </div>
    </div>
  )
}
