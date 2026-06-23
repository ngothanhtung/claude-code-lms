"use client"

import { useStudentDashboardData } from "@/features/elementary/dashboard/hooks/use-student-dashboard-data"
import { StudentGreetingCard } from "@/features/elementary/dashboard/components/student-greeting-card"
import { StudentStatCard } from "@/features/elementary/dashboard/components/student-stat-card"
import { RecentQuizResults } from "@/features/elementary/dashboard/components/recent-quiz-results"
import { MyGroupCard } from "@/features/elementary/dashboard/components/my-group-card"
import { StudentDashboardRail } from "@/features/elementary/dashboard/components/student-dashboard-rail"

export default function DashboardPage() {
  const { data, loading } = useStudentDashboardData()

  if (loading || !data) {
    return (
      <div className="el-loading">
        <div className="el-spinner" />
        <span>Đang tải dữ liệu...</span>
      </div>
    )
  }

  return (
    <>
      <div className="el-col-main">
        <StudentGreetingCard
          userName={data.userName}
          className={data.className}
          semester="Học kỳ II, năm học 2025 - 2026"
          dateLabel={new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        />

        <div className="el-dash-grid-4">
          <StudentStatCard
            variant="lessons"
            lessons={data.lessons}
            totalLessons={data.totalLessons}
          />
          <StudentStatCard
            variant="score"
            averageScore={data.averageScore}
          />
          <StudentStatCard
            variant="streak"
            lessons={data.lessons}
          />
          <StudentStatCard
            variant="group"
            groupName={data.groupName}
            groupCompletedQuizzes={data.groupCompletedQuizzes}
            groupTotalQuizzes={data.groupTotalQuizzes}
          />
        </div>

        <RecentQuizResults recentQuizzes={data.recentQuizzes} />

        {data.myGroup && (
          <MyGroupCard
            name={data.myGroup.name}
            members={data.myGroup.members}
            completedLessons={data.myGroup.completedLessons}
            totalLessons={data.myGroup.totalLessons}
            averageScore={data.myGroup.averageScore}
          />
        )}
      </div>

      <StudentDashboardRail
        leaderboard={data.leaderboard}
        lessons={data.lessons}
      />
    </>
  )
}
