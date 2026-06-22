"use client"

import { useCallback, useEffect, useState } from "react"
import { collection, doc, getDocs, query, where, writeBatch } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
import { useLessons } from "./use-lessons"
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
  /** Đặt bài có lessonNumber = selectedLessonNumber làm current */
  setCurrentLesson: (selectedLessonNumber: number) => Promise<void>
  /** Đang trong quá trình update */
  updating: boolean
}

export function useClassLessons(classId: string | null): UseClassLessonsReturn {
  const [classLessons, setClassLessons] = useState<ClassLesson[]>([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { lessons } = useLessons()

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

  const setCurrentLesson = useCallback(
    async (selectedLessonNumber: number) => {
      if (!classId) return
      setUpdating(true)
      try {
        // Map lessonId → lessonNumber
        const lessonMap = new Map<string, number>()
        for (const lesson of lessons) {
          lessonMap.set(lesson.id, lesson.lessonNumber)
        }

        const batch = writeBatch(db)

        for (const cl of classLessons) {
          const lessonNumber = lessonMap.get(cl.lessonId)
          if (lessonNumber === undefined) continue

          let newStatus: LessonStatus
          if (lessonNumber < selectedLessonNumber) {
            newStatus = "completed"
          } else if (lessonNumber === selectedLessonNumber) {
            newStatus = "current"
          } else {
            newStatus = "pending"
          }

          if (cl.status !== newStatus) {
            batch.update(doc(db, "classLessons", cl.id), { status: newStatus })
          }
        }

        await batch.commit()

        // Update local state
        setClassLessons((prev) =>
          prev.map((cl) => {
            const lessonNumber = lessonMap.get(cl.lessonId)
            if (lessonNumber === undefined) return cl

            let newStatus: LessonStatus
            if (lessonNumber < selectedLessonNumber) {
              newStatus = "completed"
            } else if (lessonNumber === selectedLessonNumber) {
              newStatus = "current"
            } else {
              newStatus = "pending"
            }

            return { ...cl, status: newStatus }
          })
        )
      } catch (err) {
        console.error("Failed to update current lesson:", err)
        setError(err instanceof Error ? err.message : "Không thể cập nhật bài học hiện tại")
      } finally {
        setUpdating(false)
      }
    },
    [classId, classLessons, lessons]
  )

  return { classLessons, loading, error, setCurrentLesson, updating }
}
