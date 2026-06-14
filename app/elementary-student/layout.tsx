import type { ReactNode } from "react"
import "@/app/elementary.css"
import { ElementaryStudentShell } from "@/components/elementary-student-shell"

export default function ElementaryStudentLayout({
  children,
}: {
  children: ReactNode
}) {
  return <ElementaryStudentShell>{children}</ElementaryStudentShell>
}
