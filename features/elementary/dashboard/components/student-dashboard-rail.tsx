import { Card } from "@/components/ui/card"
import { IconTint } from "@/components/icon-tint"
import {
  TrophyIcon,
  BookOpenIcon,
  CheckCircleIcon,
  CircleIcon,
} from "lucide-react"

interface StudentDashboardRailProps {
  leaderboard: {
    rank: number
    name: string
    score: number
    avatar: string
    isMe: boolean
  }[]
  lessons: {
    lessonNumber: number
    title: string
    score: number
    completed: boolean
  }[]
}

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

export function StudentDashboardRail({
  leaderboard,
  lessons,
}: StudentDashboardRailProps) {
  return (
    <aside className="el-rail">
      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="m-0 flex items-center gap-2 text-[16.5px] font-bold tracking-tight">
              <TrophyIcon className="h-[18px] w-[18px] text-warning" />
              Bảng xếp hạng
            </h2>
          </div>

          {leaderboard.map((entry) => (
            <div
              key={entry.name}
              className={`flex items-center gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0 ${
                entry.isMe ? "rounded-lg bg-primary-muted/50 -mx-2 px-2" : ""
              }`}
            >
              <div
                className={`grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-[11px] font-extrabold ${
                  entry.rank <= 3
                    ? "bg-warning text-warning-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {entry.rank}
              </div>
              <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-primary-muted text-[12px] font-bold text-primary">
                {getInitials(entry.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold">
                  {entry.name}{" "}
                  {entry.isMe && <span className="text-primary">(Bạn)</span>}
                </div>
              </div>
              <span
                className="text-[14px] font-extrabold"
                style={{ letterSpacing: "-0.01em" }}
              >
                {entry.score.toFixed(1)}
              </span>
            </div>
          ))}
        </Card>
      )}

      {/* Lesson progress */}
      {lessons.length > 0 && (
        <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
          <h2 className="mb-4 text-[16.5px] font-bold tracking-tight">
            Tiến độ bài học
          </h2>
          {lessons.map((lp) => (
            <div
              key={lp.lessonNumber}
              className="flex items-center gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0"
            >
              <IconTint
                variant={lp.completed ? "green" : "blue"}
                className="h-[30px] w-[30px] rounded-[8px]"
              >
                {lp.completed ? (
                  <CheckCircleIcon className="h-[13px] w-[13px]" />
                ) : (
                  <CircleIcon className="h-[13px] w-[13px]" />
                )}
              </IconTint>
              <div className="min-w-0 flex-1">
                <div className="mb-[4px] flex items-center justify-between">
                  <span className="text-[12px] font-semibold">
                    Lesson {lp.lessonNumber}: {lp.title}
                  </span>
                  {lp.completed ? (
                    <span
                      className="text-[13px] font-extrabold text-success"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {lp.score.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Chưa học
                    </span>
                  )}
                </div>
                {lp.completed ? (
                  <div className="h-[5px] overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-success"
                      style={{ width: `${(lp.score / 10) * 100}%` }}
                    />
                  </div>
                ) : (
                  <div className="h-[5px] overflow-hidden rounded-full bg-muted" />
                )}
              </div>
            </div>
          ))}
        </Card>
      )}
    </aside>
  )
}
