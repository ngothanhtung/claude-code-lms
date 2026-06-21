"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
import type { LessonStatus } from "./use-lessons"

export interface ClassLesson {
  id: string
  classId: string
  lessonId: string
  status: LessonStatus
}

interface UseClassLessonsReturn {
  classLessons: ClassLesson[]
  loading: boolean
  error: string | null
}

export function useClassLessons(classId: string | null): UseClassLessonsReturn {
  const [classLessons, setClassLessons] = useState<ClassLesson[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!classId) {
      setClassLessons([])
      return
    }

    let cancelled = false

    async function fetchClassLessons() {
      try {
        setLoading(true)
        setError(null)

        const q = query(collection(db, "classLessons"), where("classId", "==", classId))
        const snapshot = await getDocs(q)

        if (cancelled) return

        const fetched: ClassLesson[] = snapshot.docs.map((d) => ({
          id: d.id,
          classId: d.data().classId,
          lessonId: d.data().lessonId,
          status: d.data().status,
        }))
        setClassLessons(fetched)
      } catch (err) {
        if (cancelled) return
        console.error("Failed to load classLessons:", err)
        setError(err instanceof Error ? err.message : "Không thể tải tiến độ bài học")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchClassLessons()
    return () => {
      cancelled = true
    }
  }, [classId])

  return { classLessons, loading, error }
}
