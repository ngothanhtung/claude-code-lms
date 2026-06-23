"use client"

import { useSearchParams } from "next/navigation"
import { QuizPage } from "@/features/elementary/quiz/components/quiz-page"

export default function QuizRoute() {
  const searchParams = useSearchParams()
  const groupId = searchParams.get("group") ?? undefined
  const classId = searchParams.get("class") ?? undefined
  const quizId = searchParams.get("quiz") ?? undefined

  return <QuizPage groupId={groupId} classId={classId} quizId={quizId} />
}
