"use client"

import {
  TrendingUpIcon,
  TargetIcon,
  AwardIcon,
  BookOpenIcon,
} from "lucide-react"
import type { StudentClass } from "@/features/elementary/classes/types/student-class.types"

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

interface StudentClassRailProps {
  cls: StudentClass
}

export function StudentClassRail({ cls }: StudentClassRailProps) {
  const lessonPct = Math.round((cls.completedLessons / cls.totalLessons) * 100)
  const completedScores = cls.lessons
    .filter((l) => l.completed)
    .map((l) => l.score)
  const avgScore =
    completedScores.length > 0
      ? (
          completedScores.reduce((a, b) => a + b, 0) / completedScores.length
        ).toFixed(1)
      : "0"

  // Quiz score trend for bar chart
  const quizScores = [...cls.recentQuizzes].reverse()

  // Rank among classmates (by averageScore from Firestore)
  const sortedClassmates = [...cls.classmates].sort(
    (a, b) => b.averageScore - a.averageScore
  )
  const myRank =
    sortedClassmates.findIndex((m) => m.averageScore <= parseFloat(avgScore)) +
    1 || sortedClassmates.length

  // Top 5 leaderboard: top classmates + "Bạn"
  const topClassmates = sortedClassmates.slice(0, 5)
  const leaderboardEntries = topClassmates.map((m) => ({
    name: m.name,
    avatar: m.avatar,
    score: m.averageScore.toFixed(1),
    isMe: false,
  }))
  const meInTop5 = topClassmates.some(
    (m) => m.averageScore <= parseFloat(avgScore)
  )
  if (!meInTop5 && completedScores.length > 0) {
    let insertIdx = leaderboardEntries.findIndex(
      (e) => parseFloat(e.score) < parseFloat(avgScore)
    )
    if (insertIdx === -1) insertIdx = leaderboardEntries.length
    leaderboardEntries.splice(insertIdx, 0, {
      name: "Bạn",
      avatar: cls.classmates[0]?.avatar ?? "T",
      score: avgScore,
      isMe: true,
    })
    leaderboardEntries.length = Math.min(leaderboardEntries.length, 5)
  }

  return (
    <aside className="el-rail">
      {/* ── Overview Stats ── */}
      <div className="el-scls-rail-card">
        <div className="el-scls-rail-header">
          <h2 className="el-scls-rail-title">
            <TargetIcon className="el-scls-rail-header-icon" />
            Tổng quan học tập
          </h2>
        </div>

        <div className="el-scls-rail-stats">
          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon teal">
              <BookOpenIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">
                {cls.completedLessons}/{cls.totalLessons}
              </span>
              <span className="el-scls-rail-stat-label">Bài học</span>
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
                  strokeDasharray={`${lessonPct}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="el-scls-rail-ring-text">{lessonPct}%</span>
            </div>
          </div>

          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon amber">
              <AwardIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">{avgScore}</span>
              <span className="el-scls-rail-stat-label">Điểm TB</span>
            </div>
          </div>

          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon indigo">
              <TrendingUpIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">
                {myRank > 0 ? `#${myRank}` : "—"}
              </span>
              <span className="el-scls-rail-stat-label">Trong lớp</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quiz Score Trend ── */}
      {quizScores.length > 0 && (
        <div className="el-scls-rail-card">
          <div className="el-scls-rail-header">
            <h2 className="el-scls-rail-title">
              <TrendingUpIcon className="el-scls-rail-header-icon" />
              Xu hướng điểm quiz
            </h2>
          </div>

          <div className="el-scls-rail-chart">
            {quizScores.map((quiz, i) => {
              const pct = (quiz.score / quiz.maxScore) * 100
              const hue = quiz.score >= 9 ? 142 : quiz.score >= 7.5 ? 217 : 38
              return (
                <div key={i} className="el-scls-rail-chart-bar-group">
                  <div className="el-scls-rail-chart-bar-track">
                    <div
                      className="el-scls-rail-chart-bar-fill"
                      style={{
                        height: `${pct}%`,
                        background: `hsl(${hue} 65% 48%)`,
                      }}
                    />
                  </div>
                  <span className="el-scls-rail-chart-bar-value">
                    {quiz.score}
                  </span>
                  <span className="el-scls-rail-chart-bar-label">
                    L{cls.recentQuizzes.length - i}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="el-scls-rail-chart-legend">
            <span className="el-scls-rail-legend-item">
              <span
                className="el-scls-rail-legend-dot"
                style={{ background: "hsl(142 65% 48%)" }}
              />
              ≥9
            </span>
            <span className="el-scls-rail-legend-item">
              <span
                className="el-scls-rail-legend-dot"
                style={{ background: "hsl(217 65% 48%)" }}
              />
              7.5–8.9
            </span>
            <span className="el-scls-rail-legend-item">
              <span
                className="el-scls-rail-legend-dot"
                style={{ background: "hsl(38 65% 48%)" }}
              />
              &lt;7.5
            </span>
          </div>
        </div>
      )}

      {/* ── Top Classmates ── */}
      {leaderboardEntries.length > 0 && (
        <div className="el-scls-rail-card">
          <div className="el-scls-rail-header">
            <h2 className="el-scls-rail-title">
              <AwardIcon className="el-scls-rail-header-icon" />
              Bảng xếp hạng
            </h2>
            <span className="el-scls-rail-header-link">
              Lớp {cls.grade}/{cls.classNumber}
            </span>
          </div>

          <div className="el-scls-rail-leaderboard">
            {leaderboardEntries.map((mate, i) => (
              <div
                key={`${mate.name}-${i}`}
                className={`el-scls-rail-lb-row ${mate.isMe ? "is-me" : ""}`}
              >
                <span
                  className={`el-scls-rail-lb-rank ${
                    i < 3 ? `top-${i + 1}` : ""
                  }`}
                >
                  {i + 1}
                </span>
                <div className="el-scls-rail-lb-avatar">
                  {getInitials(mate.name)}
                </div>
                <span className="el-scls-rail-lb-name">
                  {mate.name}
                  {mate.isMe && (
                    <span className="el-scls-rail-lb-me-badge">Bạn</span>
                  )}
                </span>
                <span className="el-scls-rail-lb-score">{mate.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
