import { Card } from "@/components/ui/card"

interface MyGroupCardProps {
  name: string
  members: { name: string; avatar: string }[]
  completedLessons: number
  totalLessons: number
  averageScore: number
}

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

export function MyGroupCard({
  name,
  members,
  completedLessons,
  totalLessons,
  averageScore,
}: MyGroupCardProps) {
  const progress = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0

  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
          Nhóm của mình
        </h2>
        <span className="text-[13px] font-semibold text-primary hover:underline">
          {name}
        </span>
      </div>

      {/* Members */}
      <div className="mb-4 flex items-center gap-3">
        {members.map((member) => (
          <div key={member.name} className="flex items-center gap-2">
            <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-primary-muted text-[12px] font-bold text-primary">
              {getInitials(member.name)}
            </div>
            <span className="text-[12.5px] font-semibold">{member.name}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mb-3 grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/50 p-3">
        <div className="text-center">
          <div className="text-[11px] text-muted-foreground">
            Bài học hoàn thành
          </div>
          <div
            className="text-[18px] font-extrabold"
            style={{ letterSpacing: "-0.01em" }}
          >
            {completedLessons}/{totalLessons}
          </div>
        </div>
        <div className="border-l border-border text-center">
          <div className="text-[11px] text-muted-foreground">
            Điểm TB nhóm
          </div>
          <div
            className="text-[18px] font-extrabold text-success"
            style={{ letterSpacing: "-0.01em" }}
          >
            {averageScore}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-[4px] h-[7px] overflow-hidden rounded-full bg-[oklch(0.965_0_0)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,hsl(262_83%_58%),hsl(262_83% 50%))]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-[8px] text-center text-[12px] font-medium text-muted-foreground">
        {progress}% hoàn thành
      </div>
    </Card>
  )
}
