import { Card } from "@/components/ui/card"
import { BadgeStatus } from "@/components/badge-status"
import {
  CheckCircleIcon,
} from "lucide-react"
import { lessons } from "@/features/elementary/dashboard/mock"

const classAnnouncements = [
  {
    title: "Họp phụ huynh cuối kỳ",
    date: "20/06/2026",
    status: "warning" as const,
    label: "Sắp tới",
  },
  {
    title: "Thi cuối kỳ Tiếng Anh",
    date: "16/06 – 18/06/2026",
    status: "info" as const,
    label: "3 ngày nữa",
  },
  {
    title: "Nộp điểm tổng kết",
    date: "25/06/2026",
    status: "destructive" as const,
    label: "Hạn chót",
  },
]

const attendanceData = [
  { day: "T2", present: 57, absent: 2 },
  { day: "T3", present: 56, absent: 3 },
  { day: "T4", present: 59, absent: 0 },
  { day: "T5", present: 55, absent: 4 },
  { day: "T6", present: 57, absent: 2 },
  { day: "T7", present: 56, absent: 3 },
]

export function TeacherDashboardRail() {
  const totalPresent = attendanceData.reduce((s, d) => s + d.present, 0)
  const totalSlots = attendanceData.reduce(
    (s, d) => s + d.present + d.absent,
    0
  )
  const avgRate = Math.round((totalPresent / totalSlots) * 100)

  return (
    <aside className="rail">
      {/* Lesson progress */}
      <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
        <h2 className="mb-4 text-[16.5px] font-bold tracking-tight">
          Tiến độ chương trình
        </h2>
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-center gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0"
          >
            <div className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-[7px] bg-success-muted text-success">
              <CheckCircleIcon className="h-[14px] w-[14px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold">
                L{lesson.lessonNumber}: {lesson.title}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {lesson.totalWords} từ · {lesson.quizCount} quiz
              </div>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              Unit {lesson.unit}
            </span>
          </div>
        ))}
      </Card>

      {/* Weekly attendance */}
      <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
            Chuyên cần tuần
          </h2>
          <span
            className="text-[18px] font-extrabold text-success"
            style={{ letterSpacing: "-0.01em" }}
          >
            {avgRate}%
          </span>
        </div>
        <div className="flex items-end gap-[6px]">
          {attendanceData.map((d) => {
            const rate = Math.round(
              (d.present / (d.present + d.absent)) * 100
            )
            const barHeight = Math.max(12, (rate / 100) * 56)
            return (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-[6px]">
                <div
                  className="w-full rounded-[4px] bg-success-muted"
                  style={{ height: barHeight }}
                >
                  <div
                    className="w-full rounded-[4px] bg-success"
                    style={{ height: `${rate}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {d.day}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 grid grid-cols-2 border-t border-border pt-4">
          <div className="text-center">
            <div className="text-[12px] text-muted-foreground">Có mặt</div>
            <div
              className="mt-[3px] text-[22px] font-extrabold text-success"
              style={{ letterSpacing: "-0.01em" }}
            >
              {totalPresent}
            </div>
          </div>
          <div className="border-l border-border text-center">
            <div className="text-[12px] text-muted-foreground">Vắng mặt</div>
            <div
              className="mt-[3px] text-[22px] font-extrabold text-danger"
              style={{ letterSpacing: "-0.01em" }}
            >
              {totalSlots - totalPresent}
            </div>
          </div>
        </div>
      </Card>

      {/* Upcoming events */}
      <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
        <h2 className="mb-4 text-[16.5px] font-bold tracking-tight">
          Sự kiện sắp tới
        </h2>
        {classAnnouncements.map((event) => (
          <div
            key={event.title}
            className="flex items-center gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0"
          >
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold">{event.title}</div>
              <div className="text-[12px] text-muted-foreground">
                {event.date}
              </div>
            </div>
            <BadgeStatus variant={event.status}>{event.label}</BadgeStatus>
          </div>
        ))}
      </Card>
    </aside>
  )
}
