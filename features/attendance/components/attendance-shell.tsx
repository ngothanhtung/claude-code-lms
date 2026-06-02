// features/attendance/components/attendance-shell.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarRange } from "lucide-react"
import { AttendanceStats } from "./attendance-stats"
import { CheckInBanner } from "./checkin-banner"
import { CourseAttendanceList } from "./course-attendance"
import { SessionLogList } from "./session-log"
import { AttendanceRail } from "./attendance-rail"
import {
  INITIAL_COURSES,
  INITIAL_SESSIONS,
  TODAY_CLASS,
  type CourseAttendance,
  type SessionLog,
} from "../mock/attendance.mock"

const LOCAL_STORAGE_KEY_CHECKED_IN = "lms-attendance-checked-in"
const LOCAL_STORAGE_KEY_TIME = "lms-attendance-check-in-time"

export function AttendanceShell() {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load persistence state on mount
  useEffect(() => {
    let savedCheckedIn = false
    let savedTime: string | null = null
    try {
      savedCheckedIn = localStorage.getItem(LOCAL_STORAGE_KEY_CHECKED_IN) === "true"
      savedTime = localStorage.getItem(LOCAL_STORAGE_KEY_TIME)
    } catch {
      // ignore localStorage block
    }

    Promise.resolve().then(() => {
      if (savedCheckedIn && savedTime) {
        setIsCheckedIn(true)
        setCheckInTime(savedTime)
      }
      setIsLoaded(true)
    })
  }, [])

  // Action: Check-in handler
  const handleCheckIn = useCallback(() => {
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, "0")
    const mm = String(now.getMinutes()).padStart(2, "0")
    const timeStr = `${hh}:${mm}`

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CHECKED_IN, "true")
      localStorage.setItem(LOCAL_STORAGE_KEY_TIME, timeStr)
    } catch {
      // ignore localStorage block
    }

    setIsCheckedIn(true)
    setCheckInTime(timeStr)
  }, [])

  // Derived state calculations
  const presentCount = isCheckedIn ? 53 : 52
  const lateCount = 3
  const absentCount = 2
  const totalCount = presentCount + lateCount + absentCount // 57 or 58

  // Calculate rate: matches exactly 93% initially and dynamically updates
  const attendanceRate = Math.round(
    ((presentCount + lateCount * 0.34) / totalCount) * 100
  )

  // Dynamically update course list: increment INT2211 (Cơ sở dữ liệu) present count when checked in
  const courses: CourseAttendance[] = INITIAL_COURSES.map((c) => {
    if (c.code === "INT2211" && isCheckedIn) {
      return {
        ...c,
        present: c.present + 1,
      }
    }
    return c
  })

  // Dynamically update sessions: insert today's session at the top when checked in
  const sessions: SessionLog[] = [...INITIAL_SESSIONS]
  if (isCheckedIn && isLoaded) {
    const today = new Date()
    const day = String(today.getDate())
    const months = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"]
    const month = months[today.getMonth()]

    sessions.unshift({
      id: "today-session",
      date: day,
      month: month,
      courseName: TODAY_CLASS.courseName,
      courseCode: TODAY_CLASS.courseCode,
      time: TODAY_CLASS.time,
      room: TODAY_CLASS.room,
      status: "present",
    })
  }

  return (
    <>
      {/* Left Column: Main */}
      <div className="flex flex-col gap-[22px] min-w-0 flex-1">
        {/* Page Header */}
        <div className="flex flex-col gap-4.5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Điểm danh
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-muted-foreground">
              Theo dõi chuyên cần &amp; điểm danh các buổi học
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-extrabold text-muted-foreground shadow-xs">
            <CalendarRange className="h-4 w-4" />
            Học kỳ III · 2025–2026
          </span>
        </div>

        {/* Stats Grid */}
        <AttendanceStats
          presentCount={presentCount}
          lateCount={lateCount}
          absentCount={absentCount}
          attendanceRate={attendanceRate}
        />

        {/* Check-In Banner */}
        <CheckInBanner
          todayClass={TODAY_CLASS}
          isCheckedIn={isCheckedIn}
          checkInTime={checkInTime}
          onCheckIn={handleCheckIn}
        />

        {/* Per-Course Progress */}
        <CourseAttendanceList courses={courses} />

        {/* Past Logs */}
        <SessionLogList sessions={sessions} />
      </div>

      {/* Right Column: Rail */}
      <AttendanceRail
        presentCount={presentCount}
        lateCount={lateCount}
        absentCount={absentCount}
        attendanceRate={attendanceRate}
      />
    </>
  )
}
