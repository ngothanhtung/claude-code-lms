export type NotificationIcon =
  | "file-text"
  | "bar-chart-3"
  | "megaphone"
  | "calendar-heart"

export type NotificationTint = "indigo" | "green" | "amber" | "red"

export interface RecentNotification {
  icon: NotificationIcon
  iconTint: NotificationTint
  title: string
  subtitle: string
  time: string
  unread?: boolean
}

export const recentNotifications: RecentNotification[] = [
  {
    icon: "file-text",
    iconTint: "indigo",
    title: "Giảng viên thông báo bài tập mới",
    subtitle: "Lập trình Java - Bài tập số 4",
    time: "10 phút trước",
    unread: true,
  },
  {
    icon: "bar-chart-3",
    iconTint: "green",
    title: "Điểm mới được công bố",
    subtitle: "Cơ sở dữ liệu - Quiz 1",
    time: "1 giờ trước",
  },
  {
    icon: "megaphone",
    iconTint: "amber",
    title: "Thông báo từ Phòng Đào tạo",
    subtitle: "Về việc đăng ký học phần học kỳ III",
    time: "3 giờ trước",
  },
  {
    icon: "calendar-heart",
    iconTint: "red",
    title: "Sự kiện sắp diễn ra",
    subtitle: "Ngày hội việc làm mùa Hè 2026",
    time: "1 ngày trước",
  },
]
