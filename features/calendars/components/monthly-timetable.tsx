"use client"

import { useState } from "react"
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  currentTimetableMonthIndex,
  timetableMonths,
  type TimetableEvent,
  type TimetableWeek,
} from "@/features/calendars/mock"
import {
  eventToneClasses,
  legendSwatchClasses,
} from "@/features/calendars/components/timetable-styles"
import { cn } from "@/lib/utils"

const weekDayColumns = [
  { label: "Thứ 2", column: 2 },
  { label: "Thứ 3", column: 3 },
  { label: "Thứ 4", column: 4 },
  { label: "Thứ 5", column: 5 },
  { label: "Thứ 6", column: 6 },
  { label: "Thứ 7", column: 7 },
]

function getEventsForDay(week: TimetableWeek, column: number) {
  return week.events.filter((event) => event.column === column)
}

function getDayMeta(week: TimetableWeek, column: number) {
  return week.days.find((day) => day.column === column)
}

function MonthlyEventPill({ event }: { event: TimetableEvent }) {
  return (
    <div
      className={cn(
        "rounded-[9px] px-2.5 py-2 text-white shadow-(--shadow-sm)",
        eventToneClasses[event.tone]
      )}
    >
      <div className="text-[10.5px] font-bold opacity-90">{event.time}</div>
      <div className="mt-0.5 line-clamp-2 text-[12px] leading-[1.2] font-bold">
        {event.title}
      </div>
      <div className="mt-1 flex items-center gap-1 text-[10.5px] opacity-90">
        <MapPinIcon className="h-3 w-3 shrink-0" />
        <span className="truncate">{event.room}</span>
      </div>
    </div>
  )
}

interface MonthlyTimetableProps {
  onSelectWeekly?: () => void
}

export function MonthlyTimetable({ onSelectWeekly }: MonthlyTimetableProps) {
  const [monthIndex, setMonthIndex] = useState(currentTimetableMonthIndex)
  const month = timetableMonths[monthIndex]
  const legend = month?.legend ?? []
  const isFirstMonth = monthIndex === 0
  const isLastMonth = monthIndex === timetableMonths.length - 1

  function goToPreviousMonth() {
    setMonthIndex((current) => Math.max(0, current - 1))
  }

  function goToNextMonth() {
    setMonthIndex((current) =>
      Math.min(timetableMonths.length - 1, current + 1)
    )
  }

  return (
    <>
      <div className="mb-0 flex flex-wrap items-end justify-between gap-5.5">
        <div>
          <h1 className="m-0 text-[26px] font-extrabold tracking-tight">
            Lịch học theo tháng
          </h1>
          <p className="mt-1.25 text-[13.5px] text-muted-foreground">
            Tổng quan {month?.rangeLabel} · Học kỳ II, năm học 2025 - 2026
          </p>
        </div>

        <div className="flex items-center gap-2 max-[680px]:flex-wrap">
          <Button
            className="h-9 rounded-md px-4 font-semibold"
            onClick={onSelectWeekly}
            type="button"
            variant="outline"
          >
            Tuần này
          </Button>
          <Button
            className="h-9 rounded-md px-4 font-semibold"
            onClick={() => setMonthIndex(currentTimetableMonthIndex)}
            type="button"
          >
            Tháng này
          </Button>
          <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-4 text-primary shadow-(--shadow-sm)">
            <CalendarDaysIcon className="h-4 w-4" />
            <span className="text-sm font-bold">{month?.label}</span>
          </div>
          <div className="inline-flex gap-1">
            <Button
              aria-label="Tháng trước"
              className="h-9 w-9 rounded-md bg-card"
              disabled={isFirstMonth}
              onClick={goToPreviousMonth}
              size="icon"
              type="button"
              variant="outline"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              aria-label="Tháng sau"
              className="h-9 w-9 rounded-md bg-card"
              disabled={isLastMonth}
              onClick={goToNextMonth}
              size="icon"
              type="button"
              variant="outline"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card className="gap-0 overflow-hidden rounded-(--radius) border border-border bg-card p-0 py-0 shadow-(--shadow-card) ring-0">
        <div className="overflow-x-auto">
          <div className="min-w-240">
            <div className="grid grid-cols-[108px_repeat(6,minmax(130px,1fr))] border-b border-border bg-muted/35">
              <div className="border-r border-border px-4 py-3 text-[12px] font-bold tracking-wide text-muted-foreground uppercase">
                Tuần
              </div>
              {weekDayColumns.map((day) => (
                <div
                  className="border-r border-border px-3 py-3 text-center text-[12px] font-bold tracking-wide text-muted-foreground uppercase last:border-r-0"
                  key={day.label}
                >
                  {day.label}
                </div>
              ))}
            </div>

            {month?.weeks.map((week) => (
              <div
                className="grid min-h-41 grid-cols-[108px_repeat(6,minmax(130px,1fr))] border-b border-border last:border-b-0"
                key={week.id}
              >
                <div className="flex flex-col border-r border-border bg-card px-4 py-3">
                  <div>
                    <div className="text-[13px] leading-tight font-extrabold">
                      Tuần {week.weekNumber}
                    </div>
                    <div className="mt-1 text-[11.5px] leading-snug font-semibold text-muted-foreground">
                      {week.label}
                    </div>
                  </div>
                </div>

                {weekDayColumns.map((dayColumn) => {
                  const day = getDayMeta(week, dayColumn.column)
                  const events = getEventsForDay(week, dayColumn.column)

                  return (
                    <div
                      className={cn(
                        "min-h-41 border-r border-border p-2.5 last:border-r-0",
                        day?.today && "bg-[hsl(var(--primary)/0.035)]"
                      )}
                      key={`${week.id}-${dayColumn.column}`}
                    >
                      <div
                        className={cn(
                          "mb-2 flex items-center justify-between text-[11.5px] font-bold text-muted-foreground",
                          day?.today && "text-primary"
                        )}
                      >
                        <span>{day?.date}</span>
                        {day?.today && <span>Hôm nay</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        {events.length > 0 ? (
                          events.map((event) => (
                            <MonthlyEventPill
                              event={event}
                              key={`${week.id}-${event.title}-${event.row}`}
                            />
                          ))
                        ) : (
                          <div className="rounded-[9px] border border-dashed border-border px-2.5 py-3 text-center text-[11.5px] font-medium text-muted-foreground">
                            Không có lịch
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="-mt-0.5 flex flex-wrap gap-x-4.5 gap-y-2">
        {legend.map((item) => (
          <div
            className="flex items-center gap-2 text-[12.5px] text-foreground"
            key={item.label}
          >
            <span
              className={cn("h-3 w-3 rounded", legendSwatchClasses[item.tone])}
            />
            {item.label}
          </div>
        ))}
      </div>
    </>
  )
}
