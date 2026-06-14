"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronLeftIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PenSquareIcon,
  SettingsIcon,
  UsersIcon,
  UserPlusIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/elementary-teacher", label: "Tổng quan", icon: LayoutDashboardIcon },
  { href: "/elementary-teacher/classes", label: "Lớp học", icon: UsersIcon },
  { href: "/elementary-teacher/groups", label: "Nhóm học", icon: UserPlusIcon },
  {
    href: "/elementary-teacher/quizzes",
    label: "Bài quiz",
    icon: PenSquareIcon,
  },
]

export function TeacherShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 h-14 border-b bg-background px-4 sm:px-6 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mr-3"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Về trang chủ
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href === "/elementary-teacher"
              ? pathname === item.href
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Cài đặt</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-3 px-4 sm:px-6 text-center text-xs text-muted-foreground">
        Giáo viên · Hệ thống LMS Tiểu học · Phiên bản 1.0
      </footer>
    </div>
  )
}
