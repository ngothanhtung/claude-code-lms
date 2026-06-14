"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpenIcon,
  ChevronLeftIcon,
  FileTextIcon,
  GraduationCapIcon,
  LogOutIcon,
  PenSquareIcon,
  SettingsIcon,
  UsersIcon,
  UserPlusIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./elementary-teacher-shell.module.css"

const navItems = [
  { href: "/elementary-teacher", label: "Tổng quan", icon: GraduationCapIcon },
  { href: "/elementary-teacher/classes", label: "Lớp học", icon: UsersIcon },
  { href: "/elementary-teacher/groups", label: "Nhóm học", icon: UserPlusIcon },
  { href: "/elementary-teacher/quizzes", label: "Bài quiz", icon: PenSquareIcon },
  { href: "/elementary-teacher/documents", label: "Tài liệu", icon: FileTextIcon },
]

export function ElementaryTeacherShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <BookOpenIcon className="h-6 w-6" />
          </div>
          <div>
            <div className={styles.brandName}>LMS Tiểu học</div>
            <div className={styles.brandSub}>Giáo viên</div>
          </div>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
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
                className={cn(styles.navItem, isActive && styles.navItemActive)}
              >
                <Icon className={styles.navIcon} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer actions */}
        <div className={styles.footer}>
          <Link href="/" className={styles.footerLink}>
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Về trang chủ</span>
          </Link>
          <button type="button" className={styles.footerBtn}>
            <SettingsIcon className="h-4 w-4" />
            <span>Cài đặt</span>
          </button>
          <button type="button" className={styles.footerBtn}>
            <LogOutIcon className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.main}>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
