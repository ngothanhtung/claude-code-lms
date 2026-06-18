import type { ClassSchedule } from "./types"

const DAY_LABELS: Record<number, string> = {
  0: "CN",
  1: "T2",
  2: "T3",
  3: "T4",
  4: "T5",
  5: "T6",
  6: "T7",
  7: "T8",
}

export function getDayLabel(dayOfWeek: number): string {
  return DAY_LABELS[dayOfWeek] ?? `T${dayOfWeek}`
}

export function formatSchedule(schedule: ClassSchedule[]): string {
  if (schedule.length === 0) return "—"

  const sorted = [...schedule].sort((a, b) => a.dayOfWeek - b.dayOfWeek)

  const groups = new Map<string, string[]>()

  for (const s of sorted) {
    const time = `${s.startTime}-${s.endTime}`
    const existing = groups.get(time)
    if (existing) {
      existing.push(getDayLabel(s.dayOfWeek))
    } else {
      groups.set(time, [getDayLabel(s.dayOfWeek)])
    }
  }

  const parts: string[] = []
  for (const [time, days] of groups) {
    parts.push(`${days.join(", ")} — ${time}`)
  }

  return parts.join("; ")
}
