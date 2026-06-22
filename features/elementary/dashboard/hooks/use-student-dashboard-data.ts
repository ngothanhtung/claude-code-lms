"use client"

import { useMemo } from "react"
import { useStudentProfile } from "@/features/elementary/profile/hooks/use-student-profile"
import { useClasses } from "@/features/elementary/quiz/hooks/use-classes"
import { useLessons } from "@/features/elementary/lessons/hooks/use-lessons"
import { useClassLessons } from "@/features/elementary/lessons/hooks/use-class-lessons"
import { useGroupsByClass } from "@/features/elementary/quiz/hooks/use-groups"
import { useGroupLessons } from "@/features/elementary/groups/hooks/use-group-lessons"

interface DashboardData {
  userName: string
  className: string
  grade: number
  classNumber: number
  completedLessons: number
  totalLessons: number
  averageScore: string
  groupName: string
  groupCompletedQuizzes: number
  groupTotalQuizzes: number
  lessons: {
    lessonNumber: number
    title: string
    score: number
    completed: boolean
  }[]
  recentQuizzes: {
    title: string
    score: number
    maxScore: number
    date: string
  }[]
  myGroup: {
    name: string
    members: { name: string; avatar: string }[]
    completedLessons: number
    totalLessons: number
    averageScore: number
  } | null
  leaderboard: {
    rank: number
    name: string
    score: number
    avatar: string
    isMe: boolean
  }[]
}

export function useStudentDashboardData() {
  const { profile, loading: pLoading, error: pError } = useStudentProfile()
  const { classes, loading: cLoading } = useClasses()
  const { lessons, loading: lLoading } = useLessons()
  const { classLessons, loading: clLoading } = useClassLessons(profile?.classId ?? null)
  const { groups, loading: gLoading } = useGroupsByClass(profile?.classId ?? null)
  const { groupLessons, loading: glLoading } = useGroupLessons(profile?.classId ?? null)

  const loading = pLoading || cLoading || lLoading || clLoading || gLoading || glLoading
  const error = pError

  const data = useMemo<DashboardData | null>(() => {
    if (loading || !profile || !profile.classId) return null

    const cls = classes.find((c) => c.id === profile.classId)
    if (!cls) return null

    const className = `Lớp ${cls.grade}/${cls.classNumber}`

    // Lesson progress
    const lessonsSorted = lessons.slice().sort((a, b) => a.lessonNumber - b.lessonNumber)
    const lessonEntries = lessonsSorted.map((lesson) => {
      const cl = classLessons.find((c) => c.lessonId === lesson.id)
      const completed = cl?.status === "completed" || cl?.status === "current"

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

      return { lessonNumber: lesson.lessonNumber, title: lesson.title, completed, score }
    })

    const completedLessons = classLessons.filter((cl) => cl.status === "completed").length

    // Recent quizzes (most recent completed lessons, max 5)
    const completedSorted = [...lessonEntries]
      .filter((l) => l.completed)
      .sort((a, b) => b.lessonNumber - a.lessonNumber)
      .slice(0, 5)
    const recentQuizzes = completedSorted.map((l) => ({
      title: `Quiz — Lesson ${l.lessonNumber}: ${l.title}`,
      score: Math.round(l.score),
      maxScore: 10,
      date: "Gần đây",
    }))

    // My group
    const myGroupData = profile.groupId
      ? groups.find((g) => g.id === profile.groupId)
      : null
    const myGroupLessons = myGroupData
      ? groupLessons.filter((gl) => gl.groupId === myGroupData.id)
      : []
    const groupCompletedLessons = myGroupLessons.filter(
      (gl) => gl.status === "completed"
    ).length
    const myGroupScore = myGroupLessons.filter((gl) => gl.status === "completed")
    const myGroupAvg =
      myGroupScore.length > 0
        ? Number(
            (
              myGroupScore.reduce((sum, gl) => sum + gl.score, 0) /
              myGroupScore.length
            ).toFixed(1)
          )
        : 0

    const myGroup = myGroupData
      ? {
          name: `Nhóm ${profile.groupIndex ?? "?"}`,
          members: myGroupData.members.map((m) => ({
            name: m.name,
            avatar: m.studentId.slice(-2),
          })),
          completedLessons: groupCompletedLessons,
          totalLessons: lessons.length,
          averageScore: myGroupAvg,
        }
      : null

    // Leaderboard (from all classmates via groups)
    const memberScores = new Map<string, { name: string; avatar: string; totalScore: number; count: number }>()
    for (const group of groups) {
      const gLessons = groupLessons.filter(
        (gl) => gl.groupId === group.id && gl.status === "completed"
      )
      for (const member of group.members) {
        if (!memberScores.has(member.name)) {
          memberScores.set(member.name, {
            name: member.name,
            avatar: member.studentId.slice(-2),
            totalScore: 0,
            count: 0,
          })
        }
        const entry = memberScores.get(member.name)!
        for (const gl of gLessons) {
          entry.totalScore += gl.score
          entry.count++
        }
      }
    }

    const leaderboard = [...memberScores.values()]
      .map((m) => ({
        rank: 0,
        name: m.name,
        score: m.count > 0 ? Number((m.totalScore / m.count).toFixed(1)) : 0,
        avatar: m.avatar,
        isMe: m.name === profile.name,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry, i) => ({ ...entry, rank: i + 1 }))

    return {
      userName: profile.name,
      className,
      grade: cls.grade,
      classNumber: cls.classNumber,
      completedLessons,
      totalLessons: lessons.length,
      averageScore: cls.averageScore,
      groupName: myGroup?.name ?? "",
      groupCompletedQuizzes: myGroupData?.completedQuizzes ?? 0,
      groupTotalQuizzes: myGroupData?.totalQuizzes ?? 0,
      lessons: lessonEntries,
      recentQuizzes,
      myGroup,
      leaderboard,
    }
  }, [
    loading,
    profile,
    classes,
    lessons,
    classLessons,
    groups,
    groupLessons,
  ])

  return { data, loading, error }
}
