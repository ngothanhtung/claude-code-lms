import { Card } from "@/components/ui/card"
import { IconTint } from "@/components/icon-tint"
import {
  ClipboardListIcon,
  ClockIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
} from "lucide-react"
import { assignmentStats } from "@/features/assignment-personal/mock"

const statsConfig = [
  {
    icon: ClipboardListIcon,
    tint: "blue" as const,
    label: "Tổng bài tập",
    value: assignmentStats.total,
    detail: "Tất cả bài tập",
  },
  {
    icon: ClockIcon,
    tint: "amber" as const,
    label: "Chưa nộp",
    value: assignmentStats.pending,
    detail: "Đang chờ xử lý",
  },
  {
    icon: CheckCircle2Icon,
    tint: "green" as const,
    label: "Đã nộp",
    value: assignmentStats.submitted,
    detail: "Đã nộp / đã chấm",
  },
  {
    icon: AlertTriangleIcon,
    tint: "red" as const,
    label: "Quá hạn",
    value: assignmentStats.overdue,
    detail: "Cần xử lý gấp",
  },
] as const

export function AssignmentStats() {
  return (
    <div className="grid grid-cols-4 gap-4 max-[1320px]:grid-cols-2 max-[680px]:grid-cols-2">
      {statsConfig.map((stat) => (
        <Card
          key={stat.label}
          className="gap-3 rounded-[var(--radius)] border border-border bg-card p-[18px] shadow-[var(--shadow-card)] ring-0 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]"
        >
          <div className="flex items-start justify-between">
            <IconTint variant={stat.tint} size="lg">
              <stat.icon className="h-5 w-5" />
            </IconTint>
          </div>
          <div className="text-[13px] font-medium text-muted-foreground">
            {stat.label}
          </div>
          <div
            className="text-[30px] leading-[1.05] font-extrabold tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            {stat.value}
          </div>
          <div className="mt-[10px] text-[12.5px] text-muted-foreground">
            {stat.detail}
          </div>
        </Card>
      ))}
    </div>
  )
}
