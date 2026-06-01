import Link from "next/link"
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ScheduleSlot } from "@/features/calendars/components/schedule-slot"
import {
  todayEvents,
  todayLabel,
  tomorrowEvents,
  tomorrowLabel,
} from "@/features/calendars/mock"

export function TodayEvents() {
  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight whitespace-nowrap">
          Lịch học hôm nay
        </h2>
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-medium whitespace-nowrap text-muted-foreground">
            {todayLabel}
          </span>
          <div className="flex gap-1">
            <button
              aria-label="Trước"
              className="grid h-[30px] w-[30px] place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              aria-label="Sau"
              className="grid h-[30px] w-[30px] place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {todayEvents.map((event) => (
        <ScheduleSlot key={`${event.time}-${event.title}`} {...event} />
      ))}

      <div className="mt-1.5 flex items-center gap-2.5 border-t border-border pt-3 text-[11.5px] font-bold tracking-wide text-muted-foreground uppercase">
        {tomorrowLabel}
      </div>

      {tomorrowEvents.map((event) => (
        <ScheduleSlot key={`${event.time}-${event.title}`} {...event} />
      ))}

      <div className="mt-1.5 border-t border-border pt-[14px] text-center">
        <Link
          href="/calendar"
          className="inline-flex items-center justify-center gap-1 text-[13px] font-semibold text-primary hover:underline"
        >
          Xem toàn bộ lịch học <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  )
}
