import {
  BarChart3Icon,
  BookOpenIcon,
  UploadIcon,
  VideoIcon,
} from "lucide-react"
import { ActivityItem } from "@/components/activity-item"
import { QuickActions } from "@/components/quick-actions"
import { DonutChart } from "@/components/donut-chart"
import { RecentNotifications } from "@/features/notifications/components/recent-notifications"
import Link from "next/link"
import { Card } from "@/components/ui/card"

const donutSegments = [
  { value: 12, color: "oklch(0.63 0.19 152)" },
  { value: 6, color: "oklch(0.60 0.18 250)" },
  { value: 2, color: "oklch(0.70 0.18 75)" },
  { value: 1, color: "oklch(0.55 0.22 27)" },
]

export function DashboardRail() {
  return (
    <aside className="rail">
      {/* Notifications */}
      <RecentNotifications />

      {/* Results */}
      <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
            Kết quả học tập
          </h2>
          <Link
            href="/results"
            className="text-[13px] font-semibold text-primary hover:underline"
          >
            Xem chi tiết
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <DonutChart
            segments={donutSegments}
            centerLabel="21"
            centerSub="môn học"
          />
          <div className="flex flex-1 flex-col gap-[9px]">
            <div className="flex items-center gap-2 text-[12.5px]">
              <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-[oklch(0.63_0.19_152)]" />
              <span className="flex-1 font-medium">Tốt (A, B)</span>
              <span className="text-[12px] font-semibold text-muted-foreground">
                12 môn (57%)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12.5px]">
              <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-[oklch(0.60_0.18_250)]" />
              <span className="flex-1 font-medium">Khá (C)</span>
              <span className="text-[12px] font-semibold text-muted-foreground">
                6 môn (29%)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12.5px]">
              <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-[oklch(0.70_0.18_75)]" />
              <span className="flex-1 font-medium">Trung bình (D)</span>
              <span className="text-[12px] font-semibold text-muted-foreground">
                2 môn (10%)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12.5px]">
              <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-[oklch(0.55_0.22_27)]" />
              <span className="flex-1 font-medium">Yếu (F)</span>
              <span className="text-[12px] font-semibold text-muted-foreground">
                1 môn (4%)
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 border-t border-border pt-4">
          <div className="text-center">
            <div className="text-[12px] text-muted-foreground">
              CPA hiện tại
            </div>
            <div
              className="mt-[3px] text-[22px] font-extrabold"
              style={{ letterSpacing: "-0.01em" }}
            >
              3.38
            </div>
          </div>
          <div className="border-l border-border text-center">
            <div className="text-[12px] text-muted-foreground">Xếp loại</div>
            <div
              className="mt-[3px] text-[22px] font-extrabold text-primary"
              style={{ letterSpacing: "-0.01em" }}
            >
              Khá
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
        <h2 className="mb-4 text-[16.5px] font-bold tracking-tight">
          Thao tác nhanh
        </h2>
        <QuickActions />
      </Card>

      {/* Activity */}
      <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
        <h2 className="mb-0 text-[16.5px] font-bold tracking-tight">
          Hoạt động gần đây
        </h2>
        <ActivityItem
          icon={<BookOpenIcon className="h-[14px] w-[14px]" />}
          iconTint="red"
          title="Bạn đã xem tài liệu"
          subtitle="Lecture 3 - OOP Principles.pdf"
          time="2 giờ trước"
        />
        <ActivityItem
          icon={<UploadIcon className="h-[14px] w-[14px]" />}
          iconTint="green"
          title="Bạn đã nộp bài tập"
          subtitle="BTL_OOP_Chuong2.zip"
          time="Hôm qua"
        />
        <ActivityItem
          icon={<VideoIcon className="h-[14px] w-[14px]" />}
          iconTint="blue"
          title="Bạn đã tham gia lớp học"
          subtitle="CSDL - Online Class"
          time="Hôm qua"
        />
        <ActivityItem
          icon={<BarChart3Icon className="h-[14px] w-[14px]" />}
          iconTint="amber"
          title="Bạn đã xem điểm"
          subtitle="Quiz 1 - Cơ sở dữ liệu"
          time="2 ngày trước"
        />
      </Card>
    </aside>
  )
}
