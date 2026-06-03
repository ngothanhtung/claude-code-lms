"use client"

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const options = [
  { value: "light", label: "Sáng", icon: SunIcon },
  { value: "dark", label: "Tối", icon: MoonIcon },
  { value: "system", label: "Hệ thống", icon: MonitorIcon },
] as const

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  // Avoid hydration mismatch — render only after mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className={cn("theme-toggle", className)}
        aria-hidden="true"
        style={{ opacity: 0 }}
      />
    )
  }

  return (
    <div
      className={cn("theme-toggle", className)}
      role="group"
      aria-label="Chọn giao diện"
    >
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          className={cn("theme-toggle-opt", theme === value && "active")}
          onClick={() => setTheme(value)}
          aria-label={label}
          aria-pressed={theme === value}
        >
          <Icon className="theme-toggle-icon" />
          <span className="theme-toggle-label">{label}</span>
        </button>
      ))}
    </div>
  )
}
