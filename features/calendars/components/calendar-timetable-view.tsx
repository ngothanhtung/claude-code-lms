"use client"

import { useState } from "react"
import { MonthlyTimetable } from "@/features/calendars/components/monthly-timetable"
import { WeeklyTimetable } from "@/features/calendars/components/weekly-timetable"

type CalendarViewMode = "weekly" | "monthly"

export function CalendarTimetableView() {
  const [viewMode, setViewMode] = useState<CalendarViewMode>("weekly")

  return (
    <>
      {viewMode === "weekly" ? (
        <WeeklyTimetable onSelectMonthly={() => setViewMode("monthly")} />
      ) : (
        <MonthlyTimetable onSelectWeekly={() => setViewMode("weekly")} />
      )}
    </>
  )
}
