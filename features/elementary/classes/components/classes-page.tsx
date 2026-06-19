"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  BookCheckIcon,
  BookOpenIcon,
  GraduationCapIcon,
  SchoolIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useClasses, type GradeLevel } from "@/features/elementary/quiz/hooks/use-classes"

/* ─── Grade emoji helper ─── */
const gradeEmoji: Record<GradeLevel, string> = {
  1: "🐣",
  2: "🐥",
  3: "🦊",
  4: "🐯",
  5: "🦅",
}

export function ClassesPage() {
  const { classes: allClasses } = useClasses()
  const grades: { level: GradeLevel; label: string }[] = [
    { level: 1, label: "Lớp 1" },
    { level: 2, label: "Lớp 2" },
    { level: 3, label: "Lớp 3" },
    { level: 4, label: "Lớp 4" },
    { level: 5, label: "Lớp 5" },
  ]
  const summary = useMemo(() => {
    const active = allClasses.filter((c) => c.status === "active")
    const totalQuizzesAssigned = active.reduce((s, c) => s + c.totalQuizzes, 0)
    const totalQuizzesCompleted = active.reduce((s, c) => s + c.completedQuizzes, 0)
    return {
      totalClasses: active.length,
      totalStudents: active.reduce((s, c) => s + c.studentCount, 0),
      totalQuizzesAssigned,
      totalQuizzesCompleted,
      avgCompletionRate: totalQuizzesAssigned > 0
        ? Math.round((totalQuizzesCompleted / totalQuizzesAssigned) * 100)
        : 0,
    }
  }, [allClasses])
  const [activeGrade, setActiveGrade] = useState<GradeLevel | "all">("all")

  const filtered = useMemo(
    () =>
      activeGrade === "all"
        ? allClasses
        : allClasses.filter((c) => c.grade === activeGrade),
    [activeGrade]
  )

  return (
    <div className="el-cls-page">
      {/* ─── Header ─── */}
      <div className="el-cls-header">
        <div>
          <h1>Danh sách lớp</h1>
          <p>
            Quản lý lớp học và theo dõi kết quả bài quiz · Năm học 2025–2026
          </p>
        </div>

        {/* Stats chips */}
        <div className="el-cls-stats">
          <div className="el-cls-stat">
            <div className="el-cls-stat-icon" data-variant="coral">
              <SchoolIcon />
            </div>
            <div>
              <div className="el-cls-stat-num">{summary.totalClasses}</div>
              <div className="el-cls-stat-lbl">Lớp</div>
            </div>
          </div>

          <div className="el-cls-stat">
            <div className="el-cls-stat-icon" data-variant="gold">
              <UsersIcon />
            </div>
            <div>
              <div className="el-cls-stat-num">{summary.totalStudents}</div>
              <div className="el-cls-stat-lbl">Học sinh</div>
            </div>
          </div>

          <div className="el-cls-stat">
            <div className="el-cls-stat-icon" data-variant="teal">
              <BookCheckIcon />
            </div>
            <div>
              <div className="el-cls-stat-num">
                {summary.totalQuizzesCompleted}/{summary.totalQuizzesAssigned}
              </div>
              <div className="el-cls-stat-lbl">Bài quiz</div>
            </div>
          </div>

          <div className="el-cls-stat">
            <div className="el-cls-stat-icon" data-variant="sky">
              <GraduationCapIcon />
            </div>
            <div>
              <div className="el-cls-stat-num">{summary.avgCompletionRate}%</div>
              <div className="el-cls-stat-lbl">HT rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Grade tabs ─── */}
      <div className="el-cls-tabs">
        <button
          type="button"
          className={cn("el-cls-tab", activeGrade === "all" && "active")}
          onClick={() => setActiveGrade("all")}
        >
          Tất cả
        </button>
        {grades.map((g) => (
          <button
            key={g.level}
            type="button"
            className={cn(
              "el-cls-tab",
              activeGrade === g.level && "active"
            )}
            onClick={() => setActiveGrade(g.level)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* ─── Class grid ─── */}
      {filtered.length > 0 ? (
        <div className="el-cls-grid">
          {filtered.map((cls) => {
            const pct = Math.round(
              (cls.completedQuizzes / cls.totalQuizzes) * 100
            )

            return (
              <Link
                href={`/elementary-teacher/groups?class=${cls.id}`}
                key={cls.id}
                className={cn(
                  "el-cls-card",
                  cls.status === "archived" && "archived"
                )}
              >
                {/* Top row: grade chip + archived label */}
                <div className="el-cls-card-top">
                  <span className="el-cls-badge" data-grade={cls.grade}>
                    {gradeEmoji[cls.grade]} Lớp {cls.grade}
                  </span>
                  {cls.status === "archived" && (
                    <span className="el-cls-archived-badge">Đã kết thúc</span>
                  )}
                </div>

                {/* Body: class info */}
                <div className="el-cls-card-body">
                  <div>
                    <div className="el-cls-name">
                      Lớp {cls.grade}/{cls.classNumber}
                    </div>
                    <div className="el-cls-teacher">
                      <UsersIcon />
                      GVCN: {cls.homeroomTeacher}
                    </div>
                  </div>

                  <div className="el-cls-meta">
                    <span className="el-cls-meta-item">
                      <UsersIcon />
                      {cls.studentCount} học sinh
                    </span>
                    <span className="el-cls-meta-item">
                      <BookOpenIcon />
                      {cls.totalQuizzes} bài quiz
                    </span>
                  </div>
                </div>

                {/* Quiz progress bar */}
                <div className="el-cls-quiz-section">
                  <div className="el-cls-quiz-info">
                    <BookCheckIcon />
                    <span>
                      {cls.completedQuizzes}/{cls.totalQuizzes} đã làm
                    </span>
                  </div>

                  <div className="el-progress">
                    <div className="el-progress-track">
                      <span
                        className="el-progress-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="el-progress-pct">{pct}%</span>
                  </div>

                  <div className="el-cls-score">
                    <StarIcon />
                    {cls.averageScore}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="el-cls-empty">
          <UsersIcon />
          <p>Không có lớp nào thuộc khối này.</p>
        </div>
      )}
    </div>
  )
}
