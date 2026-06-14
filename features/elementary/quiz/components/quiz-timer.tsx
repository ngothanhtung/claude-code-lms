"use client"

import { ClockIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizTimerProps {
  timeRemaining: number
  isWarning: boolean
}

/** Format seconds to MM:SS */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function QuizTimer({ timeRemaining, isWarning }: QuizTimerProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold tabular-nums",
        isWarning
          ? "bg-red-50 text-red-600 animate-pulse"
          : "bg-gray-100 text-gray-700"
      )}
    >
      <ClockIcon className="h-4 w-4" />
      {formatTime(timeRemaining)}
    </div>
  )
}
