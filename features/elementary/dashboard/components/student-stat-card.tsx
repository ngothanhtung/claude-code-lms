import React from "react"
import { cn } from "@/lib/utils"
import { IconTint } from "@/components/icon-tint"
import {
  BookOpenIcon,
  StarIcon,
  FlameIcon,
  UsersIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"

interface StudentStatCardProps {
  variant: "lessons" | "score" | "streak" | "group"
  className?: string
}

export function StudentStatCard({
  variant,
  className,
}: StudentStatCardProps) {
  type StatConfig = {
    icon: React.ComponentType<{ className?: string }>
    iconTint: "indigo" | "green" | "blue" | "amber" | "red"
    label: string
    value: string
    detail?: string
    trend?: string
    spark?: true
    progress?: number
  }

  const configs: Record<StudentStatCardProps["variant"], StatConfig> = {
    lessons: {
      icon: BookOpenIcon,
      iconTint: "blue",
      label: "Bài học đã học",
      value: "5/8",
      detail: "Lesson 1 → Lesson 5",
    },
    score: {
      icon: StarIcon,
      iconTint: "amber",
      label: "Điểm trung bình",
      value: "8.5",
      detail: "Top 5 lớp 3A",
      trend: "+0.3",
    },
    streak: {
      icon: FlameIcon,
      iconTint: "red",
      label: "Chuỗi ngày học",
      value: "12",
      detail: "ngày liên tiếp 🔥",
      spark: true,
    },
    group: {
      icon: UsersIcon,
      iconTint: "green",
      label: "Nhóm học",
      value: "Nhóm 2",
      detail: "Hoàn thành 5/6 quiz",
      progress: 83,
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
        {c.spark && (
          <svg className="h-[34px] w-[64px]" viewBox="0 0 64 34" fill="none">
            <polyline
              points="0,28 12,22 22,25 34,14 44,17 56,6 64,9"
              stroke="oklch(0.63 0.19 27)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {c.trend && (
          <span className="text-[13px] font-semibold text-success">
            +{c.trend}
          </span>
        )}
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
              className="h-full rounded-full bg-[linear-gradient(90deg,hsl(142_71%_50%),hsl(142_71% 42%))]"
              style={{ width: `${c.progress}%` }}
            />
          </div>
        </>
      ) : (
        <div className="mt-[10px] text-[12.5px] text-muted-foreground">
          {c.detail}
        </div>
      )}
    </Card>
  )
}
