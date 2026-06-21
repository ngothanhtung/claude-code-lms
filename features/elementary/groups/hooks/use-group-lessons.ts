"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"

export interface GroupLesson {
  id: string
  groupId: string
  lessonId: string
  classId: string
  score: number
  completionPct: number
  status: "completed" | "pending"
}

interface UseGroupLessonsReturn {
  groupLessons: GroupLesson[]
  loading: boolean
  error: string | null
}

export function useGroupLessons(
  classId: string | null,
  lessonId?: string | null
): UseGroupLessonsReturn {
  const [groupLessons, setGroupLessons] = useState<GroupLesson[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!classId) {
      setGroupLessons([])
      return
    }

    let cancelled = false

    async function fetchGroupLessons() {
      try {
        setLoading(true)
        setError(null)

        const constraints = [where("classId", "==", classId)]
        if (lessonId) {
          constraints.push(where("lessonId", "==", lessonId))
        }
        const q = query(collection(db, "groupLessons"), ...constraints)
        const snapshot = await getDocs(q)

        if (cancelled) return

        const fetched: GroupLesson[] = snapshot.docs.map((d) => ({
          id: d.id,
          groupId: d.data().groupId,
          lessonId: d.data().lessonId,
          classId: d.data().classId,
          score: d.data().score,
          completionPct: d.data().completionPct,
          status: d.data().status,
        }))
        setGroupLessons(fetched)
      } catch (err) {
        if (cancelled) return
        console.error("Failed to load groupLessons:", err)
        setError(err instanceof Error ? err.message : "Không thể tải điểm bài học")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchGroupLessons()
    return () => {
      cancelled = true
    }
  }, [classId, lessonId])

  return { groupLessons, loading, error }
}
