import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"

dayjs.extend(isoWeek)

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

export type CalendarEventTone =
  | "violet"
  | "green"
  | "blue"
  | "amber"
  | "teal"
  | "rust"

export interface TimetableDay {
  label: string
  date: string
  column: number
  isoDate: string
  today?: boolean
}

export interface TimetableEvent {
  time: string
  title: string
  room: string
  tone: CalendarEventTone
  column: number
  row: string
}

export interface TimetableLegendItem {
  label: string
  tone: CalendarEventTone
}

export interface TimetableWeek {
  id: string
  weekNumber: number
  label: string
  startDate: string
  endDate: string
  days: TimetableDay[]
  events: TimetableEvent[]
  legend: TimetableLegendItem[]
}

export interface TimetableMonth {
  id: string
  label: string
  rangeLabel: string
  weeks: TimetableWeek[]
  legend: TimetableLegendItem[]
}

export const timetableHours = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
]

const timetableLegend: TimetableLegendItem[] = [
  { label: "Lập trình hướng đối tượng", tone: "violet" },
  { label: "Cơ sở dữ liệu", tone: "green" },
  { label: "Cấu trúc dữ liệu và giải thuật", tone: "blue" },
  { label: "Lập trình Java", tone: "amber" },
  { label: "Tiếng Anh học thuật", tone: "teal" },
  { label: "Claude Code for BackEnd", tone: "rust" },
]

const mockStartDate = new Date(Date.UTC(2026, 4, 1))
const mockEndDate = new Date(Date.UTC(2026, 11, 21))
const currentTimetableDate = new Date(Date.UTC(2026, 5, 1))

type SchedulePattern = {
  title: string
  room: string
  tone: CalendarEventTone
  dayOffset: number
  time: string
  row: string
  every?: number
  offset?: number
}

const schedulePatterns: SchedulePattern[] = [
  {
    title: "Lập trình hướng đối tượng",
    room: "A2-201",
    tone: "violet",
    dayOffset: 0,
    time: "07:00 – 09:00",
    row: "2 / span 2",
  },
  {
    title: "Cơ sở dữ liệu",
    room: "B1-105",
    tone: "green",
    dayOffset: 1,
    time: "09:00 – 11:00",
    row: "4 / span 2",
  },
  {
    title: "Cấu trúc dữ liệu và giải thuật",
    room: "A3-302",
    tone: "blue",
    dayOffset: 2,
    time: "13:00 – 15:00",
    row: "8 / span 2",
  },
  {
    title: "Lập trình Java",
    room: "Lab CNTT-201",
    tone: "amber",
    dayOffset: 3,
    time: "07:00 – 09:00",
    row: "2 / span 2",
  },
  {
    title: "Tiếng Anh học thuật",
    room: "NN-110",
    tone: "teal",
    dayOffset: 4,
    time: "09:00 – 11:00",
    row: "4 / span 2",
  },
  {
    title: "Claude Code for BackEnd",
    room: "Lab CNTT-301",
    tone: "rust",
    dayOffset: 5,
    time: "13:00 – 15:00",
    row: "8 / span 2",
  },
  {
    title: "Cơ sở dữ liệu - Lab truy vấn",
    room: "B1-204",
    tone: "green",
    dayOffset: 3,
    time: "10:00 – 12:00",
    row: "5 / span 2",
    every: 2,
  },
  {
    title: "Claude Code for BackEnd - Workshop",
    room: "Lab CNTT-301",
    tone: "rust",
    dayOffset: 5,
    time: "09:00 – 11:00",
    row: "4 / span 2",
    every: 2,
    offset: 1,
  },
  {
    title: "Tiếng Anh học thuật - Speaking",
    room: "NN-205",
    tone: "teal",
    dayOffset: 1,
    time: "13:00 – 15:00",
    row: "8 / span 2",
    every: 3,
  },
  {
    title: "CTDL&GT - Bài tập thuật toán",
    room: "A3-305",
    tone: "blue",
    dayOffset: 4,
    time: "13:00 – 15:00",
    row: "8 / span 2",
    every: 3,
    offset: 1,
  },
  {
    title: "Lập trình hướng đối tượng - Review",
    room: "A2-203",
    tone: "violet",
    dayOffset: 2,
    time: "07:00 – 09:00",
    row: "2 / span 2",
    every: 4,
    offset: 2,
  },
  {
    title: "Lập trình Java - Lab thực hành",
    room: "Lab CNTT-202",
    tone: "amber",
    dayOffset: 0,
    time: "13:00 – 15:00",
    row: "8 / span 2",
    every: 4,
    offset: 3,
  },
]

function addDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setUTCDate(nextDate.getUTCDate() + days)
  return nextDate
}

function isInRange(date: Date) {
  return date >= mockStartDate && date <= mockEndDate
}

function formatShortDate(date: Date) {
  return dayjs(date).format("DD/MM")
}

function formatIsoDate(date: Date) {
  return dayjs(date).format("YYYY-MM-DD")
}

function formatWeekLabel(startDate: Date, endDate: Date) {
  return `${formatShortDate(startDate)} – ${dayjs(endDate).format("DD/MM/YYYY")}`
}

function getMonday(date: Date) {
  const day = date.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  return addDays(date, diff)
}

function getIsoWeekNumber(date: Date) {
  return dayjs(date).isoWeek()
}

function createWeek(weekStart: Date, weekIndex: number): TimetableWeek {
  const weekEnd = addDays(weekStart, 5)
  const displayStartDate = weekStart < mockStartDate ? mockStartDate : weekStart
  const displayEndDate = weekEnd > mockEndDate ? mockEndDate : weekEnd
  const days: TimetableDay[] = Array.from({ length: 6 }, (_, index) => {
    const date = addDays(weekStart, index)
    const isoDate = formatIsoDate(date)

    return {
      label: `Thứ ${index + 2}`,
      date: formatShortDate(date),
      isoDate,
      column: index + 2,
      today: isoDate === formatIsoDate(currentTimetableDate),
    }
  })

  const events = schedulePatterns.flatMap((pattern) => {
    const every = pattern.every ?? 1
    const offset = pattern.offset ?? 0
    const eventDate = addDays(weekStart, pattern.dayOffset)

    if (!isInRange(eventDate) || weekIndex % every !== offset) {
      return []
    }

    return [
      {
        time: pattern.time,
        title: pattern.title,
        room: pattern.room,
        tone: pattern.tone,
        column: pattern.dayOffset + 2,
        row: pattern.row,
      },
    ]
  })

  return {
    id: formatIsoDate(weekStart),
    weekNumber: getIsoWeekNumber(weekStart),
    label: formatWeekLabel(displayStartDate, displayEndDate),
    startDate: formatIsoDate(weekStart),
    endDate: formatIsoDate(weekEnd),
    days,
    events,
    legend: timetableLegend,
  }
}

function createTimetableWeeks() {
  const weeks: TimetableWeek[] = []
  let weekStart = getMonday(mockStartDate)

  while (weekStart <= mockEndDate) {
    weeks.push(createWeek(weekStart, weeks.length))
    weekStart = addDays(weekStart, 7)
  }

  return weeks
}

function getMonthId(date: Date) {
  return dayjs(date).format("YYYY-MM")
}

function getMonthLabel(date: Date) {
  return `Tháng ${dayjs(date).format("MM/YYYY")}`
}

function getMonthDateForWeek(week: TimetableWeek) {
  const startDate = new Date(`${week.startDate}T00:00:00.000Z`)

  if (startDate < mockStartDate) {
    return mockStartDate
  }

  return startDate
}

function createTimetableMonths(weeks: TimetableWeek[]) {
  return weeks.reduce<TimetableMonth[]>((months, week) => {
    const monthDate = getMonthDateForWeek(week)
    const id = getMonthId(monthDate)
    const month = months.find((item) => item.id === id)

    if (month) {
      month.weeks.push(week)
      month.rangeLabel = `${month.weeks[0].label.split(" – ")[0]} – ${
        month.weeks.at(-1)?.label.split(" – ")[1]
      }`
      return months
    }

    months.push({
      id,
      label: getMonthLabel(monthDate),
      rangeLabel: week.label,
      weeks: [week],
      legend: timetableLegend,
    })

    return months
  }, [])
}

export const timetableWeeks = createTimetableWeeks()

export const timetableMonths = createTimetableMonths(timetableWeeks)

export const currentTimetableWeekIndex = Math.max(
  0,
  timetableWeeks.findIndex(
    (week) =>
      week.startDate <= formatIsoDate(currentTimetableDate) &&
      week.endDate >= formatIsoDate(currentTimetableDate)
  )
)

export const currentTimetableMonthIndex = Math.max(
  0,
  timetableMonths.findIndex(
    (month) => month.id === getMonthId(currentTimetableDate)
  )
)
