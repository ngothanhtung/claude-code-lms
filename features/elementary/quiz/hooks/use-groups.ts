"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
import type { GradeLevel } from "./use-classes"

export interface GroupMember {
  name: string
  studentId: string
}

export interface Group {
  id: string
  classId: string
  grade: GradeLevel
  classNumber: number
  className: string
  members: GroupMember[]
  status: "waiting" | "active"
  totalQuizzes: number
  completedQuizzes: number
  averageScore: string
  currentLesson: string
  lessonScore: number
  lessonCompletionPct: number
  overallPoints: number
}

interface UseGroupsByClassReturn {
  groups: Group[]
  loading: boolean
  error: string | null
}

export function useGroupsByClass(classId: string | null): UseGroupsByClassReturn {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!classId) {
      setGroups([])
      return
    }

    let cancelled = false

    async function fetchGroups() {
      try {
        setLoading(true)
        setError(null)

        const q = query(collection(db, "groups"), where("classId", "==", classId))
        const snapshot = await getDocs(q)

        if (cancelled) return

        const fetched: Group[] = snapshot.docs.map((d) => ({
          id: d.id,
          classId: d.data().classId,
          grade: d.data().grade,
          classNumber: d.data().classNumber,
          className: d.data().className,
          members: d.data().members ?? [],
          status: d.data().status,
          totalQuizzes: d.data().totalQuizzes,
          completedQuizzes: d.data().completedQuizzes,
          averageScore: d.data().averageScore,
          currentLesson: d.data().currentLesson,
          lessonScore: d.data().lessonScore,
          lessonCompletionPct: d.data().lessonCompletionPct,
          overallPoints: d.data().overallPoints,
        }))
        setGroups(fetched)
      } catch (err) {
        if (cancelled) return
        console.error("Failed to load groups:", err)
        setError(err instanceof Error ? err.message : "Không thể tải danh sách nhóm")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchGroups()
    return () => {
      cancelled = true
    }
  }, [classId])

  return { groups, loading, error }
}
