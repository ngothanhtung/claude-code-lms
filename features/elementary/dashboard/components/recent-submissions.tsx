import {
  CheckCircleIcon,
  FileTextIcon,
  MessageCircleIcon,
  AlertCircleIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { IconTint } from "@/components/icon-tint"
const recentActivities = [
  { title: "Học sinh Trần Minh Tuấn", subtitle: "Hoàn thành Quiz Lesson 5 — Score: 9/10", time: "15 phút trước", iconTint: "green" as const, icon: "check-circle" },
  { title: "Học sinh Lê Thị Hương", subtitle: "Nộp bài tập Vocabulary — Lesson 5", time: "30 phút trước", iconTint: "blue" as const, icon: "file-text" },
  { title: "Phụ huynh Hoàng Văn Nam", subtitle: "Nhận xét về kết quả Quiz Lesson 4", time: "1 giờ trước", iconTint: "amber" as const, icon: "message-circle" },
  { title: "Học sinh Phạm Thị Lan", subtitle: "Vắng mặt tiết Tiếng Anh — 3B", time: "2 giờ trước", iconTint: "red" as const, icon: "alert-circle" },
  { title: "Học sinh Nguyễn Văn Đức", subtitle: "Hoàn thành Quiz Lesson 5 — Score: 8/10", time: "3 giờ trước", iconTint: "green" as const, icon: "check-circle" },
]

const activityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "check-circle": CheckCircleIcon,
  "file-text": FileTextIcon,
  "message-circle": MessageCircleIcon,
  "alert-circle": AlertCircleIcon,
}

export function RecentSubmissions() {
  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
          Hoạt động gần đây
        </h2>
        <span className="text-[13px] font-semibold text-primary hover:underline">
          Xem tất cả
        </span>
      </div>

      {recentActivities.map((activity) => {
        const Icon = activityIcons[activity.icon] ?? CheckCircleIcon
        return (
          <div
            key={`${activity.time}-${activity.title}`}
            className="flex gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0"
          >
            <IconTint
              variant={activity.iconTint}
              className="h-[34px] w-[34px] rounded-[9px]"
            >
              <Icon className="h-[14px] w-[14px]" />
            </IconTint>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold">{activity.title}</div>
              <div className="text-[12px] text-muted-foreground">
                {activity.subtitle}
              </div>
              <div className="mt-[2px] text-[11px] text-muted-foreground">
                {activity.time}
              </div>
            </div>
          </div>
        )
      })}
    </Card>
  )
}
