import {
  CheckCircleIcon,
  FileTextIcon,
  MessageCircleIcon,
  AlertCircleIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { IconTint } from "@/components/icon-tint"
import { recentActivities } from "@/features/elementary/dashboard/mock"

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
