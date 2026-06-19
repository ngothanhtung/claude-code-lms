import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import "@/app/elementary.css"
import { ElementaryStudentShell } from "@/components/elementary-student-shell"

export default async function ElementaryStudentLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const roles = (session.user as Record<string, unknown>).roles as
    | string[]
    | undefined
  if (!roles?.includes("role_student")) {
    redirect("/login")
  }

  return <ElementaryStudentShell>{children}</ElementaryStudentShell>
}
