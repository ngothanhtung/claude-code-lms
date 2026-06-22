"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeftIcon, ChevronRightIcon, SendIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuizQuestion as QuizQuestionType } from "../types/quiz.types"

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
    <div className="el-q-card">
      <div className="el-q-header">
        <span className="el-q-num">
          Câu <strong>{questionNumber}</strong> / {totalQuestions}
        </span>
      </div>

      <div className="el-q-content">{question.content}</div>

      {question.type === "image_choice" && question.imageUrl && (
        <div className="el-q-image">
          <img src={question.imageUrl} alt={question.content} />
        </div>
      )}

      <div className="el-q-options">
        {question.options.map((option, idx) => {
          let optionClass = "el-q-option"
          if (idx === selectedIndex) {
            if (feedback === "correct") optionClass = cn("el-q-option", "correct")
            else if (feedback === "wrong") optionClass = cn("el-q-option", "wrong")
            else optionClass = cn("el-q-option", "selected")
          }

          return (
            <button
              key={idx}
              type="button"
              className={optionClass}
              onClick={() => handleSelect(idx)}
              disabled={feedback !== null}
            >
              <span className="el-q-letter">{OPTION_LETTERS[idx]}</span>
              <span>{option.content}</span>
            </button>
          )
        })}
      </div>

      <div className="el-q-nav">
        <button
          type="button"
          className={cn("el-q-nav-btn", "prev", isFirst && "disabled")}
          onClick={onPrev}
          disabled={isFirst}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Câu trước
        </button>

        {isLast && allAnswered ? (
          <button
            type="button"
            className={cn("el-q-nav-btn", "submit")}
            onClick={onSubmit}
          >
            Nộp bài
            <SendIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            className={cn("el-q-nav-btn", "next")}
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
