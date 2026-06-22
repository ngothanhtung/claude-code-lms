"use client"

import { useMemo } from "react"
import { useClasses } from "@/features/elementary/quiz/hooks/use-classes"
import { useLessons } from "@/features/elementary/lessons/hooks/use-lessons"
import { useClassLessons } from "@/features/elementary/lessons/hooks/use-class-lessons"
import { useGroupsByClass } from "@/features/elementary/quiz/hooks/use-groups"
import { useGroupLessons } from "@/features/elementary/groups/hooks/use-group-lessons"
import type { StudentClass } from "@/features/elementary/classes/types/student-class.types"

interface UseStudentClassReturn {
  studentClass: StudentClass | null
  loading: boolean
  error: string | null
}

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

export function useStudentClass(
  classId: string | null
): UseStudentClassReturn {
  const { classes, loading: cLoading, error: cError } = useClasses()
  const { lessons, loading: lLoading, error: lError } = useLessons()
  const {
    classLessons,
    loading: clLoading,
    error: clError,
  } = useClassLessons(classId)
  const { groups, loading: gLoading, error: gError } = useGroupsByClass(classId)
  const {
    groupLessons,
    loading: glLoading,
    error: glError,
  } = useGroupLessons(classId)

  const loading = cLoading || lLoading || clLoading || gLoading || glLoading
  const error = cError ?? lError ?? clError ?? gError ?? glError

  const studentClass = useMemo<StudentClass | null>(() => {
    if (loading) return null
    if (!classId) return null

    const cls = classes.find((c) => c.id === classId)
    if (!cls) return null

    const className = `Lớp ${cls.grade}/${cls.classNumber}`

    // 1. Build lesson entries
    const lessonEntries = lessons
      .slice()
      .sort((a, b) => a.lessonNumber - b.lessonNumber)
      .map((lesson) => {
        const cl = classLessons.find((c) => c.lessonId === lesson.id)
        const completed = cl?.status === "completed" || cl?.status === "current"

        // Average score across all groups for this lesson
        const glForLesson = groupLessons.filter(
          (gl) => gl.lessonId === lesson.id && gl.status === "completed"
        )
        const score =
          glForLesson.length > 0
            ? Number(
                (
                  glForLesson.reduce((sum, gl) => sum + gl.score, 0) /
                  glForLesson.length
                ).toFixed(1)
              )
            : 0

        return {
          lessonNumber: lesson.lessonNumber,
          title: lesson.title,
          completed,
          score,
        }
      })

    const completedLessons = classLessons.filter(
      (cl) => cl.status === "completed"
    ).length

    // 2. Build classmates — deduplicate by name across all groups
    //    and compute average score per member from groupLessons
    const seen = new Set<string>()
    const classmates: { name: string; avatar: string; averageScore: number }[] = []

    for (const group of groups) {
      // Get groupLessons for this group that are completed
      const groupGl = groupLessons.filter(
        (gl) => gl.groupId === group.id && gl.status === "completed"
      )

      for (const member of group.members) {
        if (!seen.has(member.name)) {
          seen.add(member.name)

          // Average score of this member's group lessons
          const scores = groupGl.map((gl) => gl.score)
          const avgScore = scores.length > 0
            ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
            : 0

          classmates.push({
            name: member.name,
            avatar: member.studentId.slice(-2),
            averageScore: avgScore,
          })
        }
      }
    }

    // 3. Build recentQuizzes from completed lessons (most recent first, max 5)
    const completedSorted = [...lessonEntries]
      .filter((l) => l.completed)
      .sort((a, b) => b.lessonNumber - a.lessonNumber)
      .slice(0, 5)
    const recentQuizzes = completedSorted.map((l) => ({
      title: `Quiz — Lesson ${l.lessonNumber}: ${l.title}`,
      score: Math.round(l.score),
      maxScore: 10,
      date: "Hôm qua",
    }))

    return {
      id: cls.id,
      grade: cls.grade,
      classNumber: cls.classNumber,
      className,
      homeroomTeacher: cls.homeroomTeacher,
      studentCount: cls.studentCount,
      totalLessons: lessons.length,
      completedLessons,
      averageScore: cls.averageScore,
      lessons: lessonEntries,
      recentQuizzes,
      classmates,
    }
  }, [
    loading,
    classId,
    classes,
    lessons,
    classLessons,
    groups,
    groupLessons,
  ])

  return { studentClass, loading, error }
}
