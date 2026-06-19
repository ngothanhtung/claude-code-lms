import { Card } from "@/components/ui/card"
import { IconTint } from "@/components/icon-tint"
import {
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  CheckCircleIcon,
  CircleIcon,
} from "lucide-react"
const leaderboard = [
  { rank: 1, name: "Lê Thị Hương", score: 9.2, avatar: "L" },
  { rank: 2, name: "Trần Minh Tuấn", score: 8.5, avatar: "T", isMe: true },
  { rank: 3, name: "Nguyễn Văn Đức", score: 8.3, avatar: "N" },
  { rank: 4, name: "Phạm Thị Lan", score: 7.8, avatar: "P" },
  { rank: 5, name: "Hoàng Văn Nam", score: 7.5, avatar: "H" },
]

const upcomingQuizzes = [
  { title: "Quiz — Lesson 6: Colors", lesson: "Lesson 6", deadline: "15/06/2026", questionCount: 10, iconTint: "amber" as const },
  { title: "Quiz — Lesson 7: Food & Drinks", lesson: "Lesson 7", deadline: "16/06/2026", questionCount: 10, iconTint: "green" as const },
  { title: "Quiz — Lesson 8: Body Parts", lesson: "Lesson 8", deadline: "18/06/2026", questionCount: 10, iconTint: "blue" as const },
]

const lessonProgress = [
  { lessonNumber: 1, title: "Alphabet & Sounds", score: 8.0, completed: true },
  { lessonNumber: 2, title: "Numbers 1-20", score: 7.5, completed: true },
  { lessonNumber: 3, title: "Greetings", score: 9.0, completed: true },
  { lessonNumber: 4, title: "Colors", score: 8.0, completed: true },
  { lessonNumber: 5, title: "My Family", score: 9.0, completed: true },
  { lessonNumber: 6, title: "Animals", score: 0, completed: false },
  { lessonNumber: 7, title: "Food & Drinks", score: 0, completed: false },
  { lessonNumber: 8, title: "Body Parts", score: 0, completed: false },
]

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

export function StudentDashboardRail() {
  return (
    <aside className="el-rail">
      {/* Leaderboard */}
      <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="m-0 flex items-center gap-2 text-[16.5px] font-bold tracking-tight">
            <TrophyIcon className="h-[18px] w-[18px] text-warning" />
            Bảng xếp hạng
          </h2>
          <span className="text-[13px] font-semibold text-primary hover:underline">
            Lớp 3A
          </span>
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
                {entry.name} {entry.isMe && <span className="text-primary">(Bạn)</span>}
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

      {/* Lesson progress */}
      <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
        <h2 className="mb-4 text-[16.5px] font-bold tracking-tight">
          Tiến độ bài học
        </h2>
        {lessonProgress.map((lp) => (
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
              {lp.completed && (
                <div className="h-[5px] overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-success"
                    style={{ width: `${(lp.score / 10) * 100}%` }}
                  />
                </div>
              )}
              {!lp.completed && (
                <div className="h-[5px] overflow-hidden rounded-full bg-muted" />
              )}
            </div>
          </div>
        ))}
      </Card>

      {/* Upcoming quizzes */}
      <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
        <h2 className="mb-4 flex items-center gap-2 text-[16.5px] font-bold tracking-tight">
          <ClockIcon className="h-[18px] w-[18px] text-info" />
          Quiz sắp tới
        </h2>
        {upcomingQuizzes.map((quiz) => (
          <div
            key={quiz.title}
            className="flex items-center gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0"
          >
            <IconTint
              variant={quiz.iconTint}
              className="h-[34px] w-[34px] rounded-[9px]"
            >
              <BookOpenIcon className="h-[14px] w-[14px]" />
            </IconTint>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold">{quiz.title}</div>
              <div className="text-[12px] text-muted-foreground">
                {quiz.questionCount} câu · Hạn: {quiz.deadline}
              </div>
            </div>
          </div>
        ))}
      </Card>
    </aside>
  )
}
