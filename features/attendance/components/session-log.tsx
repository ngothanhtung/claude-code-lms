// features/attendance/components/session-log.tsx
"use client"

import { Check, Clock, X } from "lucide-react"
import type { SessionLog } from "../mock/attendance.mock"

interface SessionLogProps {
  sessions: SessionLog[]
}

function getStatusBadge(status: "present" | "late" | "absent") {
  switch (status) {
    case "present":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600">
          <Check className="h-3.5 w-3.5" />
          Có mặt
        </span>
      )
    case "late":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600">
          <Clock className="h-3.5 w-3.5" />
          Đi muộn
        </span>
      )
    case "absent":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-600">
          <X className="h-3.5 w-3.5" />
          Vắng
        </span>
      )
  }
}

export function SessionLogList({ sessions }: SessionLogProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5.5 shadow-xs">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <h2 className="text-base font-extrabold tracking-tight text-foreground sm:text-[16.5px]">
          Lịch sử điểm danh
        </h2>
        <button
          className="cursor-pointer text-xs font-bold text-primary hover:underline"
          onClick={() => {}}
        >
          Xem tất cả
        </button>
      </div>

      <div className="mt-2 divide-y divide-border">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3.5 py-3.5 first:pt-2 last:pb-0"
          >
            {/* Date block */}
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-muted p-1 text-center select-none">
              <div className="text-base font-black leading-none text-foreground">
                {s.date}
              </div>
              <div className="mt-1 text-[10px] font-extrabold text-muted-foreground uppercase">
                {s.month}
              </div>
            </div>

            {/* Subject details */}
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-bold text-foreground truncate">
                {s.courseName}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span>{s.courseCode}</span>
                <span className="h-0.75 w-0.75 rounded-full bg-muted-foreground/55" />
                <span>{s.time}</span>
                <span className="h-0.75 w-0.75 rounded-full bg-muted-foreground/55" />
                <span>{s.room}</span>
              </div>
            </div>

            {/* Badge status */}
            <div className="shrink-0">{getStatusBadge(s.status)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
