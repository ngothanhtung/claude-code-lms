export type TaskIcon =
  | "file-question"
  | "terminal"
  | "help-circle"
  | "book-open"
  | "calendar-clock"
  | "circle-dollar-sign"
  | "folder-git-2"

export type TaskIconTint = "red" | "amber" | "blue" | "indigo" | "green"

export type TaskBadgeVariant = "destructive" | "warning" | "info" | "success"

export interface TodayTask {
  icon: TaskIcon
  iconTint: TaskIconTint
  title: string
  subtitle: string
  badge: {
    label: string
    variant: TaskBadgeVariant
  }
  dueTime: string
  action: string
  actionVariant?: "primary" | "default"
}

export const todayTasks: TodayTask[] = [
  {
    icon: "file-question",
    iconTint: "red",
    title: "Nộp Assignment OOP – Bài tập lớn chương 3",
    subtitle: "Lập trình hướng đối tượng",
    badge: { label: "Hạn hôm nay", variant: "destructive" },
    dueTime: "23:59",
    action: "Nộp bài",
    actionVariant: "primary",
  },
  {
    icon: "terminal",
    iconTint: "red",
    title: "Nộp Lab 1 – Build REST API với Claude Code",
    subtitle: "Claude Code for BackEnd",
    badge: { label: "Còn 4 giờ", variant: "warning" },
    dueTime: "22:00",
    action: "Nộp bài",
    actionVariant: "primary",
  },
  {
    icon: "help-circle",
    iconTint: "amber",
    title: "Quiz Java - Quiz 2",
    subtitle: "Lập trình Java",
    badge: { label: "Còn 2 giờ", variant: "warning" },
    dueTime: "20:00",
    action: "Làm quiz",
  },
  {
    icon: "book-open",
    iconTint: "blue",
    title: "Đọc tài liệu trước buổi học",
    subtitle: "Cơ sở dữ liệu",
    badge: { label: "Ngày mai", variant: "info" },
    dueTime: "21/05",
    action: "Xem ngay",
  },
  {
    icon: "calendar-clock",
    iconTint: "indigo",
    title: "Lịch thi giữa kỳ CTDL&GT",
    subtitle: "Cấu trúc dữ liệu và giải thuật",
    badge: { label: "Ngày mai", variant: "info" },
    dueTime: "21/05",
    action: "Xem lịch thi",
  },
  {
    icon: "circle-dollar-sign",
    iconTint: "green",
    title: "Đóng học phí học kỳ II",
    subtitle: "Phòng Tài chính",
    badge: { label: "Còn 5 ngày", variant: "success" },
    dueTime: "25/05",
    action: "Thanh toán",
  },
  {
    icon: "folder-git-2",
    iconTint: "indigo",
    title: "Đọc yêu cầu đồ án cuối kỳ",
    subtitle: "Lập trình hướng đối tượng",
    badge: { label: "Còn 20 ngày", variant: "success" },
    dueTime: "09/06",
    action: "Xem ngay",
  },
]
