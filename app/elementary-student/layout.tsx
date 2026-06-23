import type { ReactNode } from "react"
import "@/app/elementary.css"
import { StudentSessionProviderClient } from "@/features/elementary/profile/components/student-session-provider-client"

/**
 * Server root layout for /elementary-student/* — loads elementary.css
 * and mounts the StudentSession context.
 */
export default function ElementaryStudentLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <StudentSessionProviderClient>
      <div className="elementary-app">{children}</div>
    </StudentSessionProviderClient>
  )
}
