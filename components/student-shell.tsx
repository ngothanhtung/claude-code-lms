"use client"

import type { ReactNode } from "react"
import { useEffect, useState, useSyncExternalStore } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppTopbar } from "@/components/app-topbar"
import { cn } from "@/lib/utils"

const MOBILE_SIDEBAR_QUERY = "(max-width: 980px)"

function subscribeToMobileSidebar(callback: () => void) {
  const mediaQuery = window.matchMedia(MOBILE_SIDEBAR_QUERY)

  mediaQuery.addEventListener("change", callback)

  return () => mediaQuery.removeEventListener("change", callback)
}

function getMobileSidebarSnapshot() {
  return window.matchMedia(MOBILE_SIDEBAR_QUERY).matches
}

function getServerMobileSidebarSnapshot() {
  return false
}

export function StudentShell({ children }: { children: ReactNode }) {
  const isMobileSidebar = useSyncExternalStore(
    subscribeToMobileSidebar,
    getMobileSidebarSnapshot,
    getServerMobileSidebarSnapshot
  )
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  function handleMenuClick() {
    if (isMobileSidebar) {
      setMobileSidebarOpen((open) => !open)
      return
    }

    setSidebarCollapsed((collapsed) => !collapsed)
  }

  function closeMobileSidebar() {
    setMobileSidebarOpen(false)
  }

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [mobileSidebarOpen])

  return (
    <div
      className={cn(
        "app",
        sidebarCollapsed && "sidebar-collapsed",
        mobileSidebarOpen && "sidebar-mobile-open"
      )}
    >
      <AppSidebar
        collapsed={sidebarCollapsed}
        interactive={!isMobileSidebar || mobileSidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onNavigate={closeMobileSidebar}
      />
      <button
        aria-label="Đóng menu"
        className="sidebar-backdrop"
        onClick={closeMobileSidebar}
        type="button"
      />
      <div className="main">
        <AppTopbar
          mobileSidebarOpen={mobileSidebarOpen}
          onMenuClick={handleMenuClick}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
