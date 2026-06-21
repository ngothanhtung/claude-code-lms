"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  BookOpenCheckIcon,
  ChevronDownIcon,
  GraduationCapIcon,
  MessageCircleIcon,
  SettingsIcon,
  SparklesIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

const navItems: {
  title: string
  icon: typeof BookOpenCheckIcon
  href: string
  badge?: string
  sub?: { title: string; href: string }[]
}[] = [
  { title: "Quản lý lớp học", icon: BookOpenCheckIcon, href: "/staff/classes" },
  { title: "Giảng viên", icon: UsersIcon, href: "/staff/instructors" },
]

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

type StaffSidebarProps = {
  collapsed?: boolean
  interactive?: boolean
  mobileOpen?: boolean
  onNavigate?: () => void
}

export function StaffSidebar({
  collapsed = false,
  interactive = true,
  mobileOpen = false,
  onNavigate,
}: StaffSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [navScrolling, setNavScrolling] = useState(false)
  const initialOpenGroups = useMemo(() => {
    return navItems.reduce<Record<string, boolean>>((groups, item) => {
      if (item.sub) {
        const hasActiveChild = item.sub.some((sub) =>
          isRouteActive(pathname, sub.href)
        )

        groups[item.title] =
          isRouteActive(pathname, item.href) || hasActiveChild
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

  useEffect(() => {
    return () => {
      if (scrollEndTimer.current) {
        clearTimeout(scrollEndTimer.current)
      }
    }
  }, [])

  function handleNavScroll() {
    setNavScrolling(true)

    if (scrollEndTimer.current) {
      clearTimeout(scrollEndTimer.current)
    }

    scrollEndTimer.current = setTimeout(() => {
      setNavScrolling(false)
      scrollEndTimer.current = null
    }, 700)
  }

  return (
    <aside
      aria-hidden={!interactive}
      className={cn(
        collapsed && "collapsed",
        mobileOpen && "mobile-open",
        "sidebar"
      )}
      id="app-sidebar"
      inert={!interactive}
    >
      <div className="brand">
        <div className="brand-mark">
          <GraduationCapIcon className="h-6 w-6" />
        </div>
        <div>
          <div className="brand-name">LMS Portal</div>
          <div className="brand-sub">Dành cho Nhân viên</div>
        </div>
        <button
          aria-label="Đóng menu"
          className="sidebar-close"
          onClick={onNavigate}
          type="button"
        >
          <XIcon className="icon-sm" />
        </button>
      </div>

      <nav
        className={cn("nav", navScrolling && "scrolling")}
        onScroll={handleNavScroll}
      >
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
                        onClick={onNavigate}
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
              onClick={onNavigate}
            >
              <Icon className="icon" />
              <span>{item.title}</span>
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
        <button
          className="assistant-btn"
          type="button"
          onClick={() => {
            onNavigate?.()
            router.push("/ai-assistant")
          }}
        >
          <MessageCircleIcon className="icon-sm" />
          Chat ngay
        </button>
      </div>
    </aside>
  )
}
