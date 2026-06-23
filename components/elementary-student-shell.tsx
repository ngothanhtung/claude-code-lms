"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  GraduationCapIcon,
  ChevronLeftIcon,
  HomeIcon,
  UsersIcon,
  PenSquareIcon,
  StarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/elementary-student", label: "Trang chủ", icon: HomeIcon },
  { href: "/elementary-student/classes", label: "Lớp của mình", icon: UsersIcon },
  { href: "/elementary-student/groups", label: "Nhóm của mình", icon: UsersIcon },
  { href: "/elementary-student/quiz", label: "Bài quiz", icon: PenSquareIcon },
  { href: "/elementary-student/results", label: "Kết quả", icon: StarIcon },
]

const fullRoutes = ["/elementary-student/quiz"]

export function ElementaryStudentShell() {
  const pathname = usePathname()
  const isFullWidth = fullRoutes.some((r) => pathname === r || pathname.startsWith(r + "?"))

  return (
    <aside className="el-sidebar">
      <div className="el-brand">
        <div className="el-brand-mark">
          <GraduationCapIcon className="h-6 w-6" />
        </div>
        <div>
          <div className="el-brand-name">LMS Tiểu học</div>
          <div className="el-brand-sub">Học sinh</div>
        </div>
      </div>

      <nav className="el-nav">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/elementary-student"
              ? pathname === item.href
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("el-nav-item", isActive && "active")}
            >
              <Icon className="el-nav-icon" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="el-footer">
        <Link href="/" className="el-footer-link">
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </aside>
  )
}
