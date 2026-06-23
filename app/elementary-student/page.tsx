"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStudentSession } from "@/features/elementary/profile/hooks/use-student-session"

export default function ElementaryStudentRootPage() {
  const router = useRouter()
  const { session, hydrated } = useStudentSession()

  useEffect(() => {
    if (!hydrated) return
    router.replace(
      session
        ? "/elementary-student/dashboard"
        : "/elementary-student/selector",
    )
  }, [hydrated, session, router])

  return (
    <div className="el-loading">
      <div className="el-spinner" />
    </div>
  )
}
