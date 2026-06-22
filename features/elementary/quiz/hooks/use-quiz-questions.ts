"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
import type { QuizQuestion } from "../types/quiz.types"

interface UseQuizQuestionsReturn {
  questions: QuizQuestion[]
  loading: boolean
  error: string | null
}

/**
 * Fetch questions for a quiz via the `quizQuestions` bridge collection.
 * Bridge docs: { quizId, questionId, order }
 * Question docs: { id, content, type, options }
 */
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

        // 1. Fetch bridge docs for this quiz
        const bridgeQuery = query(
          collection(db, "quizQuestions"),
          where("quizId", "==", quizId)
        )
        const bridgeSnapshot = await getDocs(bridgeQuery)

        if (cancelled) return

        // 2. Collect questionIds, sorted by order
        const bridgeDocs = bridgeSnapshot.docs
          .map((d) => ({
            questionId: d.data().questionId as string,
            order: d.data().order as number,
          }))
          .sort((a, b) => a.order - b.order)

        if (bridgeDocs.length === 0) {
          setQuestions([])
          setLoading(false)
          return
        }

        // 3. Fetch question details (Firestore `in` query max 30 items)
        const questionIds = bridgeDocs.map((b) => b.questionId)
        const allQuestions = new Map<string, { content: string; type: string; options: { content: string; isCorrect: boolean }[]; imageUrl?: string }>()

        for (let i = 0; i < questionIds.length; i += 30) {
          const batch = questionIds.slice(i, i + 30)
          const q = query(
            collection(db, "questions"),
            where("__name__", "in", batch)
          )
          const snapshot = await getDocs(q)
          if (cancelled) return

          for (const doc of snapshot.docs) {
            allQuestions.set(doc.id, doc.data() as { content: string; type: string; options: { content: string; isCorrect: boolean }[]; imageUrl?: string })
          }
        }

        // 4. Merge bridge order with question data
        const fetched: QuizQuestion[] = bridgeDocs
          .filter((b) => allQuestions.has(b.questionId))
          .map((b) => {
            const data = allQuestions.get(b.questionId)!
            return {
              id: b.questionId,
              content: data.content,
              type: data.type as "quiz" | "fill_in_blank" | "image_choice",
              options: data.options,
              imageUrl: data.imageUrl,
            }
          })

        setQuestions(fetched)
      } catch (err) {
        if (cancelled) return
        console.error("Failed to load questions:", err)
        setError(err instanceof Error ? err.message : "Không thể tải câu hỏi")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchQuestions()
    return () => { cancelled = true }
  }, [quizId])

  return { questions, loading, error }
}
