import { GreetingCard } from "@/components/greeting-card"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { StatCardDashboard } from "@/components/stat-card-dashboard"
import { DashboardRail } from "@/components/dashboard-rail"
import { TodayEvents } from "@/features/calendars/components/today-events"
import { Courses } from "@/features/courses/components/courses"
import { TodayTasks } from "@/features/tasks/components/today-tasks"

export default function DashboardPage() {
  return (
    <>
      <div className="col-main">
        <GreetingCard
          userName="Ngô Thanh Tùng"
          semester="Học kỳ II, năm học 2025 - 2026"
          dateLabel="Thứ 6, 29/05/2026"
        />

        <div className="grid grid-cols-4 gap-4 max-[1320px]:grid-cols-2 max-[680px]:grid-cols-2">
          <StatCardDashboard variant="gpa" />
          <StatCardDashboard variant="credits" />
          <StatCardDashboard variant="semester" />
          <StatCardDashboard variant="todos" />
        </div>

        <AnnouncementBanner
          title="Thông báo quan trọng"
          message="Sinh viên khóa K21 đăng ký học phần học kỳ III từ ngày 20/05 – 30/05/2026. Xem chi tiết tại đây"
          href="#"
        />

        <div className="grid grid-cols-2 items-stretch gap-5 max-[980px]:grid-cols-1">
          <TodayTasks />
          <TodayEvents />
        </div>

        <Courses />
      </div>

      <DashboardRail />
    </>
  )
}
