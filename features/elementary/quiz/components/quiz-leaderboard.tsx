"use client"

import type { LeaderboardEntry } from "../types/quiz.types"
import { cn } from "@/lib/utils"

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
    <div className="el-lb-sidebar">
      <div className="el-lb-title">
        🏆 Bảng xếp hạng
      </div>

      <div className="el-lb-list">
        {leaderboard.map((entry) => {
          const isCurrent = entry.groupId === currentGroupId
          const medal = entry.rank <= 3 ? MEDALS[entry.rank - 1] : null

          return (
            <div
              key={entry.groupId}
              className={cn(
                "el-lb-entry",
                entry.rank === 1 && "gold",
                entry.rank === 2 && !isCurrent && "silver",
                isCurrent && "current"
              )}
            >
              <span className="el-lb-rank">
                {medal || <span className="el-lb-rank-num">{entry.rank}</span>}
              </span>
              <span className="el-lb-group">
                {entry.groupName}
                {isCurrent && " (bạn)"}
              </span>
              <span className="el-lb-score">{entry.score}</span>
            </div>
          )
        })}

        {leaderboard.length === 0 && (
          <div style={{ textAlign: "center", padding: "16px 0", fontSize: 13, color: "hsl(var(--el-muted-foreground))" }}>
            Chưa có dữ liệu
          </div>
        )}
      </div>

      <div className="el-lb-footer">
        <span className="el-lb-live" />
        Cập nhật realtime
      </div>
    </div>
  )
}
