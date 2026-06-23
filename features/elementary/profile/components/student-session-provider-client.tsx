"use client"

import { StudentSessionProvider } from "../hooks/use-student-session"

/**
 * Thin client wrapper to allow server components (like the root
 * elementary-student layout) to mount the StudentSessionProvider.
 */
export function StudentSessionProviderClient({
  children,
}: {
  children: React.ReactNode
}) {
  return <StudentSessionProvider>{children}</StudentSessionProvider>
}
