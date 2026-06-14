"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpenIcon,
  ChevronLeftIcon,
  GraduationCapIcon,
  HomeIcon,
  PenSquareIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./elementary-student-shell.module.css"

const navItems = [
  { href: "/elementary-student", label: "Trang chủ", icon: HomeIcon },
  { href: "/elementary-student/classes", label: "Lớp của mình", icon: UsersIcon },
  { href: "/elementary-student/groups", label: "Nhóm của mình", icon: UsersIcon },
  { href: "/elementary-student/quiz", label: "Bài quiz", icon: PenSquareIcon },
  { href: "/elementary-student/results", label: "Kết quả", icon: StarIcon },
]

export function ElementaryStudentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <GraduationCapIcon className="h-6 w-6" />
          </div>
          <div>
            <div className={styles.brandName}>LMS Tiểu học</div>
            <div className={styles.brandSub}>Học sinh</div>
          </div>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
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
                className={cn(styles.navItem, isActive && styles.navItemActive)}
              >
                <Icon className={styles.navIcon} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          <Link href="/" className={styles.footerLink}>
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.main}>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
