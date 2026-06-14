import { Card } from "@/components/ui/card"
import { IconTint } from "@/components/icon-tint"
import { BadgeStatus } from "@/components/badge-status"
import { recentQuizzes } from "@/features/elementary/dashboard/mock/student-dashboard.mock"
import {
  LanguagesIcon,
} from "lucide-react"

function getScoreVariant(score: number) {
  if (score >= 9) return "success" as const
  if (score >= 7) return "info" as const
  return "warning" as const
}

function getScoreLabel(score: number) {
  if (score >= 9) return "Giỏi"
  if (score >= 7) return "Khá"
  return "Trung bình"
}

export function RecentQuizResults() {
  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
          Kết quả quiz gần đây
        </h2>
        <span className="text-[13px] font-semibold text-primary hover:underline">
          Xem tất cả
        </span>
      </div>

      {recentQuizzes.map((quiz) => (
          <div
            key={`${quiz.date}-${quiz.title}`}
            className="flex items-center gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0"
          >
            <IconTint
              variant={quiz.iconTint}
              className="h-[34px] w-[34px] rounded-[9px]"
            >
              <LanguagesIcon className="h-[14px] w-[14px]" />
            </IconTint>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold">{quiz.title}</div>
              <div className="text-[12px] text-muted-foreground">
                {quiz.score}/{quiz.maxScore} · {quiz.date}
              </div>
            </div>
            <BadgeStatus variant={getScoreVariant(quiz.score)}>
              {getScoreLabel(quiz.score)}
            </BadgeStatus>
          </div>
        )
      )}
    </Card>
  )
}
