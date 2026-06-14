import React from "react"
import { cn } from "@/lib/utils"
import { IconTint } from "@/components/icon-tint"
import {
  UsersIcon,
  ClockIcon,
  ClipboardCheckIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"

interface TeacherStatCardProps {
  variant: "students" | "schedule" | "submissions" | "attendance"
  className?: string
}

export function TeacherStatCard({
  variant,
  className,
}: TeacherStatCardProps) {
  type StatConfig = {
    icon: React.ComponentType<{ className?: string }>
    iconTint: "indigo" | "green" | "blue" | "amber"
    label: string
    value: string
    detail?: string
    danger?: true
    progress?: number
  }

  const configs: Record<TeacherStatCardProps["variant"], StatConfig> = {
    students: {
      icon: UsersIcon,
      iconTint: "indigo",
      label: "Học sinh lớp chủ nhiệm",
      value: "35",
      detail: "3A — Năm học 2025–2026",
    },
    schedule: {
      icon: ClockIcon,
      iconTint: "blue",
      label: "Tiết dạy hôm nay",
      value: "4",
      detail: "Tiết 1 → Tiết 4",
    },
    submissions: {
      icon: ClipboardCheckIcon,
      iconTint: "amber",
      label: "Bài chờ chấm",
      value: "12",
      detail: "Bài nộp từ hôm qua",
      danger: true,
    },
    attendance: {
      icon: TrendingUpIcon,
      iconTint: "green",
      label: "Tỷ lệ chuyên cần",
      value: "94%",
      detail: "Tuần này",
      progress: 94,
    },
  }

  const c = configs[variant]

  return (
    <Card
      className={cn(
        "gap-3 rounded-[var(--radius)] border border-border bg-card p-[18px] py-[18px] shadow-[var(--shadow-card)] ring-0 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <IconTint variant={c.iconTint} size="lg">
          <c.icon className="h-5 w-5" />
        </IconTint>
      </div>
      <div className="text-[13px] font-medium text-muted-foreground">
        {c.label}
      </div>
      <div
        className="text-[30px] leading-[1.05] font-extrabold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        {c.value}
      </div>
      {"progress" in c && c.progress !== undefined ? (
        <>
          <div className="mt-[10px] mb-[5px] text-[12.5px] text-muted-foreground">
            {c.detail}
          </div>
          <div className="mt-[4px] h-[7px] overflow-hidden rounded-full bg-[oklch(0.965_0_0)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,hsl(142_71%_50%),hsl(142_71%_42%))]"
              style={{ width: `${c.progress}%` }}
            />
          </div>
        </>
      ) : (
        <div
          className={cn(
            "mt-[10px] text-[12.5px]",
            c.danger
              ? "font-semibold text-[oklch(0.55_0.22_27)]"
              : "text-muted-foreground"
          )}
        >
          {c.detail}
        </div>
      )}
    </Card>
  )
}
