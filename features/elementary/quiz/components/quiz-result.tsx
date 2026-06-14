"use client"

import type { LeaderboardEntry } from "../types/quiz.types"

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
    <div className="el-qr-container">
      <div className="el-qr-medal">{medal || "🎯"}</div>

      <div className="el-qr-rank">Xếp hạng #{rank}</div>
      <div className="el-qr-group">{groupName}</div>

      <div className="el-qr-stats">
        <div className="el-qr-stat">
          <div className="el-qr-stat-value">{score}</div>
          <div className="el-qr-stat-label">điểm</div>
        </div>
        <div className="el-qr-stat">
          <div className="el-qr-stat-value">{correctCount}/10</div>
          <div className="el-qr-stat-label">đúng</div>
        </div>
        <div className="el-qr-stat">
          <div className="el-qr-stat-value">{formatTime(totalTime)}</div>
          <div className="el-qr-stat-label">thời gian</div>
        </div>
      </div>

      <div className="el-qr-board">
        <div className="el-qr-board-title">🏆 Bảng xếp hạng cuối cùng</div>
        <div className="el-qr-board-list">
          {leaderboard.slice(0, 5).map((entry) => {
            const m = entry.rank <= 3 ? MEDALS[entry.rank - 1] : `${entry.rank}.`
            const isCurrent = entry.groupId === groupName
            return (
              <div key={entry.groupId}>
                {m}{" "}
                <span className={isCurrent ? "el-qr-board-highlight" : undefined}>
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
        className="el-qr-back"
        onClick={onBackToGroups}
      >
        Về danh sách nhóm
      </button>
    </div>
  )
}
