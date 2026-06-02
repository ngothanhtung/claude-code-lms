// features/attendance/components/attendance-stats.tsx
"use client"

import { Check, Clock, X, Percent } from "lucide-react"

interface AttendanceStatsProps {
  presentCount: number
  lateCount: number
  absentCount: number
  attendanceRate: number
}

export function AttendanceStats({
  presentCount,
  lateCount,
  absentCount,
  attendanceRate,
}: AttendanceStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
      {/* Present */}
      <div className="rounded-2xl border border-border bg-card p-4.5 shadow-xs transition-all hover:shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-green-500/10 text-green-500">
            <Check className="h-3.5 w-3.5" />
          </span>
          Có mặt
        </div>
        <div className="mt-2 text-2xl font-black text-green-600 tracking-tight">
          {presentCount}
        </div>
      </div>

      {/* Late */}
      <div className="rounded-2xl border border-border bg-card p-4.5 shadow-xs transition-all hover:shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-500">
            <Clock className="h-3.5 w-3.5" />
          </span>
          Đi muộn
        </div>
        <div className="mt-2 text-2xl font-black text-amber-600 tracking-tight">
          {lateCount}
        </div>
      </div>

      {/* Absent */}
      <div className="rounded-2xl border border-border bg-card p-4.5 shadow-xs transition-all hover:shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-red-500/10 text-red-500">
            <X className="h-3.5 w-3.5" />
          </span>
          Vắng
        </div>
        <div className="mt-2 text-2xl font-black text-red-600 tracking-tight">
          {absentCount}
        </div>
      </div>

      {/* Attendance Rate */}
      <div className="rounded-2xl border border-border bg-card p-4.5 shadow-xs transition-all hover:shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
            <Percent className="h-3.5 w-3.5" />
          </span>
          Chuyên cần
        </div>
        <div className="mt-2 text-2xl font-black text-blue-600 tracking-tight">
          {attendanceRate}%
        </div>
      </div>
    </div>
  )
}
