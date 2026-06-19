"use client"

import {
  TrendingUpIcon,
  TargetIcon,
  FlameIcon,
  AwardIcon,
  BookOpenIcon,
  UsersIcon,
} from "lucide-react"
interface StudentGroup {
  id: string
  className: string
  grade: number
  classNumber: number
  members: { name: string; studentId: string; avatar: string }[]
  totalQuizzes: number
  completedQuizzes: number
  averageScore: string
  quizzes: { title: string; score: number; maxScore: number; date: string; completed: boolean }[]
  recentActivity: { label: string; time: string }[]
}

const classGroupsRank = [
  { groupName: "Nhóm 1", averageScore: "8.6", completedQuizzes: 10, totalQuizzes: 12, isMe: false },
  { groupName: "Nhóm 2", averageScore: "8.5", completedQuizzes: 8, totalQuizzes: 12, isMe: true },
  { groupName: "Nhóm 3", averageScore: "9.1", completedQuizzes: 11, totalQuizzes: 12, isMe: false },
]

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

interface StudentGroupRailProps {
  group: StudentGroup
}

export function StudentGroupRail({ group }: StudentGroupRailProps) {
  const quizPct = Math.round((group.completedQuizzes / group.totalQuizzes) * 100)
  const completedScores = group.quizzes
    .filter((q) => q.completed)
    .map((q) => q.score)
  const avgScore =
    completedScores.length > 0
      ? (
          completedScores.reduce((a, b) => a + b, 0) / completedScores.length
        ).toFixed(1)
      : "0"

  const streakDays = [true, true, false, true, true, true, false]
  const streakLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

  return (
    <aside className="el-rail">
      {/* ── Overview Stats ── */}
      <div className="el-scls-rail-card">
        <div className="el-scls-rail-header">
          <h2 className="el-scls-rail-title">
            <TargetIcon className="el-scls-rail-header-icon" />
            Tổng quan nhóm
          </h2>
        </div>
        <div className="el-scls-rail-stats">
          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon teal">
              <UsersIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">
                {group.members.length} thành viên
              </span>
              <span className="el-scls-rail-stat-label">Trong nhóm</span>
            </div>
          </div>
          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon amber">
              <AwardIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">{avgScore}</span>
              <span className="el-scls-rail-stat-label">Điểm TB nhóm</span>
            </div>
          </div>
          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon teal">
              <BookOpenIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">
                {group.completedQuizzes}/{group.totalQuizzes}
              </span>
              <span className="el-scls-rail-stat-label">Quiz đã làm</span>
            </div>
            <div className="el-scls-rail-stat-ring">
              <svg viewBox="0 0 36 36" className="el-scls-rail-ring">
                <path
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--el-muted))"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(172 56% 38%)"
                  strokeWidth="3"
                  strokeDasharray={`${quizPct}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="el-scls-rail-ring-text">{quizPct}%</span>
            </div>
          </div>
          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon indigo">
              <TrendingUpIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">#2</span>
              <span className="el-scls-rail-stat-label">Trong lớp</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Study Streak Heatmap ── */}
      <div className="el-scls-rail-card">
        <div className="el-scls-rail-header">
          <h2 className="el-scls-rail-title">
            <FlameIcon className="el-scls-rail-header-icon" />
            Tuần này
          </h2>
        </div>
        <div className="el-scls-rail-streak">
          {streakLabels.map((label, i) => (
            <div key={label} className="el-scls-rail-streak-day">
              <div
                className={`el-scls-rail-streak-dot ${
                  streakDays[i] ? "active" : ""
                }`}
              />
              <span className="el-scls-rail-streak-label">{label}</span>
            </div>
          ))}
        </div>
        <div className="el-scls-rail-streak-summary">
          <span className="el-scls-rail-streak-count">
            {streakDays.filter(Boolean).length}/7 ngày đã học
          </span>
        </div>
      </div>

      {/* ── Top Groups in Class ── */}
      <div className="el-scls-rail-card">
        <div className="el-scls-rail-header">
          <h2 className="el-scls-rail-title">
            <AwardIcon className="el-scls-rail-header-icon" />
            Xếp hạng nhóm
          </h2>
          <span className="el-scls-rail-header-link">Lớp 3A</span>
        </div>
        <div className="el-scls-rail-leaderboard">
          {classGroupsRank.map((gr, i) => (
            <div
              key={gr.groupName}
              className={`el-scls-rail-lb-row ${gr.isMe ? "is-me" : ""}`}
            >
              <span
                className={`el-scls-rail-lb-rank ${
                  i < 3 ? `top-${i + 1}` : ""
                }`}
              >
                {i + 1}
              </span>
              <div className="el-scls-rail-lb-avatar">
                <UsersIcon className="h-3 w-3" />
              </div>
              <span className="el-scls-rail-lb-name">
                {gr.groupName}
                {gr.isMe && (
                  <span className="el-scls-rail-lb-me-badge">Nhóm bạn</span>
                )}
              </span>
              <span className="el-scls-rail-lb-score">{gr.averageScore}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
