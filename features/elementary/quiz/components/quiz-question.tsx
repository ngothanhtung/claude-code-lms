"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeftIcon, ChevronRightIcon, SendIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuizQuestion as QuizQuestionType } from "../types/quiz.types"
import styles from "./quiz-question.module.css"

const OPTION_LETTERS = ["A", "B", "C", "D"]

interface QuizQuestionProps {
  question: QuizQuestionType
  questionNumber: number
  totalQuestions: number
  selectedIndex: number
  onSelect: (optionIndex: number) => void
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
  isLast: boolean
  isFirst: boolean
  allAnswered: boolean
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  onSelect,
  onPrev,
  onNext,
  onSubmit,
  isLast,
  isFirst,
  allAnswered,
}: QuizQuestionProps) {
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)

  useEffect(() => {
    setFeedback(null)
  }, [question.id])

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (feedback !== null) return
      onSelect(optionIndex)
      const isCorrect = question.options[optionIndex].isCorrect
      setFeedback(isCorrect ? "correct" : "wrong")
    },
    [feedback, onSelect, question.options]
  )

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.questionNum}>
          Câu <strong>{questionNumber}</strong> / {totalQuestions}
        </span>
      </div>

      <div className={styles.questionContent}>{question.content}</div>

      <div className={styles.options}>
        {question.options.map((option, idx) => {
          let optionClass = styles.option
          if (idx === selectedIndex) {
            if (feedback === "correct") optionClass = cn(styles.option, styles.optionCorrect)
            else if (feedback === "wrong") optionClass = cn(styles.option, styles.optionWrong)
            else optionClass = cn(styles.option, styles.optionSelected)
          }

          return (
            <button
              key={idx}
              type="button"
              className={optionClass}
              onClick={() => handleSelect(idx)}
              disabled={feedback !== null}
            >
              <span className={styles.optionLetter}>{OPTION_LETTERS[idx]}</span>
              <span>{option.content}</span>
            </button>
          )
        })}
      </div>

      <div className={styles.nav}>
        <button
          type="button"
          className={cn(styles.navBtn, styles.navBtnPrev, isFirst && styles.navBtnDisabled)}
          onClick={onPrev}
          disabled={isFirst}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Câu trước
        </button>

        {isLast && allAnswered ? (
          <button
            type="button"
            className={cn(styles.navBtn, styles.navBtnSubmit)}
            onClick={onSubmit}
          >
            Nộp bài
            <SendIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            className={cn(styles.navBtn, styles.navBtnNext)}
            onClick={onNext}
          >
            Câu tiếp
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
