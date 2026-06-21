"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"

export interface Quiz {
  id: string
  lessonId: string
  title: string
  description: string
  questionCount: number
  durationSeconds: number
}

interface UseQuizzesByLessonReturn {
  quizzes: Quiz[]
  loading: boolean
  error: string | null
}

export function useQuizzesByLesson(lessonId: string | null): UseQuizzesByLessonReturn {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lessonId) {
      setQuizzes([])
      return
    }

    let cancelled = false

    async function fetchQuizzes() {
      try {
        setLoading(true)
        setError(null)

        const q = query(collection(db, "quizzes"), where("lessonId", "==", lessonId))
        const snapshot = await getDocs(q)

        if (cancelled) return

        const fetched: Quiz[] = snapshot.docs.map((d) => ({
          id: d.id,
          lessonId: d.data().lessonId,
          title: d.data().title,
          description: d.data().description,
          questionCount: d.data().questionCount,
          durationSeconds: d.data().durationSeconds,
        }))
        setQuizzes(fetched)
      } catch (err) {
        if (cancelled) return
        console.error("Failed to load quizzes:", err)
        setError(err instanceof Error ? err.message : "Không thể tải danh sách quiz")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchQuizzes()
    return () => { cancelled = true }
  }, [lessonId])

  return { quizzes, loading, error }
}
