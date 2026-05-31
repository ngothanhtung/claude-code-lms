export type EventStatus = "live" | "upcoming" | "default"

export interface CalendarEvent {
  time: string
  status: EventStatus
  title: string
  room: string
  tag?: string
  tagColor?: string
  action?: {
    label: string
    variant: "primary" | "outline" | "default"
  }
}

export const todayLabel = "Thứ 6, 29/05/2026"
export const tomorrowLabel = "NGÀY MAI · THỨ 7, 30/05/2026"

export const todayEvents: CalendarEvent[] = [
  {
    time: "08:00 - 09:50",
    status: "live",
    title: "Cơ sở dữ liệu",
    room: "A1-201",
    tag: "Đang diễn ra",
    tagColor: "oklch(0.63 0.19 152)",
  },
  {
    time: "10:00 - 11:50",
    status: "default",
    title: "Lập trình hướng đối tượng",
    room: "B1-302",
    action: { label: "Tham gia online", variant: "outline" },
  },
  {
    time: "13:00 - 14:50",
    status: "default",
    title: "Tiếng Anh học thuật",
    room: "C2-405",
    action: { label: "Xem chi tiết", variant: "default" },
  },
]

export const tomorrowEvents: CalendarEvent[] = [
  {
    time: "07:30 - 09:20",
    status: "upcoming",
    title: "Cấu trúc dữ liệu và giải thuật",
    room: "A2-105",
    tag: "Sắp tới",
    tagColor: "oklch(0.55 0.01 265)",
  },
  {
    time: "10:00 - 11:50",
    status: "upcoming",
    title: "Lập trình Java",
    room: "B1-204",
    tag: "Sắp tới",
    tagColor: "oklch(0.55 0.01 265)",
  },
  {
    time: "13:00 - 14:50",
    status: "upcoming",
    title: "Claude Code for BackEnd",
    room: "Lab CNTT-301",
    tag: "Sắp tới",
    tagColor: "oklch(0.55 0.01 265)",
  },
]
