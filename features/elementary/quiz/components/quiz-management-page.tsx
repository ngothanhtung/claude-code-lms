"use client"

import { useMemo, useState } from "react"
import {
  BookCheckIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  HelpCircleIcon,
  TimerIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLessons, type Lesson } from "@/features/elementary/lessons/hooks/use-lessons"
import { useQuizzesByLesson, type Quiz } from "../hooks/use-quizzes-by-lesson"
import { useQuizQuestions } from "../hooks/use-quiz-questions"

/* ─── Stats ring helper ─── */
function StatRing({
  value,
  label,
}: {
  value: string
  label: string
}) {
  return (
    <div className="el-qm-stat">
      <div className="el-qm-stat-value">{value}</div>
      <div className="el-qm-stat-label">{label}</div>
    </div>
  )
}

/* ─── Main page ─── */
export function QuizManagementPage() {
  const { lessons, loading: lessonsLoading } = useLessons()

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)

  const { quizzes, loading: quizzesLoading } = useQuizzesByLesson(selectedLessonId)
  const { questions, loading: questionsLoading } = useQuizQuestions(selectedQuizId ?? "")

  const selectedLesson = lessons.find((l) => l.id === selectedLessonId) ?? null
  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId) ?? null

  /* ─── Drill-down navigation ─── */
  function handleSelectLesson(lessonId: string) {
    setSelectedLessonId(lessonId)
    setSelectedQuizId(null)
  }

  function handleSelectQuiz(quizId: string) {
    setSelectedQuizId(quizId)
  }

  function handleBackToLessons() {
    setSelectedLessonId(null)
    setSelectedQuizId(null)
  }

  function handleBackToQuizzes() {
    setSelectedQuizId(null)
  }

  /* ─── Stats ─── */
  const totalQuizzes = useMemo(
    () => lessons.reduce((sum, l) => sum + l.quizCount, 0),
    [lessons]
  )
  const totalWords = useMemo(
    () => lessons.reduce((sum, l) => sum + l.totalWords, 0),
    [lessons]
  )

  /* ─── Breadcrumb ─── */
  const breadcrumb = useMemo(() => {
    const crumbs: { label: string; onClick?: () => void }[] = [
      { label: "Bài quiz", onClick: handleBackToLessons },
    ]
    if (selectedLesson) {
      crumbs.push({
        label: `Lesson ${selectedLesson.lessonNumber}: ${selectedLesson.title}`,
        onClick: handleBackToQuizzes,
      })
    }
    if (selectedQuiz) {
      crumbs.push({ label: selectedQuiz.title })
    }
    return crumbs
  }, [selectedLesson, selectedQuiz])

  return (
    <div className="el-qm-page">
      {/* ─── Header ─── */}
      <div className="el-qm-header">
        <div>
          <h1>Quản lý bài quiz</h1>
          <p>Xem và quản lý quiz cùng câu hỏi theo từng bài học</p>
        </div>
        <div className="el-qm-stats">
          <div className="el-qm-stat-icon-wrap" data-variant="teal">
            <BookOpenIcon />
          </div>
          <StatRing value={String(lessons.length)} label="Bài học" />

          <div className="el-qm-stat-icon-wrap" data-variant="indigo">
            <BookCheckIcon />
          </div>
          <StatRing value={String(totalQuizzes)} label="Quiz" />

          <div className="el-qm-stat-icon-wrap" data-variant="amber">
            <HelpCircleIcon />
          </div>
          <StatRing
            value={String(lessons.length * 10)}
            label="Câu hỏi"
          />
        </div>
      </div>

      {/* ─── Breadcrumb ─── */}
      {selectedLessonId && (
        <div className="el-qm-breadcrumb">
          {breadcrumb.map((crumb, idx) => (
            <span key={idx} className="el-qm-bc-item">
              {crumb.onClick ? (
                <button
                  type="button"
                  onClick={crumb.onClick}
                  className="el-qm-bc-link"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="el-qm-bc-current">{crumb.label}</span>
              )}
              {idx < breadcrumb.length - 1 && (
                <ChevronRightIcon className="el-qm-bc-sep" />
              )}
            </span>
          ))}
        </div>
      )}

      {/* ─── Content ─── */}
      <div className="el-qm-content">
        {/* ─── Level 1: Lessons ─── */}
        {!selectedLessonId && (
          <>
            {lessonsLoading ? (
              <div className="el-qm-loading">
                <div className="el-spinner" />
                <span>Đang tải danh sách bài học...</span>
              </div>
            ) : (
              <div className="el-qm-grid">
                {lessons
                  .slice()
                  .sort((a, b) => a.lessonNumber - b.lessonNumber)
                  .map((lesson) => (
                    <button
                      key={lesson.id}
                      type="button"
                      className="el-qm-lesson-card"
                      onClick={() => handleSelectLesson(lesson.id)}
                    >
                      <div className="el-qm-lc-num">{lesson.lessonNumber}</div>
                      <div className="el-qm-lc-body">
                        <div className="el-qm-lc-title">{lesson.title}</div>
                        <div className="el-qm-lc-meta">
                          {lesson.description}
                        </div>
                        <div className="el-qm-lc-stats">
                          <span className="el-qm-lc-chip">
                            <BookCheckIcon className="h-3 w-3" />
                            {lesson.quizCount} quiz
                          </span>
                          <span className="el-qm-lc-chip">
                            <HelpCircleIcon className="h-3 w-3" />
                            {lesson.quizCount * 10} câu hỏi
                          </span>
                          <span className="el-qm-lc-chip">
                            <BookOpenIcon className="h-3 w-3" />
                            {lesson.totalWords} từ
                          </span>
                        </div>
                      </div>
                      <ChevronRightIcon className="el-qm-lc-arrow" />
                    </button>
                  ))}
              </div>
            )}
          </>
        )}

        {/* ─── Level 2: Quizzes for selected lesson ─── */}
        {selectedLessonId && !selectedQuizId && (
          <>
            {quizzesLoading ? (
              <div className="el-qm-loading">
                <div className="el-spinner" />
                <span>Đang tải danh sách quiz...</span>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="el-qm-empty">
                <BookOpenIcon />
                <p>Chưa có quiz nào cho bài học này.</p>
              </div>
            ) : (
              <div className="el-qm-grid">
                {quizzes.map((quiz) => (
                  <button
                    key={quiz.id}
                    type="button"
                    className="el-qm-quiz-card"
                    onClick={() => handleSelectQuiz(quiz.id)}
                  >
                    <div className="el-qm-qc-icon">
                      <BookCheckIcon className="h-5 w-5" />
                    </div>
                    <div className="el-qm-qc-body">
                      <div className="el-qm-qc-title">{quiz.title}</div>
                      <div className="el-qm-qc-meta">{quiz.description}</div>
                      <div className="el-qm-qc-stats">
                        <span className="el-qm-qc-chip">
                          <HelpCircleIcon className="h-3 w-3" />
                          {quiz.questionCount} câu hỏi
                        </span>
                        <span className="el-qm-qc-chip">
                          <TimerIcon className="h-3 w-3" />
                          {Math.round(quiz.durationSeconds / 60)} phút
                        </span>
                      </div>
                    </div>
                    <ChevronRightIcon className="el-qm-qc-arrow" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ─── Level 3: Questions for selected quiz ─── */}
        {selectedQuizId && (
          <>
            {questionsLoading ? (
              <div className="el-qm-loading">
                <div className="el-spinner" />
                <span>Đang tải câu hỏi...</span>
              </div>
            ) : questions.length === 0 ? (
              <div className="el-qm-empty">
                <HelpCircleIcon />
                <p>Chưa có câu hỏi nào trong quiz này.</p>
              </div>
            ) : (
              <div className="el-qm-questions">
                {/* Quiz info banner */}
                {selectedQuiz && (
                  <div className="el-qm-quiz-banner">
                    <div className="el-qm-qb-left">
                      <BookCheckIcon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-semibold">{selectedQuiz.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedQuiz.description}
                        </div>
                      </div>
                    </div>
                    <div className="el-qm-qb-right">
                      <span className="el-qm-qb-chip">
                        <HelpCircleIcon className="h-3.5 w-3.5" />
                        {questions.length} câu hỏi
                      </span>
                      <span className="el-qm-qb-chip">
                        <TimerIcon className="h-3.5 w-3.5" />
                        {Math.round(selectedQuiz.durationSeconds / 60)} phút
                      </span>
                    </div>
                  </div>
                )}

                {/* Questions list */}
                {questions.map((q, idx) => (
                  <div key={q.id} className="el-qm-question-card">
                    <div className="el-qm-q-header">
                      <span className="el-qm-q-num">Câu {idx + 1}</span>
                      <span className="el-qm-q-type">
                        {q.type === "quiz" ? "Trắc nghiệm" : "Điền khuyết"}
                      </span>
                    </div>
                    <div className="el-qm-q-content">{q.content}</div>
                    <div className="el-qm-q-options">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={cn(
                            "el-qm-q-option",
                            opt.isCorrect && "correct"
                          )}
                        >
                          <span className="el-qm-q-letter">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="el-qm-q-text">{opt.content}</span>
                          {opt.isCorrect && (
                            <CheckCircle2Icon className="el-qm-q-check" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
