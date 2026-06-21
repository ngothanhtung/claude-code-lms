"use client"

import {
  TrendingUpIcon,
  TargetIcon,
  FlameIcon,
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
      ? (completedScores.reduce((a, b) => a + b, 0) / completedScores.length).toFixed(1)
      : "0"

  // Simulate streak data (days studied this week)
  const streakDays = [true, true, false, true, true, true, false]
  const streakLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

  // Quiz score trend for bar chart
  const quizScores = [...cls.recentQuizzes].reverse()

  // Rank among classmates (simulated)
  const rank = 3

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
              <span className="el-scls-rail-stat-value">{cls.completedLessons}/{cls.totalLessons}</span>
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
            <div className="el-scls-rail-stat-icon red">
              <FlameIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">4 ngày</span>
              <span className="el-scls-rail-stat-label">Streak hiện tại</span>
            </div>
          </div>

          <div className="el-scls-rail-stat">
            <div className="el-scls-rail-stat-icon indigo">
              <TrendingUpIcon />
            </div>
            <div className="el-scls-rail-stat-info">
              <span className="el-scls-rail-stat-value">#{rank}</span>
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
                className={`el-scls-rail-streak-dot ${streakDays[i] ? "active" : ""}`}
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

      {/* ── Quiz Score Trend ── */}
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
                <span className="el-scls-rail-chart-bar-value">{quiz.score}</span>
                <span className="el-scls-rail-chart-bar-label">
                  L{cls.recentQuizzes.length - i}
                </span>
              </div>
            )
          })}
        </div>

        {/* Score legend */}
        <div className="el-scls-rail-chart-legend">
          <span className="el-scls-rail-legend-item">
            <span className="el-scls-rail-legend-dot" style={{ background: "hsl(142 65% 48%)" }} />
            ≥9
          </span>
          <span className="el-scls-rail-legend-item">
            <span className="el-scls-rail-legend-dot" style={{ background: "hsl(217 65% 48%)" }} />
            7.5–8.9
          </span>
          <span className="el-scls-rail-legend-item">
            <span className="el-scls-rail-legend-dot" style={{ background: "hsl(38 65% 48%)" }} />
            &lt;7.5
          </span>
        </div>
      </div>

      {/* ── Top Classmates ── */}
      <div className="el-scls-rail-card">
        <div className="el-scls-rail-header">
          <h2 className="el-scls-rail-title">
            <AwardIcon className="el-scls-rail-header-icon" />
            Bảng xếp hạng
          </h2>
          <span className="el-scls-rail-header-link">Lớp 3A</span>
        </div>

        <div className="el-scls-rail-leaderboard">
          {[
            { ...cls.classmates[0], score: "9.6" },
            { ...cls.classmates[1], score: "9.2" },
            { name: "Bạn", avatar: "T", score: avgScore, isMe: true },
            { ...cls.classmates[2], score: "8.1" },
            { ...cls.classmates[3], score: "7.9" },
          ].map((mate, i) => (
              <div
                key={`${mate.name}-${i}`}
                className={`el-scls-rail-lb-row ${mate.isMe ? "is-me" : ""}`}
              >
                <span
                  className={`el-scls-rail-lb-rank ${i < 3 ? `top-${i + 1}` : ""}`}
                >
                  {i + 1}
                </span>
                <div className="el-scls-rail-lb-avatar">
                  {getInitials(mate.name)}
                </div>
                <span className="el-scls-rail-lb-name">
                  {mate.name}
                  {mate.isMe && <span className="el-scls-rail-lb-me-badge">Bạn</span>}
                </span>
                <span className="el-scls-rail-lb-score">{mate.score}</span>
              </div>
            ))}
        </div>
      </div>
    </aside>
  )
}
