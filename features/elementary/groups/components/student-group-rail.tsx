"use client"

import {
  TrendingUpIcon,
  TargetIcon,
  AwardIcon,
  BookOpenIcon,
  UsersIcon,
} from "lucide-react"
import type { Group } from "@/features/elementary/quiz/hooks/use-groups"
import type { GroupLesson } from "@/features/elementary/groups/hooks/use-group-lessons"

interface StudentGroupRailProps {
  group: Group
  allGroups: Group[]
  myGroupId: string
  groupLessons: GroupLesson[]
}

export function StudentGroupRail({
  group,
  allGroups,
  myGroupId,
  groupLessons,
}: StudentGroupRailProps) {
  const quizPct = group.totalQuizzes > 0
    ? Math.round((group.completedQuizzes / group.totalQuizzes) * 100)
    : 0

  const completedScores = groupLessons
    .filter((gl) => gl.status === "completed")
    .map((gl) => gl.score)
  const avgScore =
    completedScores.length > 0
      ? (
          completedScores.reduce((a, b) => a + b, 0) / completedScores.length
        ).toFixed(1)
      : "0"

  // Rank among class groups by averageScore
  const sortedGroups = [...allGroups].sort(
    (a, b) => parseFloat(b.averageScore) - parseFloat(a.averageScore)
  )
  const myRank = sortedGroups.findIndex((g) => g.id === myGroupId) + 1

  // Group ranking for rail display
  const groupRanking = sortedGroups.slice(0, 5).map((g, i) => ({
    groupName: `Nhóm ${g.id.split("_").pop()}`,
    averageScore: g.averageScore,
    isMe: g.id === myGroupId,
    rank: i + 1,
  }))

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
              <span className="el-scls-rail-stat-value">#{myRank}</span>
              <span className="el-scls-rail-stat-label">Trong lớp</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Groups in Class ── */}
      <div className="el-scls-rail-card">
        <div className="el-scls-rail-header">
          <h2 className="el-scls-rail-title">
            <AwardIcon className="el-scls-rail-header-icon" />
            Xếp hạng nhóm
          </h2>
          <span className="el-scls-rail-header-link">
            Lớp {group.className}
          </span>
        </div>
        <div className="el-scls-rail-leaderboard">
          {groupRanking.map((gr, i) => (
            <div
              key={gr.groupName + i}
              className={`el-scls-rail-lb-row ${gr.isMe ? "is-me" : ""}`}
            >
              <span
                className={`el-scls-rail-lb-rank ${
                  gr.rank <= 3 ? `top-${gr.rank}` : ""
                }`}
              >
                {gr.rank}
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
