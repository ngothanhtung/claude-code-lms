import type { ReactNode } from "react"
import { ElementaryTeacherShell } from "@/components/elementary-teacher-shell"

export default function ElementaryTeacherLayout({
  children,
}: {
  children: ReactNode
}) {
  return <ElementaryTeacherShell>{children}</ElementaryTeacherShell>
}
