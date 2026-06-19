import { Card } from "@/components/ui/card"
import { IconTint } from "@/components/icon-tint"
import { BadgeStatus } from "@/components/badge-status"
const recentQuizzes = [
  { title: "Quiz — Lesson 5: My Family", lesson: "Lesson 5", score: 9, maxScore: 10, date: "Hôm qua", iconTint: "green" as const },
  { title: "Quiz — Lesson 4: Colors", lesson: "Lesson 4", score: 8, maxScore: 10, date: "2 ngày trước", iconTint: "blue" as const },
  { title: "Quiz — Lesson 3: Greetings", lesson: "Lesson 3", score: 10, maxScore: 10, date: "3 ngày trước", iconTint: "green" as const },
  { title: "Quiz — Lesson 2: Numbers 1-20", lesson: "Lesson 2", score: 7, maxScore: 10, date: "5 ngày trước", iconTint: "amber" as const },
  { title: "Quiz — Lesson 1: Alphabet", lesson: "Lesson 1", score: 8, maxScore: 10, date: "1 tuần trước", iconTint: "blue" as const },
]
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
