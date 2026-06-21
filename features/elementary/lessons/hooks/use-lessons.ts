"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"

export type LessonStatus = "completed" | "current" | "pending"

export interface Lesson {
  id: string
  title: string
  unit: number
  lessonNumber: number
  description: string
  totalWords: number
  quizCount: number
}

interface UseLessonsReturn {
  lessons: Lesson[]
  loading: boolean
  error: string | null
}

export function useLessons(): UseLessonsReturn {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchLessons() {
      try {
        setLoading(true)
        setError(null)

        const snapshot = await getDocs(collection(db, "lessons"))

        if (cancelled) return

        const fetched: Lesson[] = snapshot.docs.map((d) => ({
          id: d.id,
          title: d.data().title,
          unit: d.data().unit,
          lessonNumber: d.data().lessonNumber,
          description: d.data().description,
          totalWords: d.data().totalWords,
          quizCount: d.data().quizCount,
        }))
        setLessons(fetched)
      } catch (err) {
        if (cancelled) return
        console.error("Failed to load lessons:", err)
        setError(err instanceof Error ? err.message : "Không thể tải danh sách bài học")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLessons()
    return () => {
      cancelled = true
    }
  }, [])

  return { lessons, loading, error }
}
