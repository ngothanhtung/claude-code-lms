import { StudentGreetingCard } from "@/features/elementary/dashboard/components/student-greeting-card"
import { StudentStatCard } from "@/features/elementary/dashboard/components/student-stat-card"
import { StudentSchedule } from "@/features/elementary/dashboard/components/student-schedule"
import { RecentQuizResults } from "@/features/elementary/dashboard/components/recent-quiz-results"
import { MyGroupCard } from "@/features/elementary/dashboard/components/my-group-card"
import { StudentQuickActions } from "@/features/elementary/dashboard/components/student-quick-actions"
import { StudentDashboardRail } from "@/features/elementary/dashboard/components/student-dashboard-rail"

export default function DashboardPage() {
  return (
    <>
      <div className="el-col-main">
        <StudentGreetingCard
          userName="Trần Minh Tuấn"
          className="Lớp 3A"
          semester="Học kỳ II, năm học 2025 - 2026"
          dateLabel="Thứ 7, 14/06/2026"
        />

        <div className="el-dash-grid-4">
          <StudentStatCard variant="lessons" />
          <StudentStatCard variant="score" />
          <StudentStatCard variant="streak" />
          <StudentStatCard variant="group" />
        </div>

        <div className="el-dash-grid-2">
          <StudentSchedule />
          <RecentQuizResults />
        </div>

        <StudentQuickActions />

        <MyGroupCard />
      </div>

      <StudentDashboardRail />
    </>
  )
}
