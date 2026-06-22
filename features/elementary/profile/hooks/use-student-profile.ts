"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"

export interface StudentProfile {
  userId: string
  name: string
  classId: string
  groupId: string | null
  groupIndex: number | null
}

interface UseStudentProfileReturn {
  profile: StudentProfile | null
  loading: boolean
  error: string | null
}

export function useStudentProfile(): UseStudentProfileReturn {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      if (status === "unauthenticated") {
        setLoading(false)
      }
      return
    }

    let cancelled = false

    async function fetchProfile() {
      try {
        setLoading(true)
        setError(null)

        const userId = session!.user.id!

        // 1. Read the user document to get classId
        const userQuery = query(
          collection(db, "users"),
          where("__name__", "==", userId)
        )
        const userSnapshot = await getDocs(userQuery)

        if (cancelled) return

        if (userSnapshot.empty) {
          setProfile(null)
          setLoading(false)
          return
        }

        const userData = userSnapshot.docs[0].data()
        const classId = userData.classId as string | undefined

        if (!classId) {
          setProfile({
            userId,
            name: session!.user.name ?? "",
            classId: "",
            groupId: null,
            groupIndex: null,
          })
          setLoading(false)
          return
        }

        // 2. Find the group that contains this student
        const groupsQuery = query(
          collection(db, "groups"),
          where("classId", "==", classId)
        )
        const groupsSnapshot = await getDocs(groupsQuery)

        if (cancelled) return

        let foundGroupId: string | null = null
        let foundGroupIndex: number | null = null
        const userName = (session!.user.name ?? "").trim()

        groupsSnapshot.docs.forEach((groupDoc) => {
          const members = groupDoc.data().members as { name: string; studentId: string }[] ?? []
          // Match by name (userId in `users` collection is e.g. "user_3" but
          // `members[].studentId` is "HS3101" — they don't share a key).
          // Name is the reliable shared identifier.
          const isMember = members.some(
            (m) => m.name.trim() === userName
          )
          if (isMember) {
            foundGroupId = groupDoc.id
            const parts = groupDoc.id.split("_")
            foundGroupIndex = parseInt(parts[parts.length - 1], 10) || null
          }
        })

        setProfile({
          userId,
          name: session!.user.name ?? "",
          classId,
          groupId: foundGroupId,
          groupIndex: foundGroupIndex,
        })
      } catch (err) {
        if (cancelled) return
        console.error("Failed to load student profile:", err)
        setError(err instanceof Error ? err.message : "Không thể tải thông tin học sinh")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProfile()
    return () => { cancelled = true }
  }, [session, status])

  return { profile, loading, error }
}
