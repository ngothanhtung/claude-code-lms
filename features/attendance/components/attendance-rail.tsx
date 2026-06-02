// features/attendance/components/attendance-rail.tsx
"use client"

import { TriangleAlert } from "lucide-react"

interface AttendanceRailProps {
  presentCount: number
  lateCount: number
  absentCount: number
  attendanceRate: number
}

export function AttendanceRail({
  presentCount,
  lateCount,
  absentCount,
  attendanceRate,
}: AttendanceRailProps) {
  const totalSessions = presentCount + lateCount + absentCount

  // SVG circular properties
  const radius = 62
  const strokeWidth = 14
  const circumference = 2 * Math.PI * radius // ~389.56
  const strokeDashoffset = circumference - (circumference * attendanceRate) / 100

  return (
    <aside className="flex flex-col gap-4.5">
      {/* Overall Progress Ring Card */}
      <div className="rounded-2xl border border-border bg-card p-5.5 shadow-xs text-center">
        <h2 className="text-sm font-extrabold tracking-tight text-foreground text-center border-b border-border pb-3">
          Tỷ lệ chuyên cần
        </h2>

        {/* SVG Ring Container */}
        <div className="relative mx-auto mt-4.5 h-[150px] w-[150px]">
          <svg className="-rotate-90" width="150" height="150" viewBox="0 0 150 150">
            {/* Background track circle */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth={strokeWidth}
            />
            {/* Value indicator circle */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="hsl(142 71% 42%)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[32px] font-black tracking-tight leading-none text-foreground">
              {attendanceRate}%
            </div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground">
              {totalSessions} buổi học
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4.5 flex flex-col gap-2 border-t border-border pt-4 text-left">
          {/* Present */}
          <div className="flex items-center gap-2 text-[12.5px]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-xs bg-green-500" />
            <span className="font-medium text-muted-foreground">Có mặt</span>
            <span className="ml-auto font-bold text-foreground tabular-nums">
              {presentCount}
            </span>
          </div>

          {/* Late */}
          <div className="flex items-center gap-2 text-[12.5px]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-xs bg-amber-500" />
            <span className="font-medium text-muted-foreground">Đi muộn</span>
            <span className="ml-auto font-bold text-foreground tabular-nums">
              {lateCount}
            </span>
          </div>

          {/* Absent */}
          <div className="flex items-center gap-2 text-[12.5px]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-xs bg-red-500" />
            <span className="font-medium text-muted-foreground">Vắng</span>
            <span className="ml-auto font-bold text-foreground tabular-nums">
              {absentCount}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Card */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5.5 shadow-xs text-amber-900">
        <div className="flex items-center gap-2 text-sm font-extrabold text-amber-800">
          <TriangleAlert className="h-4.5 w-4.5" />
          Lưu ý chuyên cần
        </div>
        <div className="mt-2.5 text-xs font-semibold text-amber-700/90 leading-relaxed">
          Sinh viên vắng quá <b className="font-bold text-amber-800">20%</b> số buổi của một học phần sẽ bị cấm thi. Học phần <b className="font-bold text-amber-800">Tiếng Anh chuyên ngành</b> (75%) đang gần ngưỡng — hãy chú ý các buổi tới.
        </div>
      </div>
    </aside>
  );
}
