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
import { myClasses } from "@/features/elementary/classes/mock/student-classes.mock"
import styles from "./student-classes-page.module.css"

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

function getScoreVariant(score: number) {
  if (score >= 9) return styles.scoreExcellent
  if (score >= 7.5) return styles.scoreGood
  return styles.scoreAverage
}

export function StudentClassesPage() {
  return (
    <div className={styles.pageWrap}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>Lớp của mình</h1>
          <p>
            Môn Tiếng Anh · Năm học 2025–2026 · {myClasses.length} lớp đang học
          </p>
        </div>
      </div>

      {/* Class cards */}
      <div className={styles.classList}>
        {myClasses.map((cls) => {
          const lessonPct = Math.round(
            (cls.completedLessons / cls.totalLessons) * 100
          )

          return (
            <div key={cls.id} className={styles.classCard}>
              {/* Card header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <span
                    className={styles.gradeBadge}
                    data-grade={cls.grade}
                  >
                    🦊 Lớp {cls.grade}
                  </span>
                  <h2 className={styles.className}>{cls.className}</h2>
                  <div className={styles.classMeta}>
                    <span className={styles.metaItem}>
                      <UsersIcon />
                      {cls.studentCount} học sinh
                    </span>
                    <span className={styles.metaItem}>
                      <LanguagesIcon />
                      Tiếng Anh
                    </span>
                    <span className={styles.metaItem}>
                      <CalendarCheck2Icon />
                      GVCN: {cls.homeroomTeacher}
                    </span>
                  </div>
                </div>
                <div className={styles.scoreBox}>
                  <div className={styles.scoreValue}>{cls.averageScore}</div>
                  <div className={styles.scoreLabel}>Điểm TB</div>
                </div>
              </div>

              {/* Stats row */}
              <div className={styles.statsRow}>
                <div className={styles.statChip}>
                  <div className={cn(styles.statIcon, styles.statIconTeal)}>
                    <BookCheckIcon />
                  </div>
                  <div>
                    <div className={styles.statNum}>
                      {cls.completedLessons}/{cls.totalLessons}
                    </div>
                    <div className={styles.statLbl}>Bài học hoàn thành</div>
                  </div>
                </div>
                <div className={styles.statChip}>
                  <div className={cn(styles.statIcon, styles.statIconGold)}>
                    <StarIcon />
                  </div>
                  <div>
                    <div className={styles.statNum}>{lessonPct}%</div>
                    <div className={styles.statLbl}>Tỷ lệ hoàn thành</div>
                  </div>
                </div>
              </div>

              {/* Lessons progress */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Tiến độ bài học</h3>
                <div className={styles.lessonList}>
                  {cls.lessons.map((lp) => (
                    <div key={lp.lessonNumber} className={styles.lessonItem}>
                      <div className={styles.lessonLeft}>
                        <div
                          className={cn(
                            styles.lessonIcon,
                            lp.completed ? styles.lessonIconDone : styles.lessonIconPending
                          )}
                        >
                          {lp.completed ? (
                            <CheckCircleIcon />
                          ) : (
                            <CircleIcon />
                          )}
                        </div>
                        <div>
                          <div className={styles.lessonTitle}>
                            Lesson {lp.lessonNumber}: {lp.title}
                          </div>
                          {lp.completed && (
                            <div className={styles.lessonScore}>
                              Score: {lp.score.toFixed(1)}/10
                            </div>
                          )}
                        </div>
                      </div>
                      {lp.completed && (
                        <div className={styles.lessonBar}>
                          <div
                            className={styles.lessonBarFill}
                            style={{ width: `${(lp.score / 10) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent quizzes */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Quiz gần đây</h3>
                <div className={styles.quizList}>
                  {cls.recentQuizzes.map((quiz) => (
                    <div
                      key={quiz.title}
                      className={styles.quizItem}
                    >
                      <div className={styles.quizLeft}>
                        <div className={styles.quizTitle}>{quiz.title}</div>
                        <div className={styles.quizDate}>{quiz.date}</div>
                      </div>
                      <div
                        className={cn(
                          styles.quizScore,
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
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  Bạn cùng lớp
                  <span className={styles.classmateCount}>
                    +{cls.classmates.length}
                  </span>
                </h3>
                <div className={styles.classmateList}>
                  {cls.classmates.map((mate) => (
                    <div key={mate.name} className={styles.classmate}>
                      <div className={styles.classmateAvatar}>
                        {getInitials(mate.name)}
                      </div>
                      <span className={styles.classmateName}>{mate.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
