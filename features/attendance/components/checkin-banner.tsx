// features/attendance/components/checkin-banner.tsx
"use client"

import { Clock, MapPin, User, Fingerprint, CheckCheck, Sparkles } from "lucide-react"
import type { TodayClass } from "../mock/attendance.mock"

interface CheckInBannerProps {
  todayClass: TodayClass
  isCheckedIn: boolean
  checkInTime: string | null
  onCheckIn: () => void
}

export function CheckInBanner({
  todayClass,
  isCheckedIn,
  checkInTime,
  onCheckIn,
}: CheckInBannerProps) {
  return (
    <div className="flex flex-col gap-4.5 rounded-2xl bg-gradient-to-r from-primary to-purple-600 p-5.5 text-white shadow-md transition-all sm:flex-row sm:items-center sm:gap-6">
      {/* Icon Emblem */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
        <Sparkles className="h-6 w-6 text-white" />
      </div>

      {/* Class Meta */}
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-semibold text-white/80 uppercase tracking-wider">
          Buổi học hôm nay
        </div>
        <div className="mt-1 text-lg font-black tracking-tight sm:text-xl">
          {todayClass.courseName} · {todayClass.courseCode}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/85">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Clock className="h-3.5 w-3.5" />
            {todayClass.time}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <MapPin className="h-3.5 w-3.5" />
            {todayClass.room}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <User className="h-3.5 w-3.5" />
            {todayClass.lecturer}
          </span>
        </div>
      </div>

      {/* Button Action */}
      {isCheckedIn ? (
        <div className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white/20 px-5 py-3 text-sm font-extrabold text-white backdrop-blur-xs select-none">
          <CheckCheck className="h-4.5 w-4.5" />
          Đã điểm danh · {checkInTime}
        </div>
      ) : (
        <button
          onClick={onCheckIn}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-white px-5 py-3 text-sm font-extrabold text-primary shadow-sm transition-all hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(243,60,30,0.3)] active:scale-100"
        >
          <Fingerprint className="h-4.5 w-4.5" />
          Điểm danh ngay
        </button>
      )}
    </div>
  )
}
