import Link from "next/link"
import type { ComponentType } from "react"
import {
  BarChart3Icon,
  CalendarHeartIcon,
  FileTextIcon,
  MegaphoneIcon,
} from "lucide-react"
import { NotificationItem } from "@/components/notification-item"
import { Card } from "@/components/ui/card"
import {
  recentNotifications,
  type NotificationIcon,
} from "@/features/notifications/mock"

const notificationIcons: Record<
  NotificationIcon,
  ComponentType<{ className?: string }>
> = {
  "file-text": FileTextIcon,
  "bar-chart-3": BarChart3Icon,
  megaphone: MegaphoneIcon,
  "calendar-heart": CalendarHeartIcon,
}

export function RecentNotifications() {
  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
          Thông báo gần đây
        </h2>
        <Link
          href="/notifications"
          className="text-[13px] font-semibold text-primary hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      {recentNotifications.map((notification) => {
        const Icon = notificationIcons[notification.icon]

        return (
          <NotificationItem
            key={`${notification.time}-${notification.title}`}
            icon={<Icon className="h-[14px] w-[14px]" />}
            iconTint={notification.iconTint}
            title={notification.title}
            subtitle={notification.subtitle}
            time={notification.time}
            unread={notification.unread}
          />
        )
      })}

      <div className="mt-[10px] border-t border-border pt-[14px] text-center">
        <Link
          href="/notifications"
          className="text-[13px] font-semibold text-primary hover:underline"
        >
          Xem tất cả thông báo →
        </Link>
      </div>
    </Card>
  )
}
