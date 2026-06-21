"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"

export type GradeLevel = 1 | 2 | 3 | 4 | 5

export interface ElementaryClass {
  id: string
  grade: GradeLevel
  classNumber: number
  homeroomTeacher: string
  studentCount: number
  totalQuizzes: number
  completedQuizzes: number
  averageScore: string
  lastActive: string
  status: "active" | "archived"
}

export const grades: { level: GradeLevel; label: string }[] = [
  { level: 1, label: "Lớp 1" },
  { level: 2, label: "Lớp 2" },
  { level: 3, label: "Lớp 3" },
  { level: 4, label: "Lớp 4" },
  { level: 5, label: "Lớp 5" },
]

interface UseClassesReturn {
  classes: ElementaryClass[]
  loading: boolean
  error: string | null
}

export function useClasses(): UseClassesReturn {
  const [classes, setClasses] = useState<ElementaryClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchClasses() {
      try {
        setLoading(true)
        setError(null)

        const snapshot = await getDocs(collection(db, "classes"))

        if (cancelled) return

        const fetched: ElementaryClass[] = snapshot.docs.map((d) => ({
          id: d.id,
          grade: d.data().grade,
          classNumber: d.data().classNumber,
          homeroomTeacher: d.data().homeroomTeacher,
          studentCount: d.data().studentCount,
          totalQuizzes: d.data().totalQuizzes,
          completedQuizzes: d.data().completedQuizzes,
          averageScore: d.data().averageScore,
          lastActive: d.data().lastActive,
          status: d.data().status,
        }))
        setClasses(fetched)
      } catch (err) {
        if (cancelled) return
        console.error("Failed to load classes:", err)
        setError(err instanceof Error ? err.message : "Không thể tải danh sách lớp")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchClasses()
    return () => {
      cancelled = true
    }
  }, [])

  return { classes, loading, error }
}
