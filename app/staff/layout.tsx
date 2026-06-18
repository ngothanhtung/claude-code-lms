import type { ReactNode } from "react"
import "@/app/staff/staff.css"
import { StaffShell } from "@/components/staff-shell"

export default function StaffLayout({
  children,
}: {
  children: ReactNode
}) {
  return <StaffShell>{children}</StaffShell>
}
