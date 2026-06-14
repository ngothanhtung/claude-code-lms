"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
import type { QuizQuestion } from "../types/quiz.types"
import { mockQuestions } from "../mock/quiz.mock"

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
          setQuestions(mockQuestions)
        } else {
          const fetched: QuizQuestion[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            content: doc.data().content,
            type: doc.data().type,
            options: doc.data().options,
          }))
          setQuestions(fetched)
        }
      } catch (err) {
        if (cancelled) return
        console.warn("Firestore unavailable, using mock data:", err)
        setQuestions(mockQuestions)
        setError(null)
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
