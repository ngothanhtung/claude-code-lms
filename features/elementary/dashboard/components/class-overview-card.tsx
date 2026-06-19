import { Card } from "@/components/ui/card"
import { BadgeStatus } from "@/components/badge-status"
const studentHighlights: { name: string; score: number; avatar: string; status: "excellent" | "good" | "needsAttention" }[] = [
  { name: "Trần Minh Tuấn", score: 9.5, avatar: "T", status: "excellent" },
  { name: "Lê Thị Hương", score: 9.2, avatar: "L", status: "excellent" },
  { name: "Nguyễn Văn Đức", score: 8.8, avatar: "N", status: "good" },
  { name: "Phạm Thị Lan", score: 6.2, avatar: "P", status: "needsAttention" },
  { name: "Hoàng Văn Nam", score: 5.8, avatar: "H", status: "needsAttention" },
]

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

function getStatusVariant(status: "excellent" | "good" | "needsAttention") {
  switch (status) {
    case "excellent":
      return "success" as const
    case "good":
      return "info" as const
    case "needsAttention":
      return "warning" as const
  }
}

function getStatusLabel(status: "excellent" | "good" | "needsAttention") {
  switch (status) {
    case "excellent":
      return "Xuất sắc"
    case "good":
      return "Khá"
    case "needsAttention":
      return "Cần theo dõi"
  }
}

export function ClassOverviewCard() {
  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
          Tổng quan lớp 3A
        </h2>
        <span className="text-[13px] font-semibold text-primary hover:underline">
          35 HS
        </span>
      </div>

      {/* Class stats row */}
      <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl border border-border bg-muted/50 p-3">
        <div className="text-center">
          <div className="text-[11px] text-muted-foreground">Điểm TB</div>
          <div
            className="text-[18px] font-extrabold"
            style={{ letterSpacing: "-0.01em" }}
          >
            8.2
          </div>
        </div>
        <div className="border-x border-border text-center">
          <div className="text-[11px] text-muted-foreground">Cao nhất</div>
          <div
            className="text-[18px] font-extrabold text-success"
            style={{ letterSpacing: "-0.01em" }}
          >
            9.8
          </div>
        </div>
        <div className="text-center">
          <div className="text-[11px] text-muted-foreground">Thấp nhất</div>
          <div
            className="text-[18px] font-extrabold text-danger"
            style={{ letterSpacing: "-0.01em" }}
          >
            4.5
          </div>
        </div>
      </div>

      {/* Student highlights */}
      <div className="mb-3 text-[12.5px] font-semibold text-muted-foreground uppercase tracking-wide">
        Học sinh nổi bật
      </div>
      {studentHighlights.map((student) => (
        <div
          key={student.name}
          className="flex items-center gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0"
        >
          <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-primary-muted text-[12px] font-bold text-primary">
            {getInitials(student.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-semibold">{student.name}</div>
            <div className="text-[12px] text-muted-foreground">
              Điểm: {student.score.toFixed(1)}
            </div>
          </div>
          <BadgeStatus variant={getStatusVariant(student.status)}>
            {getStatusLabel(student.status)}
          </BadgeStatus>
        </div>
      ))}
    </Card>
  )
}
