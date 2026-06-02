// features/attendance/components/course-attendance.tsx
"use client"

import { Coffee, Database, Network, Globe, Languages, BookOpen } from "lucide-react"
import type { CourseAttendance } from "../mock/attendance.mock"

interface CourseAttendanceProps {
  courses: CourseAttendance[]
}

function getIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case "coffee":
      return <Coffee className="h-4.5 w-4.5" />
    case "database":
      return <Database className="h-4.5 w-4.5" />
    case "network":
      return <Network className="h-4.5 w-4.5" />
    case "globe":
      return <Globe className="h-4.5 w-4.5" />
    case "languages":
      return <Languages className="h-4.5 w-4.5" />
    default:
      return <BookOpen className="h-4.5 w-4.5" />
  }
}

function getColorClasses(colorName: string) {
  switch (colorName) {
    case "indigo":
      return {
        bg: "bg-indigo-500/10",
        text: "text-indigo-500",
      }
    case "green":
      return {
        bg: "bg-green-500/10",
        text: "text-green-500",
      }
    case "blue":
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-500",
      }
    case "amber":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-500",
      }
    case "red":
      return {
        bg: "bg-red-500/10",
        text: "text-red-500",
      }
    default:
      return {
        bg: "bg-slate-500/10",
        text: "text-slate-500",
      }
  }
}

export function CourseAttendanceList({ courses }: CourseAttendanceProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5.5 shadow-xs">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <h2 className="text-base font-extrabold tracking-tight text-foreground sm:text-[16.5px]">
          Chuyên cần theo học phần
        </h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
          {courses.length} học phần
        </span>
      </div>

      <div className="mt-2 divide-y divide-border">
        {courses.map((c) => {
          const rate = Math.round((c.present / c.total) * 100)
          let statusColor = "text-green-600"
          let barColor = "bg-green-500"

          if (rate < 78) {
            statusColor = "text-red-600"
            barColor = "bg-red-500"
          } else if (rate < 85) {
            statusColor = "text-amber-600"
            barColor = "bg-amber-500"
          }

          const colorClasses = getColorClasses(c.color)

          return (
            <div
              key={c.id}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4.5 first:pt-3 last:pb-0"
            >
              {/* Icon */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorClasses.bg} ${colorClasses.text}`}
              >
                {getIcon(c.icon)}
              </div>

              {/* Title & Code */}
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold text-foreground">
                  {c.name}
                </div>
                <div className="mt-0.5 text-xs font-semibold text-muted-foreground">
                  {c.code}
                </div>
              </div>

              {/* Progress Bar wrap */}
              <div className="flex-1.3 min-w-[120px]">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Có mặt <b className="font-semibold text-foreground">{c.present}</b>/{c.total}
                  </span>
                  <span>
                    {c.absent > 0 ? `${c.absent} vắng` : ""}{" "}
                    {c.late > 0 ? (c.absent > 0 ? `· ${c.late} muộn` : `${c.late} muộn`) : ""}
                    {c.absent === 0 && c.late === 0 ? "0 vắng" : ""}
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-500`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>

              {/* Percentage */}
              <div className={`w-14 text-right text-base font-extrabold tabular-nums ${statusColor}`}>
                {rate}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
