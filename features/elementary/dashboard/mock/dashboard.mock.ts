export const teacherProfile = {
  name: "Cô Nguyễn Thị Mai",
  role: "Giáo viên môn Tiếng Anh",
  className: "Lớp 3A & 3B",
  semester: "Học kỳ II, năm học 2025 - 2026",
  dateLabel: "Thứ 7, 14/06/2026",
}

export const statCards = [
  {
    variant: "students" as const,
    label: "Học sinh giảng dạy",
    value: "59",
    detail: "Lớp 3A (31) · Lớp 3B (28)",
  },
  {
    variant: "lessons" as const,
    label: "Bài học hôm nay",
    value: "4",
    detail: "2 tiết 3A · 2 tiết 3B",
  },
  {
    variant: "quizzes" as const,
    label: "Quiz chờ chấm điểm",
    value: "8",
    detail: "Quiz Lesson 5 — 3A & 3B",
    danger: true,
  },
  {
    variant: "progress" as const,
    label: "Tiết dạy tuần này",
    value: "12/16",
    detail: "Hoàn thành 75%",
    progress: 75,
  },
]

export interface ScheduleSlot {
  time: string
  title: string
  lesson: string
  class: string
  room: string
  iconTint: "blue" | "green" | "amber" | "red"
  status?: "upcoming" | "done"
}

export const todaySchedule: ScheduleSlot[] = [
  {
    time: "07:30 – 08:10",
    title: "Tiếng Anh — Lớp 3A",
    lesson: "Lesson 5: My Family",
    class: "3A",
    room: "Phòng 201",
    iconTint: "blue",
    status: "done",
  },
  {
    time: "08:20 – 09:00",
    title: "Tiếng Anh — Lớp 3B",
    lesson: "Lesson 5: My Family",
    class: "3B",
    room: "Phòng 203",
    iconTint: "green",
    status: "done",
  },
  {
    time: "09:20 – 10:00",
    title: "Tiếng Anh — Lớp 3A",
    lesson: "Lesson 6: Colors",
    class: "3A",
    room: "Phòng 201",
    iconTint: "amber",
    status: "upcoming",
  },
  {
    time: "10:10 – 10:50",
    title: "Tiếng Anh — Lớp 3B",
    lesson: "Lesson 6: Colors",
    class: "3B",
    room: "Phòng 203",
    iconTint: "red",
    status: "upcoming",
  },
]

export interface Lesson {
  id: string
  title: string
  unit: number
  lessonNumber: number
  description: string
  totalWords: number
  quizCount: number
}

export const lessons: Lesson[] = [
  { id: "l1", title: "Alphabet & Sounds", unit: 1, lessonNumber: 1, description: "Chữ cái A-Z và phát âm cơ bản", totalWords: 26, quizCount: 2 },
  { id: "l2", title: "Numbers 1-20", unit: 1, lessonNumber: 2, description: "Số đếm từ 1 đến 20", totalWords: 20, quizCount: 2 },
  { id: "l3", title: "Greetings", unit: 2, lessonNumber: 3, description: "Lời chào hỏi hàng ngày", totalWords: 12, quizCount: 2 },
  { id: "l4", title: "Colors", unit: 2, lessonNumber: 4, description: "Màu sắc cơ bản", totalWords: 10, quizCount: 2 },
  { id: "l5", title: "My Family", unit: 3, lessonNumber: 5, description: "Gia đình và người thân", totalWords: 15, quizCount: 2 },
  { id: "l6", title: "Animals", unit: 3, lessonNumber: 6, description: "Động vật và âm thanh", totalWords: 18, quizCount: 2 },
  { id: "l7", title: "Food & Drinks", unit: 4, lessonNumber: 7, description: "Thức ăn và đồ uống", totalWords: 20, quizCount: 2 },
  { id: "l8", title: "Body Parts", unit: 4, lessonNumber: 8, description: "Các bộ phận cơ thể", totalWords: 16, quizCount: 2 },
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
    subtitle: "Hoàn thành Quiz Lesson 5 — Score: 9/10",
    time: "15 phút trước",
    iconTint: "green",
    icon: "check-circle",
  },
  {
    title: "Học sinh Lê Thị Hương",
    subtitle: "Nộp bài tập Vocabulary — Lesson 5",
    time: "30 phút trước",
    iconTint: "blue",
    icon: "file-text",
  },
  {
    title: "Phụ huynh Hoàng Văn Nam",
    subtitle: "Nhận xét về kết quả Quiz Lesson 4",
    time: "1 giờ trước",
    iconTint: "amber",
    icon: "message-circle",
  },
  {
    title: "Học sinh Phạm Thị Lan",
    subtitle: "Vắng mặt tiết Tiếng Anh — 3B",
    time: "2 giờ trước",
    iconTint: "red",
    icon: "alert-circle",
  },
  {
    title: "Học sinh Nguyễn Văn Đức",
    subtitle: "Hoàn thành Quiz Lesson 5 — Score: 8/10",
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
