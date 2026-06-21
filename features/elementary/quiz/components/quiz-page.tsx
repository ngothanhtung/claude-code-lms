"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  GraduationCapIcon,
  UsersIcon,
} from "lucide-react"
import { QuizTimer } from "./quiz-timer"
import { QuizQuestion } from "./quiz-question"
import { QuizLeaderboard } from "./quiz-leaderboard"
import { QuizResult } from "./quiz-result"
import { useQuizQuestions } from "../hooks/use-quiz-questions"
import { useQuizAnswers } from "../hooks/use-quiz-answers"
import { useLeaderboard } from "../hooks/use-leaderboard"
import { useQuizTimer } from "../hooks/use-quiz-timer"
import { useClasses, grades } from "../hooks/use-classes"
import { useGroupsByClass } from "../hooks/use-groups"
import { QUIZ_DURATION_SECONDS, QUIZ_ID } from "../constants/quiz.constants"
import type { GradeLevel } from "../hooks/use-classes"
import type { QuizStatus } from "../types/quiz.types"

interface QuizPageProps {
  groupId?: string
  classId?: string
}

export function QuizPage({ groupId, classId }: QuizPageProps) {
  if (!groupId || !classId) {
    return (
      <QuizEntrySelector initialClassId={classId} initialGroupId={groupId} />
    )
  }

  return <QuizRunner groupId={groupId} classId={classId} />
}

function QuizEntrySelector({
  initialClassId,
  initialGroupId,
}: {
  initialClassId?: string
  initialGroupId?: string
}) {
  const router = useRouter()
  const { classes: allClasses } = useClasses()
  const initialClass = initialClassId
    ? allClasses.find((item) => item.id === initialClassId)
    : undefined
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | null>(
    initialClass?.grade ?? null
  )
  const [selectedClassId, setSelectedClassId] = useState(initialClassId ?? "")
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId ?? "")

  const { groups: allGroups, loading: groupsLoading } = useGroupsByClass(
    selectedClassId || null
  )

  const classesForGrade = useMemo(
    () =>
      selectedGrade
        ? allClasses.filter((item) => item.grade === selectedGrade)
        : [],
    [selectedGrade, allClasses]
  )

  const groupsForClass = allGroups

  const selectedClass = selectedClassId
    ? allClasses.find((item) => item.id === selectedClassId)
    : undefined
  const selectedGroup = selectedGroupId
    ? allGroups.find((group) => group.id === selectedGroupId)
    : undefined

  const handleGradeSelect = useCallback((grade: GradeLevel) => {
    setSelectedGrade(grade)
    setSelectedClassId("")
    setSelectedGroupId("")
  }, [])

  const handleClassSelect = useCallback((nextClassId: string) => {
    setSelectedClassId(nextClassId)
    setSelectedGroupId("")
  }, [])

  const handleStart = useCallback(() => {
    if (!selectedClassId || !selectedGroupId) {
      return
    }

    router.push(
      `/elementary-student/quiz?class=${selectedClassId}&group=${selectedGroupId}`
    )
  }, [router, selectedClassId, selectedGroupId])

  return (
    <div className="el-quiz-entry">
      <div className="el-quiz-entry-hero">
        <div>
          <div className="el-quiz-entry-eyebrow">
            <BookOpenIcon />
            Chuẩn bị làm bài theo nhóm
          </div>
          <h1>Chọn lớp và nhóm của em</h1>
          <p>
            Chọn đúng khối, lớp đã học, sau đó chọn nhóm để bắt đầu bài quiz.
          </p>
        </div>
        <div className="el-quiz-entry-steps">
          <span className={selectedGrade ? "done" : "active"}>1. Khối</span>
          <ChevronRightIcon />
          <span
            className={selectedClassId ? "done" : selectedGrade ? "active" : ""}
          >
            2. Lớp
          </span>
          <ChevronRightIcon />
          <span
            className={
              selectedGroupId ? "done" : selectedClassId ? "active" : ""
            }
          >
            3. Nhóm
          </span>
        </div>
      </div>

      <section className="el-quiz-pick-section">
        <div className="el-quiz-pick-head">
          <GraduationCapIcon />
          <div>
            <h2>Chọn khối</h2>
            <p>Khối 1 đến khối 5</p>
          </div>
        </div>
        <div className="el-quiz-grade-grid">
          {grades.map((grade) => (
            <button
              key={grade.level}
              type="button"
              className={selectedGrade === grade.level ? "active" : ""}
              onClick={() => handleGradeSelect(grade.level)}
            >
              <span>Khối {grade.level}</span>
              <small>{grade.label}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="el-quiz-pick-section">
        <div className="el-quiz-pick-head">
          <BookOpenIcon />
          <div>
            <h2>Chọn lớp đã học</h2>
            <p>
              {selectedGrade
                ? `Các lớp khối ${selectedGrade}`
                : "Chọn khối trước"}
            </p>
          </div>
        </div>
        <div className="el-quiz-class-grid">
          {classesForGrade.map((item) => (
            <button
              key={item.id}
              type="button"
              className={selectedClassId === item.id ? "active" : ""}
              onClick={() => handleClassSelect(item.id)}
            >
              <span>
                Lớp {item.grade}/{item.classNumber}
              </span>
              <small>{item.studentCount} học sinh</small>
            </button>
          ))}
        </div>
      </section>

      <section className="el-quiz-pick-section">
        <div className="el-quiz-pick-head">
          <UsersIcon />
          <div>
            <h2>Chọn nhóm</h2>
            <p>
              {selectedClass
                ? `20 nhóm của lớp ${selectedClass.grade}/${selectedClass.classNumber}`
                : "Chọn lớp trước"}
            </p>
          </div>
        </div>
        <div className="el-quiz-group-grid">
          {groupsForClass.map((group) => (
            <button
              key={group.id}
              type="button"
              className={selectedGroupId === group.id ? "active" : ""}
              onClick={() => setSelectedGroupId(group.id)}
            >
              <span>Nhóm {group.id.split("-").pop()}</span>
              <small>
                {group.members.map((member) => member.name).join(" · ")}
              </small>
              {selectedGroupId === group.id && <CheckCircle2Icon />}
            </button>
          ))}
        </div>
      </section>

      <div className="el-quiz-entry-footer">
        <div>
          <strong>
            {selectedGroup
              ? `Đã chọn nhóm ${selectedGroup.id.split("-").pop()}`
              : "Chưa chọn đủ thông tin"}
          </strong>
          <span>
            {selectedClass
              ? `Lớp ${selectedClass.grade}/${selectedClass.classNumber}`
              : "Hãy chọn khối, lớp và nhóm"}
          </span>
        </div>
        <button
          type="button"
          className="el-sgrp-start-quiz"
          disabled={!selectedClassId || !selectedGroupId}
          onClick={handleStart}
        >
          Làm bài
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  )
}

function QuizRunner({ groupId, classId }: Required<QuizPageProps>) {
  const router = useRouter()
  const [status, setStatus] = useState<QuizStatus>("active")
  const [currentIdx, setCurrentIdx] = useState(0)
  const timerStartedRef = useRef(false)

  const {
    questions,
    loading: questionsLoading,
    error,
  } = useQuizQuestions(QUIZ_ID)

  const { allAnswers, groupAnswers, submitAnswer } = useQuizAnswers(
    QUIZ_ID,
    groupId
  )

  const { leaderboard, currentRank } = useLeaderboard(allAnswers, groupId)

  const answeredMap = useMemo(() => {
    const map = new Map<
      string,
      { selectedOption: number; isCorrect: boolean }
    >()
    const sorted = [...groupAnswers]
      .filter(
        (a) => a.answeredAt && typeof a.answeredAt.toMillis === "function"
      )
      .sort((a, b) => a.answeredAt.toMillis() - b.answeredAt.toMillis())
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

  useEffect(() => {
    if (
      questions.length > 0 &&
      status === "active" &&
      !timerStartedRef.current
    ) {
      timerStartedRef.current = true
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

  const handleChangeGroup = useCallback(() => {
    stop()
    router.push("/elementary-student/quiz")
  }, [router, stop])

  if (questionsLoading) {
    return (
      <div className="el-quiz-page">
        <div className="el-loading">
          <div className="el-spinner" />
          <span>Đang tải câu hỏi...</span>
        </div>
      </div>
    )
  }

  if (error || !currentQuestion) {
    return (
      <div className="el-quiz-page">
        <div className="el-loading">
          <span>{error ?? "Chưa có câu hỏi trong Firestore."}</span>
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
          groupId={groupId}
          groupName={currentGroup?.groupName ?? "Nhóm của bạn"}
          leaderboard={leaderboard}
          onBackToGroups={handleBackToGroups}
          onChangeGroup={handleChangeGroup}
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
          <div className="el-quiz-session-meta">
            <span>Nhóm {groupId.split("-").pop()}</span>
            <button type="button" onClick={handleChangeGroup}>
              Chọn lại lớp / nhóm
            </button>
          </div>
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

      <QuizLeaderboard leaderboard={leaderboard} currentGroupId={groupId} />
    </div>
  )
}
