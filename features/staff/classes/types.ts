export type StaffClassStatus = "active" | "paused" | "ended"

export interface ClassSchedule {
  /** 0 = Chủ Nhật ... 7 = Thứ 7 (or 1-7 Mon-Sun) */
  dayOfWeek: number
  startTime: string // "18:00"
  endTime: string // "20:00"
}

export interface StaffClass {
  id: string
  code: string // "LHP-2026-01"
  name: string // "Lập trình Web - Khóa 01"
  instructor: string
  subjects: string[]
  maxStudents: number
  currentStudents: number
  schedule: ClassSchedule[]
  status: StaffClassStatus
  startDate: string
  endDate: string
  location?: string
  createdAt: string
  updatedAt: string
}
