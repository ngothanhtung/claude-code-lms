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
import { allClasses, grades, summary } from "@/features/elementary/classes/mock"
import type { GradeLevel } from "@/features/elementary/classes/mock"
import styles from "./classes-page.module.css"

/* ─── Grade emoji helper ─── */
const gradeEmoji: Record<GradeLevel, string> = {
  1: "🐣",
  2: "🐥",
  3: "🦊",
  4: "🐯",
  5: "🦅",
}

export function ClassesPage() {
  const [activeGrade, setActiveGrade] = useState<GradeLevel | "all">("all")

  const filtered = useMemo(
    () =>
      activeGrade === "all"
        ? allClasses
        : allClasses.filter((c) => c.grade === activeGrade),
    [activeGrade]
  )

  return (
    <div className={styles.pageWrap}>
      {/* ─── Header ─── */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>Danh sách lớp</h1>
          <p>
            Quản lý lớp học và theo dõi kết quả bài quiz · Năm học 2025–2026
          </p>
        </div>

        {/* Stats chips */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statIcon} data-variant="coral">
              <SchoolIcon />
            </div>
            <div>
              <div className={styles.statNum}>{summary.totalClasses}</div>
              <div className={styles.statLbl}>Lớp</div>
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statIcon} data-variant="gold">
              <UsersIcon />
            </div>
            <div>
              <div className={styles.statNum}>{summary.totalStudents}</div>
              <div className={styles.statLbl}>Học sinh</div>
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statIcon} data-variant="teal">
              <BookCheckIcon />
            </div>
            <div>
              <div className={styles.statNum}>
                {summary.totalQuizzesCompleted}/{summary.totalQuizzesAssigned}
              </div>
              <div className={styles.statLbl}>Bài quiz</div>
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statIcon} data-variant="sky">
              <GraduationCapIcon />
            </div>
            <div>
              <div className={styles.statNum}>{summary.avgCompletionRate}%</div>
              <div className={styles.statLbl}>HT rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Grade tabs ─── */}
      <div className={styles.tabs}>
        <button
          type="button"
          className={cn(styles.tab, activeGrade === "all" && styles.tabActive)}
          onClick={() => setActiveGrade("all")}
        >
          Tất cả
        </button>
        {grades.map((g) => (
          <button
            key={g.level}
            type="button"
            className={cn(
              styles.tab,
              activeGrade === g.level && styles.tabActive
            )}
            onClick={() => setActiveGrade(g.level)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* ─── Class grid ─── */}
      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((cls) => {
            const pct = Math.round(
              (cls.completedQuizzes / cls.totalQuizzes) * 100
            )

            return (
              <Link
                href={`/elementary-teacher/groups?class=${cls.id}`}
                key={cls.id}
                className={cn(
                  styles.card,
                  cls.status === "archived" && styles.archivedCard
                )}
              >
                {/* Top row: grade chip + archived label */}
                <div className={styles.cardTop}>
                  <span className={styles.classBadge} data-grade={cls.grade}>
                    {gradeEmoji[cls.grade]} Lớp {cls.grade}
                  </span>
                  {cls.status === "archived" && (
                    <span className={styles.archivedBadge}>Đã kết thúc</span>
                  )}
                </div>

                {/* Body: class info */}
                <div className={styles.cardBody}>
                  <div>
                    <div className={styles.className}>
                      Lớp {cls.grade}/{cls.classNumber}
                    </div>
                    <div className={styles.classTeacher}>
                      <UsersIcon />
                      GVCN: {cls.homeroomTeacher}
                    </div>
                  </div>

                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                      <UsersIcon />
                      {cls.studentCount} học sinh
                    </span>
                    <span className={styles.metaItem}>
                      <BookOpenIcon />
                      {cls.totalQuizzes} bài quiz
                    </span>
                  </div>
                </div>

                {/* Quiz progress bar */}
                <div className={styles.quizSection}>
                  <div className={styles.quizInfo}>
                    <BookCheckIcon />
                    <span>
                      {cls.completedQuizzes}/{cls.totalQuizzes} đã làm
                    </span>
                  </div>

                  <div className={styles.quizProgress}>
                    <div className={styles.quizTrack}>
                      <span
                        className={styles.quizTrackFill}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={styles.quizPct}>{pct}%</span>
                  </div>

                  <div className={styles.score}>
                    <StarIcon />
                    {cls.averageScore}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <UsersIcon />
          <p>Không có lớp nào thuộc khối này.</p>
        </div>
      )}
    </div>
  )
}
