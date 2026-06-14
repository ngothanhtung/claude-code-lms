import { CalendarCheck2Icon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface TeacherGreetingCardProps {
  userName: string
  role: string
  className: string
  semester: string
  dateLabel?: string
}

export function TeacherGreetingCard({
  userName,
  role,
  className,
  semester,
  dateLabel = "Thứ 7, 14/06/2026",
}: TeacherGreetingCardProps) {
  return (
    <Card
      className="greeting-card flex-row items-center justify-between gap-4 rounded-[var(--radius)] border border-primary/20 bg-card px-6 py-5 shadow-none ring-0"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 100% at 105% -10%, hsl(var(--primary) / 0.06) 0%, transparent 55%)",
      }}
    >
      <div>
        <h1
          className="m-0 text-[25px] font-extrabold tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Xin chào, {userName}!
        </h1>
        <p className="mt-[5px] text-[14px] text-muted-foreground">
          {role} · {className} · {semester}
        </p>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-primary shadow-[var(--shadow-sm)]">
        <CalendarCheck2Icon className="h-[18px] w-[18px]" />
        <div>
          <div className="text-[11.5px] font-medium text-muted-foreground">
            Hôm nay
          </div>
          <div className="text-[14px] font-bold whitespace-nowrap text-foreground">
            {dateLabel}
          </div>
        </div>
      </div>
    </Card>
  )
}
