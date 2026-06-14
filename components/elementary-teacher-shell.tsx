"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpenIcon,
  ChevronLeftIcon,
  GraduationCapIcon,
  LogOutIcon,
  PenSquareIcon,
  SettingsIcon,
  UsersIcon,
  UserPlusIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/elementary-teacher", label: "Tổng quan", icon: GraduationCapIcon },
  { href: "/elementary-teacher/classes", label: "Lớp học", icon: UsersIcon },
  { href: "/elementary-teacher/groups", label: "Nhóm học", icon: UserPlusIcon },
  { href: "/elementary-teacher/quizzes", label: "Bài quiz", icon: PenSquareIcon },
  { href: "/elementary-teacher/documents", label: "Tài liệu", icon: BookOpenIcon },
]

export function ElementaryTeacherShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="elementary-app">
      <div className="el-app">
        <aside className="el-sidebar">
          <div className="el-brand">
            <div className="el-brand-mark">
              <BookOpenIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="el-brand-name">LMS Tiểu học</div>
              <div className="el-brand-sub">Giáo viên</div>
            </div>
          </div>

          <nav className="el-nav">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === "/elementary-teacher"
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
            <button type="button" className="el-footer-btn">
              <SettingsIcon className="h-4 w-4" />
              <span>Cài đặt</span>
            </button>
            <button type="button" className="el-footer-btn">
              <LogOutIcon className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        <div className="el-main">
          <main className="el-content">{children}</main>
        </div>
      </div>
    </div>
  )
}
