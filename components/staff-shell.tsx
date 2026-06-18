"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpenCheckIcon,
  ChevronLeftIcon,
  GraduationCapIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/staff/classes", label: "Quản lý lớp học", icon: BookOpenCheckIcon },
  { href: "/staff/instructors", label: "Giảng viên", icon: UsersIcon },
]

export function StaffShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="staff-app">
      <div className="st-app">
        <aside className="st-sidebar">
          <div className="st-brand">
            <div className="st-brand-mark">
              <GraduationCapIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="st-brand-name">LMS Portal</div>
              <div className="st-brand-sub">Dành cho Nhân viên</div>
            </div>
          </div>

          <nav className="st-nav">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("st-nav-item", isActive && "active")}
                >
                  <Icon className="st-nav-icon" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="st-footer">
            <Link href="/" className="st-footer-link">
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Về trang chủ</span>
            </Link>
            <button type="button" className="st-footer-btn">
              <SettingsIcon className="h-4 w-4" />
              <span>Cài đặt</span>
            </button>
            <button type="button" className="st-footer-btn">
              <LogOutIcon className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        <div className="st-main">
          <main className="st-content">{children}</main>
        </div>
      </div>
    </div>
  )
}
