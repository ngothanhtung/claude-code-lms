"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStudentSession } from "@/features/elementary/profile/hooks/use-student-session"
import { ElementaryStudentShell } from "@/components/elementary-student-shell"

/**
 * Guards every /elementary-student/* route (except /selector)
 * by checking the student session. If missing, redirects to selector.
 * Renders the sidebar shell + main content.
 *
 * Note: outer `.elementary-app > .el-app` wrapper lives in the root layout.
 */
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { session, hydrated } = useStudentSession()

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/elementary-student/selector")
    }
  }, [hydrated, session, router])

  if (!hydrated || !session) {
    return (
      <div className="el-loading">
        <div className="el-spinner" />
      </div>
    )
  }

  return (
    <div className="el-app">
      <ElementaryStudentShell />
      <div className="el-main">
        <main className="el-content">{children}</main>
      </div>
    </div>
  )
}
