"use client"

import { useState } from "react"
import dayjs from "dayjs"
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  currentTimetableWeekIndex,
  timetableHours,
  timetableWeeks,
} from "@/features/calendars/mock"
import {
  eventToneClasses,
  legendSwatchClasses,
} from "@/features/calendars/components/timetable-styles"
import { cn } from "@/lib/utils"

interface WeeklyTimetableProps {
  onSelectMonthly?: () => void
}

export function WeeklyTimetable({ onSelectMonthly }: WeeklyTimetableProps) {
  const [weekIndex, setWeekIndex] = useState(currentTimetableWeekIndex)
  const week = timetableWeeks[weekIndex]
  const isFirstWeek = weekIndex === 0
  const isLastWeek = weekIndex === timetableWeeks.length - 1

  function goToPreviousWeek() {
    setWeekIndex((current) => Math.max(0, current - 1))
  }

  function goToNextWeek() {
    setWeekIndex((current) => Math.min(timetableWeeks.length - 1, current + 1))
  }

  return (
    <>
      <div className="mb-0 flex flex-wrap items-end justify-between gap-5.5">
        <div>
          <h1 className="m-0 text-[26px] font-extrabold tracking-tight">
            Lịch học theo tuần
          </h1>
          <p className="mt-1.25 text-[13.5px] text-muted-foreground">
            Học kỳ II, năm học 2025 - 2026 · Thời khóa biểu tuần
          </p>
        </div>

        <div className="flex items-center gap-2 max-[680px]:flex-wrap">
          <Button
            className="h-9 rounded-md px-4 font-semibold"
            onClick={() => setWeekIndex(currentTimetableWeekIndex)}
            type="button"
          >
            Tuần này
          </Button>
          <Button
            className="h-9 rounded-md px-4 font-semibold"
            onClick={onSelectMonthly}
            type="button"
            variant="outline"
          >
            Tháng này
          </Button>
          <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-4 text-primary shadow-(--shadow-sm)">
            <CalendarDaysIcon className="h-4 w-4" />
            <span className="text-sm font-bold">{week.label}</span>
          </div>
          <div className="inline-flex gap-1">
            <Button
              aria-label="Tuần trước"
              className="h-9 w-9 rounded-md bg-card"
              disabled={isFirstWeek}
              onClick={goToPreviousWeek}
              size="icon"
              type="button"
              variant="outline"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              aria-label="Tuần sau"
              className="h-9 w-9 rounded-md bg-card"
              disabled={isLastWeek}
              onClick={goToNextWeek}
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
          <div
            className="grid min-w-220 grid-cols-[76px_repeat(6,minmax(150px,1fr))] grid-rows-[56px_repeat(10,62px)]"
            role="table"
            aria-label={`Thời khóa biểu tuần ${week.label}`}
          >
            <div className="col-start-1 row-start-1 flex flex-col items-center justify-center border-r border-b border-border">
              <div className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                Tuần
              </div>
              <div className="mt-0.5 text-[18px] leading-none font-extrabold text-primary">
                {week.weekNumber}
              </div>
            </div>

            {week.days.map((day) => (
              <div
                className={cn(
                  "row-start-1 flex flex-col items-center justify-center gap-0.5 border-r border-b border-border",
                  day.today && "bg-[hsl(var(--primary)/0.06)]"
                )}
                key={day.label}
                style={{ gridColumn: day.column }}
              >
                <div
                  className={cn(
                    "text-[13px] font-bold",
                    day.today && "text-primary"
                  )}
                >
                  {day.label}
                </div>
                <div
                  className={cn(
                    "text-[11.5px] text-muted-foreground",
                    day.today && "font-semibold text-primary"
                  )}
                >
                  {day.isoDate ? dayjs(day.isoDate).format("DD/MM/YYYY") : day.date}
                </div>
              </div>
            ))}

            {timetableHours.map((time, index) => (
              <div
                className="col-start-1 flex justify-end border-r border-border pt-1.5 pr-2.5 text-[11.5px] font-semibold text-muted-foreground"
                key={time}
                style={{ gridRow: index + 2 }}
              >
                {time}
              </div>
            ))}

            {week.days.map((day) => (
              <div
                className={cn(
                  "row-[2/span_10] border-r border-border bg-[repeating-linear-gradient(to_bottom,transparent,transparent_61px,hsl(var(--border))_61px,hsl(var(--border))_62px)]",
                  day.today && "bg-[hsl(var(--primary)/0.035)]"
                )}
                key={`${day.label}-column`}
                style={{ gridColumn: day.column }}
              />
            ))}

            {week.events.map((event) => (
              <div
                className={cn(
                  "z-2 m-[4px_5px] flex cursor-pointer flex-col gap-1 overflow-hidden rounded-[11px] p-[9px_11px] text-white shadow-(--shadow-card) transition duration-150 hover:-translate-y-0.5 hover:shadow-(--shadow-pop)",
                  eventToneClasses[event.tone]
                )}
                key={`${week.id}-${event.title}-${event.column}-${event.row}`}
                style={{ gridColumn: event.column, gridRow: event.row }}
              >
                <div className="text-[11px] font-bold opacity-90">
                  {event.time}
                </div>
                <div className="text-[13px] leading-[1.22] font-bold">
                  {event.title}
                </div>
                <div className="mt-auto flex items-center gap-1 text-[11px] opacity-90">
                  <MapPinIcon className="h-3 w-3" />
                  {event.room}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-[-2px] flex flex-wrap gap-x-[18px] gap-y-2">
        {week.legend.map((item) => (
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
