"use client"

import { useState } from "react"
import {
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  HelpCircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useQuizzesByLesson } from "../hooks/use-quizzes-by-lesson"
import { useQuizQuestions } from "../hooks/use-quiz-questions"
import type { Lesson } from "@/features/elementary/lessons/hooks/use-lessons"

interface LessonQuizDialogProps {
  lesson: Lesson
  status: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LessonQuizDialog({
  lesson,
  status,
  open,
  onOpenChange,
}: LessonQuizDialogProps) {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const { quizzes, loading: quizzesLoading } = useQuizzesByLesson(
    open ? lesson.id : null
  )
  const { questions, loading: questionsLoading } = useQuizQuestions(
    selectedQuizId ?? ""
  )

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId)

  function handleSelectQuiz(quizId: string) {
    setSelectedQuizId(quizId)
  }

  function handleBack() {
    setSelectedQuizId(null)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSelectedQuizId(null)
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedQuiz
              ? selectedQuiz.title
              : `Lesson ${lesson.lessonNumber}: ${lesson.title}`}
          </DialogTitle>
          <DialogDescription>
            {selectedQuiz
              ? `${selectedQuiz.description} · ${questions.length} câu hỏi`
              : `${lesson.description} · ${lesson.totalWords} từ · ${quizzes.length} quiz`}
          </DialogDescription>
        </DialogHeader>

        {/* Back button when viewing quiz questions */}
        {selectedQuizId && (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline w-fit"
          >
            <ChevronRightIcon className="h-4 w-4 rotate-180" />
            Quay lại danh sách quiz
          </button>
        )}

        {/* Loading */}
        {(quizzesLoading || (selectedQuizId && questionsLoading)) && (
          <div className="flex items-center justify-center py-8">
            <div className="el-spinner" />
          </div>
        )}

        {/* Quiz list */}
        {!selectedQuizId && !quizzesLoading && (
          <div className="space-y-2">
            {quizzes.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Chưa có quiz nào cho bài học này.
              </p>
            ) : (
              quizzes.map((quiz) => (
                <button
                  key={quiz.id}
                  type="button"
                  onClick={() => handleSelectQuiz(quiz.id)}
                  className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <BookOpenIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{quiz.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {quiz.questionCount} câu hỏi · {Math.round(quiz.durationSeconds / 60)} phút
                    </div>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))
            )}
          </div>
        )}

        {/* Questions list */}
        {selectedQuizId && !questionsLoading && (
          <div className="space-y-2">
            {questions.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Chưa có câu hỏi nào.
              </p>
            ) : (
              questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-lg border border-border p-3"
                >
                  <div className="mb-2 flex items-start gap-2">
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium">{q.content}</span>
                  </div>
                  <div className="ml-7 grid grid-cols-2 gap-1.5">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={cn(
                          "rounded-md border px-2.5 py-1.5 text-xs",
                          opt.isCorrect
                            ? "border-success/30 bg-success/10 font-medium text-success"
                            : "border-border bg-muted/30 text-muted-foreground"
                        )}
                      >
                        <span className="mr-1 font-bold">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt.content}
                        {opt.isCorrect && (
                          <CheckCircle2Icon className="ml-1 inline-block h-3 w-3" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
