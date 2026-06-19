import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import "@/app/elementary.css"
import { ElementaryTeacherShell } from "@/components/elementary-teacher-shell"

export default async function ElementaryTeacherLayout({
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
  if (!roles?.includes("role_elementary_teacher")) {
    redirect("/login")
  }

  return <ElementaryTeacherShell>{children}</ElementaryTeacherShell>
}
