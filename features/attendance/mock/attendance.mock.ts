// features/attendance/mock/attendance.mock.ts

export interface CourseAttendance {
  id: string
  name: string
  code: string
  present: number
  total: number
  late: number
  absent: number
  icon: string
  color: string // "indigo" | "green" | "blue" | "amber" | "red"
}

export interface SessionLog {
  id: string
  date: string // "29"
  month: string // "Th5"
  courseName: string
  courseCode: string
  time: string
  room: string
  status: "present" | "late" | "absent"
}

export interface TodayClass {
  courseName: string
  courseCode: string
  time: string
  room: string
  lecturer: string
}

export const INITIAL_COURSES: CourseAttendance[] = [
  {
    id: "1",
    name: "Lập trình Java nâng cao",
    code: "INT2204",
    present: 12,
    total: 12,
    late: 0,
    absent: 0,
    icon: "coffee",
    color: "indigo",
  },
  {
    id: "2",
    name: "Cơ sở dữ liệu",
    code: "INT2211",
    present: 11,
    total: 12,
    late: 1,
    absent: 0,
    icon: "database",
    color: "green",
  },
  {
    id: "3",
    name: "Mạng máy tính",
    code: "INT2215",
    present: 10,
    total: 12,
    late: 2,
    absent: 0,
    icon: "network",
    color: "blue",
  },
  {
    id: "4",
    name: "Phát triển ứng dụng web",
    code: "INT2208",
    present: 10,
    total: 12,
    late: 0,
    absent: 1,
    icon: "globe",
    color: "amber",
  },
  {
    id: "5",
    name: "Tiếng Anh chuyên ngành",
    code: "FLF1107",
    present: 9,
    total: 12,
    late: 1,
    absent: 1,
    icon: "languages",
    color: "red",
  },
]

export const INITIAL_SESSIONS: SessionLog[] = [
  {
    id: "s1",
    date: "29",
    month: "Th5",
    courseName: "Mạng máy tính",
    courseCode: "INT2215",
    time: "07:00–09:30",
    room: "P.301-G2",
    status: "present",
  },
  {
    id: "s2",
    date: "28",
    month: "Th5",
    courseName: "Tiếng Anh chuyên ngành",
    courseCode: "FLF1107",
    time: "09:45–11:15",
    room: "P.110-G2",
    status: "late",
  },
  {
    id: "s3",
    date: "27",
    month: "Th5",
    courseName: "Phát triển ứng dụng web",
    courseCode: "INT2208",
    time: "13:00–15:30",
    room: "P.208-G2",
    status: "absent",
  },
  {
    id: "s4",
    date: "26",
    month: "Th5",
    courseName: "Lập trình Java nâng cao",
    courseCode: "INT2204",
    time: "07:00–09:30",
    room: "P.302-G2",
    status: "present",
  },
  {
    id: "s5",
    date: "25",
    month: "Th5",
    courseName: "Cơ sở dữ liệu",
    courseCode: "INT2211",
    time: "13:00–15:30",
    room: "P.205-G2",
    status: "present",
  },
]

export const TODAY_CLASS: TodayClass = {
  courseName: "Cơ sở dữ liệu",
  courseCode: "INT2211",
  time: "13:00–15:30",
  room: "P.205-G2",
  lecturer: "PGS. Trần Thị Bình",
}
