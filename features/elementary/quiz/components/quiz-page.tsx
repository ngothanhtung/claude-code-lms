"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { QuizTimer } from "./quiz-timer"
import { QuizQuestion } from "./quiz-question"
import { QuizLeaderboard } from "./quiz-leaderboard"
import { QuizResult } from "./quiz-result"
import { useQuizQuestions } from "../hooks/use-quiz-questions"
import { useQuizAnswers } from "../hooks/use-quiz-answers"
import { useLeaderboard } from "../hooks/use-leaderboard"
import { useQuizTimer } from "../hooks/use-quiz-timer"
import { MOCK_QUIZ_ID, QUIZ_DURATION_SECONDS } from "../mock/quiz.mock"
import type { QuizStatus } from "../types/quiz.types"

interface QuizPageProps {
  groupId?: string
  classId?: string
}

export function QuizPage({ groupId = "g-1-1-01", classId = "1-1" }: QuizPageProps) {
  const router = useRouter()
  const [status, setStatus] = useState<QuizStatus>("loading")
  const [currentIdx, setCurrentIdx] = useState(0)

  const { questions } = useQuizQuestions(MOCK_QUIZ_ID)

  const { allAnswers, groupAnswers, submitAnswer } = useQuizAnswers(
    MOCK_QUIZ_ID,
    groupId
  )

  const { leaderboard, currentRank } = useLeaderboard(allAnswers, groupId)

  const answeredMap = useMemo(() => {
    const map = new Map<string, { selectedOption: number; isCorrect: boolean }>()
    const sorted = [...groupAnswers]
      .filter((a) => a.answeredAt && typeof a.answeredAt.toMillis === "function")
      .sort(
        (a, b) => a.answeredAt.toMillis() - b.answeredAt.toMillis()
      )
    for (const answer of sorted) {
      map.set(answer.questionId, {
        selectedOption: answer.selectedOption,
        isCorrect: answer.isCorrect,
      })
    }
    return map
  }, [groupAnswers])

  const handleTimeUp = useCallback(() => {
    setStatus("result")
  }, [])

  const { timeRemaining, isWarning, start, stop } = useQuizTimer(
    QUIZ_DURATION_SECONDS,
    handleTimeUp
  )

  // Start loading → active transition
  useMemo(() => {
    if (questions.length > 0 && status === "loading") {
      setStatus("active")
      start()
    }
  }, [questions, status, start])

  const currentQuestion = questions[currentIdx]

  const handleSelect = useCallback(
    async (optionIndex: number) => {
      if (!currentQuestion) return
      const isCorrect = currentQuestion.options[optionIndex].isCorrect
      await submitAnswer(currentQuestion.id, optionIndex, isCorrect)
    },
    [currentQuestion, submitAnswer]
  )

  const handlePrev = useCallback(() => {
    setCurrentIdx((i) => Math.max(0, i - 1))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))
  }, [questions.length])

  const handleSubmit = useCallback(() => {
    stop()
    setStatus("result")
  }, [stop])

  const handleBackToGroups = useCallback(() => {
    router.push(`/elementary-student/groups?class=${classId}`)
  }, [router, classId])

  if (status === "loading" || !currentQuestion) {
    return (
      <div className="el-quiz-page">
        <div className="el-loading">
          <div className="el-spinner" />
          <span>Đang tải câu hỏi...</span>
        </div>
      </div>
    )
  }

  if (status === "result") {
    const currentGroup = leaderboard.find((e) => e.groupId === groupId)
    return (
      <div className="el-quiz-page">
        <QuizResult
          rank={currentRank}
          score={currentGroup?.score ?? 0}
          correctCount={currentGroup?.correctCount ?? 0}
          totalTime={currentGroup?.totalTime ?? 0}
          groupName={currentGroup?.groupName ?? "Nhóm của bạn"}
          leaderboard={leaderboard}
          onBackToGroups={handleBackToGroups}
        />
      </div>
    )
  }

  const answer = answeredMap.get(currentQuestion.id)
  const selectedIndex = answer?.selectedOption ?? -1
  const answeredCount = answeredMap.size

  return (
    <div className="el-quiz-page">
      <div className="el-quiz-area">
        <div className="el-quiz-header">
          <span style={{ fontSize: 14, color: "hsl(var(--el-muted-foreground))" }}>
            Nhóm {groupId.split("-").pop()}
          </span>
          <QuizTimer timeRemaining={timeRemaining} isWarning={isWarning} />
        </div>

        <div className="el-quiz-progress">
          <div
            className="el-quiz-progress-fill"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>

        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentIdx + 1}
          totalQuestions={questions.length}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          onPrev={handlePrev}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isLast={currentIdx === questions.length - 1}
          isFirst={currentIdx === 0}
          allAnswered={answeredCount === questions.length}
        />
      </div>

      <QuizLeaderboard
        leaderboard={leaderboard}
        currentGroupId={groupId}
      />
    </div>
  )
}
