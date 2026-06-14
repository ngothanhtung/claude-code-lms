export const teacherProfile = {
  name: "Cô Nguyễn Thị Mai",
  role: "Giáo viên chủ nhiệm",
  className: "Lớp 3A",
  semester: "Học kỳ II, năm học 2025 - 2026",
  dateLabel: "Thứ 7, 14/06/2026",
}

export const statCards = [
  {
    variant: "students" as const,
    label: "Học sinh lớp chủ nhiệm",
    value: "35",
    detail: "3A — Năm học 2025–2026",
  },
  {
    variant: "schedule" as const,
    label: "Tiết dạy hôm nay",
    value: "4",
    detail: "Tiết 1 → Tiết 4",
  },
  {
    variant: "submissions" as const,
    label: "Bài chờ chấm",
    value: "12",
    detail: "Bài nộp từ hôm qua",
    danger: true,
  },
  {
    variant: "attendance" as const,
    label: "Tỷ lệ chuyên cần",
    value: "94%",
    detail: "Tuần này",
    progress: 94,
  },
]

export interface ScheduleSlot {
  time: string
  title: string
  room: string
  iconTint: "blue" | "green" | "amber" | "red"
  status?: "upcoming" | "done"
}

export const todaySchedule: ScheduleSlot[] = [
  {
    time: "07:30 – 08:10",
    title: "Toán 3",
    room: "Phòng 201",
    iconTint: "blue",
    status: "done",
  },
  {
    time: "08:20 – 09:00",
    title: "Tiếng Việt 3",
    room: "Phòng 201",
    iconTint: "green",
    status: "done",
  },
  {
    time: "09:20 – 10:00",
    title: "Mỹ thuật 3",
    room: "Phòng Mỹ thuật",
    iconTint: "amber",
    status: "upcoming",
  },
  {
    time: "10:10 – 10:50",
    title: "Hoạt động trải nghiệm",
    room: "Sân trường",
    iconTint: "red",
    status: "upcoming",
  },
]

export interface ClassOverview {
  name: string
  grade: string
  studentCount: number
  avgScore: number
  topScore: number
  lowScore: number
  attendanceRate: number
}

export const classOverview: ClassOverview[] = [
  {
    name: "3A",
    grade: "3",
    studentCount: 35,
    avgScore: 8.2,
    topScore: 9.8,
    lowScore: 4.5,
    attendanceRate: 94,
  },
]

export interface RecentActivity {
  title: string
  subtitle: string
  time: string
  iconTint: "blue" | "green" | "amber" | "red"
  icon: string
}

export const recentActivities: RecentActivity[] = [
  {
    title: "Học sinh Trần Minh Tuấn",
    subtitle: "Nộp bài tập Toán — Chương 5",
    time: "15 phút trước",
    iconTint: "green",
    icon: "check-circle",
  },
  {
    title: "Học sinh Lê Thị Hương",
    subtitle: "Nộp bài tập Tiếng Việt — Tập đọc",
    time: "30 phút trước",
    iconTint: "blue",
    icon: "file-text",
  },
  {
    title: "Phụ huynh Hoàng Văn Nam",
    subtitle: "Nhận xét về kết quả học kỳ",
    time: "1 giờ trước",
    iconTint: "amber",
    icon: "message-circle",
  },
  {
    title: "Học sinh Phạm Thị Lan",
    subtitle: "Vắng mặt không phép — Tiết 3",
    time: "2 giờ trước",
    iconTint: "red",
    icon: "alert-circle",
  },
  {
    title: "Học sinh Nguyễn Văn Đức",
    subtitle: "Nộp bài tập Mỹ thuật — Vẽ tranh风景",
    time: "3 giờ trước",
    iconTint: "green",
    icon: "check-circle",
  },
]

export interface QuickAction {
  label: string
  href?: string
  tint: "blue" | "amber" | "indigo" | "red" | "green"
  icon: string
}

export const quickActions: QuickAction[] = [
  { label: "Điểm danh", tint: "green", icon: "check-square" },
  { label: "Giao bài tập", tint: "blue", icon: "clipboard-list" },
  { label: "Tạo quiz", href: "/elementary-teacher/quizzes", tint: "indigo", icon: "pen-square" },
  { label: "Xem lớp học", href: "/elementary-teacher/classes", tint: "amber", icon: "users" },
  { label: "Tài liệu", href: "/elementary-teacher/documents", tint: "red", icon: "file-text" },
  { label: "Nhóm học", href: "/elementary-teacher/groups", tint: "indigo", icon: "user-plus" },
  { label: "Thông báo PH", tint: "green", icon: "megaphone" },
  { label: "Xem báo cáo", tint: "blue", icon: "bar-chart-3" },
]

export interface StudentHighlight {
  name: string
  score: number
  avatar: string
  status: "excellent" | "good" | "needsAttention"
}

export const studentHighlights: StudentHighlight[] = [
  { name: "Trần Minh Tuấn", score: 9.5, avatar: "T", status: "excellent" },
  { name: "Lê Thị Hương", score: 9.2, avatar: "L", status: "excellent" },
  { name: "Nguyễn Văn Đức", score: 8.8, avatar: "N", status: "good" },
  { name: "Phạm Thị Lan", score: 6.2, avatar: "P", status: "needsAttention" },
  { name: "Hoàng Văn Nam", score: 5.8, avatar: "H", status: "needsAttention" },
]
