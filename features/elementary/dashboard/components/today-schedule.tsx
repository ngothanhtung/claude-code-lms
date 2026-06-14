import {
  BookOpenIcon,
  PaletteIcon,
  SmileIcon,
  PenLineIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { IconTint } from "@/components/icon-tint"
import { BadgeStatus } from "@/components/badge-status"
import { todaySchedule } from "@/features/elementary/dashboard/mock"

const slotIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Toán 3": PenLineIcon,
  "Tiếng Việt 3": BookOpenIcon,
  "Mỹ thuật 3": PaletteIcon,
  "Hoạt động trải nghiệm": SmileIcon,
}

export function TodaySchedule() {
  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
          Lịch dạy hôm nay
        </h2>
        <span className="text-[13px] font-medium text-muted-foreground">
          {todaySchedule.length} tiết
        </span>
      </div>

      {todaySchedule.map((slot) => {
        const SlotIcon = slotIcons[slot.title] ?? BookOpenIcon
        return (
          <div
            key={`${slot.time}-${slot.title}`}
            className="flex items-center gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0"
          >
            <IconTint
              variant={slot.iconTint}
              className="h-[34px] w-[34px] rounded-[9px]"
            >
              <SlotIcon className="h-[14px] w-[14px]" />
            </IconTint>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold">{slot.title}</div>
              <div className="text-[12px] text-muted-foreground">
                {slot.time} · {slot.room}
              </div>
            </div>
            <BadgeStatus
              variant={slot.status === "done" ? "success" : "info"}
            >
              {slot.status === "done" ? "Đã dạy" : "Sắp tới"}
            </BadgeStatus>
          </div>
        )
      })}
    </Card>
  )
}
