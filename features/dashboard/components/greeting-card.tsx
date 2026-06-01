import { CalendarCheck2Icon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface GreetingCardProps {
  userName: string
  semester: string
  dateLabel?: string
}

export function GreetingCard({
  userName,
  semester,
  dateLabel = "Thứ 6, 29/05/2026",
}: GreetingCardProps) {
  return (
    <Card
      className="flex-row items-center justify-between gap-4 rounded-[var(--radius)] border border-[hsl(243_50%_91%)] bg-[linear-gradient(180deg,#fff,#fff)] px-6 py-5 shadow-none ring-0"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 100% at 105% -10%, oklch(0.96 0.04 277 / 0.08) 0%, transparent 55%), linear-gradient(180deg, #fff, #fff)",
        backgroundSize: "100% 100%",
      }}
    >
      <div>
        <h1
          className="m-0 text-[25px] font-extrabold tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Xin chào, {userName}!
        </h1>
        <p className="mt-[5px] text-[14px] text-muted-foreground">{semester}</p>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-primary shadow-[var(--shadow-sm)]">
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
