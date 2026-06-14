import { TeacherGreetingCard } from "@/features/elementary/dashboard/components/teacher-greeting-card"
import { TeacherStatCard } from "@/features/elementary/dashboard/components/teacher-stat-card"
import { TodaySchedule } from "@/features/elementary/dashboard/components/today-schedule"
import { ClassOverviewCard } from "@/features/elementary/dashboard/components/class-overview-card"
import { RecentSubmissions } from "@/features/elementary/dashboard/components/recent-submissions"
import { TeacherQuickActions } from "@/features/elementary/dashboard/components/teacher-quick-actions"
import { TeacherDashboardRail } from "@/features/elementary/dashboard/components/teacher-dashboard-rail"

export default function DashboardPage() {
  return (
    <>
      <div className="col-main">
        <TeacherGreetingCard
          userName="Nguyễn Thị Mai"
          role="Giáo viên môn Tiếng Anh"
          className="Lớp 3A & 3B"
          semester="Học kỳ II, năm học 2025 - 2026"
          dateLabel="Thứ 7, 14/06/2026"
        />

        <div className="grid grid-cols-4 gap-4 max-[1320px]:grid-cols-2 max-[680px]:grid-cols-2">
          <TeacherStatCard variant="students" />
          <TeacherStatCard variant="lessons" />
          <TeacherStatCard variant="quizzes" />
          <TeacherStatCard variant="progress" />
        </div>

        <div className="grid grid-cols-2 items-stretch gap-5 max-[980px]:grid-cols-1">
          <TodaySchedule />
          <ClassOverviewCard />
        </div>

        <TeacherQuickActions />

        <RecentSubmissions />
      </div>

      <TeacherDashboardRail />
    </>
  )
}
