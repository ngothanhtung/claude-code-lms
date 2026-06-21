"use client"

import {
  BookCheckIcon,
  StarIcon,
  UsersIcon,
  LanguagesIcon,
  CheckCircleIcon,
  CircleIcon,
  CalendarCheck2Icon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStudentClass } from "@/features/elementary/classes/hooks/use-student-class"
import { StudentClassRail } from "@/features/elementary/classes/components/student-class-rail"

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

function getScoreVariant(score: number) {
  if (score >= 9) return "excellent"
  if (score >= 7.5) return "good"
  return "average"
}

export function StudentClassesPage({ classId }: { classId?: string }) {
  const { studentClass, loading, error } = useStudentClass(classId ?? null)

  if (loading || !studentClass) {
    return (
      <div className="el-loading">
        <div className="el-spinner" />
        <span>{loading ? "Đang tải thông tin lớp học..." : error ?? "Không có dữ liệu"}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="el-loading">
        <span>{error}</span>
      </div>
    )
  }

  const cls = studentClass
  const lessonPct = Math.round(
    (cls.completedLessons / cls.totalLessons) * 100
  )

  return (
    <>
      <div className="el-col-main">
        {/* Header */}
        <div className="el-scls-header">
          <div>
            <h1>Lớp của mình</h1>
            <p>
              Môn Tiếng Anh · Năm học 2025–2026
            </p>
          </div>
        </div>

        {/* Class card */}
        <div className="el-scls-card">
          {/* Card header */}
          <div className="el-scls-card-header">
            <div className="el-scls-card-left">
              <span
                className="el-scls-grade"
                data-grade={cls.grade}
              >
                🦊 Lớp {cls.grade}
              </span>
              <h2 className="el-scls-class-name">{cls.className}</h2>
              <div className="el-scls-meta">
                <span className="el-scls-meta-item">
                  <UsersIcon />
                  {cls.studentCount} học sinh
                </span>
                <span className="el-scls-meta-item">
                  <LanguagesIcon />
                  Tiếng Anh
                </span>
                <span className="el-scls-meta-item">
                  <CalendarCheck2Icon />
                  GVCN: {cls.homeroomTeacher}
                </span>
              </div>
            </div>
            <div className="el-scls-score-box">
              <div className="el-scls-score-value">{cls.averageScore}</div>
              <div className="el-scls-score-label">Điểm TB</div>
            </div>
          </div>

          {/* Stats row */}
          <div className="el-scls-stats-row">
            <div className={cn("el-scls-stat-chip", "teal")}>
              <BookCheckIcon />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1 }}>
                  {cls.completedLessons}/{cls.totalLessons}
                </div>
                <div style={{ fontSize: 11, marginTop: 2 }}>
                  Bài học hoàn thành
                </div>
              </div>
            </div>
            <div className={cn("el-scls-stat-chip", "gold")}>
              <StarIcon />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1 }}>{lessonPct}%</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>
                  Tỷ lệ hoàn thành
                </div>
              </div>
            </div>
          </div>

          {/* Lessons progress */}
          <div className="el-scls-section">
            <h3 className="el-scls-section-title">Tiến độ bài học</h3>
            <div className="el-scls-lesson-list">
              {cls.lessons.map((lp) => (
                <div key={lp.lessonNumber} className="el-scls-lesson">
                  <div className="el-scls-lesson-left">
                    <div
                      className={cn(
                        "el-scls-lesson-icon",
                        lp.completed ? "done" : "pending"
                      )}
                    >
                      {lp.completed ? (
                        <CheckCircleIcon />
                      ) : (
                        <CircleIcon />
                      )}
                    </div>
                    <div>
                      <div className="el-scls-lesson-title">
                        Lesson {lp.lessonNumber}: {lp.title}
                      </div>
                      {lp.completed && (
                        <div className="el-scls-lesson-score">
                          Score: {lp.score.toFixed(1)}/10
                        </div>
                      )}
                    </div>
                  </div>
                  {lp.completed && (
                    <div className="el-scls-lesson-bar">
                      <div
                        className="el-scls-lesson-bar-fill"
                        style={{ width: `${(lp.score / 10) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent quizzes */}
          <div className="el-scls-section">
            <h3 className="el-scls-section-title">Quiz gần đây</h3>
            <div className="el-scls-lesson-list">
              {cls.recentQuizzes.map((quiz) => (
                <div
                  key={quiz.title}
                  className="el-scls-lesson"
                >
                  <div className="el-scls-quiz-left">
                    <div className="el-scls-quiz-title">{quiz.title}</div>
                    <div className="el-scls-quiz-date">{quiz.date}</div>
                  </div>
                  <div
                    className={cn(
                      "el-scls-quiz-score",
                      getScoreVariant(quiz.score)
                    )}
                  >
                    {quiz.score}/{quiz.maxScore}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classmates */}
          <div className="el-scls-section">
            <h3 className="el-scls-section-title">
              Bạn cùng lớp
              <span className="el-scls-classmate-count">
                +{cls.classmates.length}
              </span>
            </h3>
            <div className="el-scls-classmates">
              {cls.classmates.map((mate) => (
                <div key={mate.name} className="el-scls-classmate">
                  <div className="el-scls-classmate-avatar">
                    {getInitials(mate.name)}
                  </div>
                  <span className="el-scls-classmate-name">{mate.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right rail — stats & charts */}
      <StudentClassRail cls={cls} />
    </>
  )
}
