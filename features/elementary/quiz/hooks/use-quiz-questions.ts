"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
import type { QuizQuestion } from "../types/quiz.types"
import { seedQuestions } from "../services/mock.service"

interface UseQuizQuestionsReturn {
  questions: QuizQuestion[]
  loading: boolean
  error: string | null
}

export function useQuizQuestions(quizId: string): UseQuizQuestionsReturn {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchQuestions() {
      try {
        setLoading(true)
        setError(null)

        const snapshot = await getDocs(collection(db, "questions"))

        if (cancelled) return

        if (snapshot.empty) {
          // No questions yet — seed mock data into Firestore, then re-fetch
          await seedQuestions()
          const seeded = await getDocs(collection(db, "questions"))
          if (cancelled) return

          const fetched: QuizQuestion[] = seeded.docs.map((d) => ({
            id: d.id,
            content: d.data().content,
            type: d.data().type,
            options: d.data().options,
          }))
          setQuestions(fetched)
        } else {
          const fetched: QuizQuestion[] = snapshot.docs.map((d) => ({
            id: d.id,
            content: d.data().content,
            type: d.data().type,
            options: d.data().options,
          }))
          setQuestions(fetched)
        }
      } catch (err) {
        if (cancelled) return
        console.error("Failed to load questions:", err)
        setError(err instanceof Error ? err.message : "Không thể tải câu hỏi")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchQuestions()
    return () => {
      cancelled = true
    }
  }, [quizId])

  return { questions, loading, error }
}
