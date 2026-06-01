"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import {
  BarChart3Icon,
  BellIcon,
  BookOpenCheckIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  CircleDollarSignIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  FolderOpenIcon,
  GraduationCapIcon,
  HomeIcon,
  LifeBuoyIcon,
  MessageCircleIcon,
  SettingsIcon,
  SparklesIcon,
  UserCheckIcon,
} from "lucide-react"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Trang chủ", icon: HomeIcon, href: "/dashboard" },
  { title: "Khóa học của tôi", icon: BookOpenCheckIcon, href: "/courses" },
  { title: "Lịch học", icon: CalendarDaysIcon, href: "/calendar" },
  {
    title: "Bài tập",
    icon: FileTextIcon,
    href: "/assignments",
    sub: [
      { title: "Bài tập cá nhân", href: "/assignments/personal" },
      { title: "Bài tập nhóm", href: "/assignments/group" },
      { title: "Đồ án cuối kỳ", href: "/final-project" },
    ],
  },
  { title: "Kết quả học tập", icon: BarChart3Icon, href: "/results" },
  { title: "Điểm danh", icon: UserCheckIcon, href: "/attendance" },
  { title: "Lịch thi", icon: CalendarClockIcon, href: "/exams" },
  {
    title: "Tài liệu",
    icon: FolderOpenIcon,
    href: "/documents",
    open: true,
    sub: [
      { title: "Tài liệu tham khảo", href: "/documents" },
      { title: "Tài liệu luyện thi", href: "/exam-materials" },
    ],
  },
  { title: "Thông báo", icon: BellIcon, href: "/notifications", badge: "6" },
  { title: "Học phí", icon: CircleDollarSignIcon, href: "/tuition" },
  { title: "Đăng ký môn học", icon: ClipboardCheckIcon, href: "/registration" },
  { title: "Hỗ trợ", icon: LifeBuoyIcon, href: "/support" },
  { title: "Cài đặt", icon: SettingsIcon, href: "/settings" },
]

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const initialOpenGroups = useMemo(() => {
    return navItems.reduce<Record<string, boolean>>((groups, item) => {
      if (item.sub) {
        const hasActiveChild = item.sub.some((sub) =>
          isRouteActive(pathname, sub.href)
        )

        groups[item.title] =
          Boolean(item.open) ||
          isRouteActive(pathname, item.href) ||
          hasActiveChild
      }

      return groups
    }, {})
  }, [pathname])
  const activeOpenGroups = useMemo(() => {
    return navItems.reduce<Record<string, boolean>>((groups, item) => {
      if (item.sub) {
        const hasActiveChild = item.sub.some((sub) =>
          isRouteActive(pathname, sub.href)
        )

        if (isRouteActive(pathname, item.href) || hasActiveChild) {
          groups[item.title] = true
        }
      }

      return groups
    }, {})
  }, [pathname])

  const [openGroups, setOpenGroups] =
    useState<Record<string, boolean>>(initialOpenGroups)

  function setGroupOpen(title: string, open: boolean) {
    setOpenGroups((current) => ({ ...current, [title]: open }))
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <GraduationCapIcon className="h-6 w-6" />
        </div>
        <div>
          <div className="brand-name">LMS Portal</div>
          <div className="brand-sub">Dành cho Sinh viên</div>
        </div>
      </div>

      <nav className="nav">
        {navItems.map((item) => {
          const Icon = item.icon
          const hasActiveChild = item.sub?.some((sub) =>
            isRouteActive(pathname, sub.href)
          )
          const active = isRouteActive(pathname, item.href) || hasActiveChild

          if (item.sub) {
            const isOpen =
              Boolean(openGroups[item.title]) ||
              Boolean(activeOpenGroups[item.title])

            return (
              <Collapsible
                className={cn("nav-group", isOpen && "open")}
                key={item.title}
                onOpenChange={(open) => setGroupOpen(item.title, open)}
                open={isOpen}
              >
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className={cn("nav-item nav-parent", active && "active")}
                    data-tip={item.title}
                    aria-label={item.title}
                  >
                    <Icon className="icon" />
                    <span>{item.title}</span>
                    <ChevronDownIcon className="icon-sm nav-caret" />
                  </button>
                </CollapsibleTrigger>
                <div className="nav-sub">
                  <div className="nav-sub-inner">
                    {item.sub.map((sub) => (
                      <Link
                        className={cn(
                          "nav-subitem",
                          isRouteActive(pathname, sub.href) && "active"
                        )}
                        href={sub.href}
                        key={sub.title}
                      >
                        <span className="nav-dot" />
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </Collapsible>
            )
          }

          return (
            <Link
              className={cn("nav-item", active && "active")}
              data-tip={item.title}
              href={item.href}
              key={item.title}
            >
              <Icon className="icon" />
              {item.title}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="assistant">
        <div className="assistant-top">
          <div className="assistant-avatar">
            <SparklesIcon className="icon" />
          </div>
          <div>
            <div className="assistant-title">AI Assistant</div>
            <div className="assistant-sub">Bạn cần hỗ trợ gì?</div>
          </div>
        </div>
        <button className="assistant-btn" type="button" onClick={() => router.push("/ai-assistant")}>
          <MessageCircleIcon className="icon-sm" />
          Chat ngay
        </button>
      </div>
    </aside>
  )
}
