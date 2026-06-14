import { Card } from "@/components/ui/card"
import { BadgeStatus } from "@/components/badge-status"

const attendanceData = [
  { day: "T2", present: 34, absent: 1 },
  { day: "T3", present: 33, absent: 2 },
  { day: "T4", present: 35, absent: 0 },
  { day: "T5", present: 32, absent: 3 },
  { day: "T6", present: 34, absent: 1 },
  { day: "T7", present: 33, absent: 2 },
]

const classAnnouncements = [
  {
    title: "Họp phụ huynh cuối kỳ",
    date: "20/06/2026",
    status: "warning" as const,
    label: "Sắp tới",
  },
  {
    title: "Thi học kỳ II",
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

export function TeacherDashboardRail() {
  const totalPresent = attendanceData.reduce((s, d) => s + d.present, 0)
  const totalSlots = attendanceData.reduce(
    (s, d) => s + d.present + d.absent,
    0
  )
  const avgRate = Math.round((totalPresent / totalSlots) * 100)

  return (
    <aside className="rail">
      {/* Weekly attendance summary */}
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

      {/* Quick class info */}
      <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
        <h2 className="mb-4 text-[16.5px] font-bold tracking-tight">
          Thông tin lớp 3A
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/50 p-3 text-center">
            <div className="text-[11px] text-muted-foreground">Tổng HS</div>
            <div
              className="text-[20px] font-extrabold"
              style={{ letterSpacing: "-0.01em" }}
            >
              35
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/50 p-3 text-center">
            <div className="text-[11px] text-muted-foreground">Điểm TB</div>
            <div
              className="text-[20px] font-extrabold text-success"
              style={{ letterSpacing: "-0.01em" }}
            >
              8.2
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/50 p-3 text-center">
            <div className="text-[11px] text-muted-foreground">Bài chờ chấm</div>
            <div
              className="text-[20px] font-extrabold text-danger"
              style={{ letterSpacing: "-0.01em" }}
            >
              12
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/50 p-3 text-center">
            <div className="text-[11px] text-muted-foreground">
              Học sinh giỏi
            </div>
            <div
              className="text-[20px] font-extrabold text-primary"
              style={{ letterSpacing: "-0.01em" }}
            >
              18
            </div>
          </div>
        </div>
      </Card>
    </aside>
  )
}
