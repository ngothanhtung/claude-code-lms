import Link from "next/link"
import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarClockIcon,
  CircleDollarSignIcon,
  FileQuestionIcon,
  FolderGit2Icon,
  HelpCircleIcon,
  TerminalIcon,
} from "lucide-react"
import type { ComponentType } from "react"
import { TodoItem } from "@/features/tasks/components/todo-item"
import { Card } from "@/components/ui/card"
import { todayTasks, type TaskIcon } from "@/features/tasks/mock"

const taskIcons: Record<TaskIcon, ComponentType<{ className?: string }>> = {
  "file-question": FileQuestionIcon,
  terminal: TerminalIcon,
  "help-circle": HelpCircleIcon,
  "book-open": BookOpenIcon,
  "calendar-clock": CalendarClockIcon,
  "circle-dollar-sign": CircleDollarSignIcon,
  "folder-git-2": FolderGit2Icon,
}

export function TodayTasks() {
  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 py-5 shadow-[var(--shadow-card)] ring-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight whitespace-nowrap">
          Việc cần làm hôm nay
        </h2>
        <Link
          href="#"
          className="flex items-center gap-1 text-[13px] font-semibold whitespace-nowrap text-primary hover:underline"
        >
          Xem tất cả <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
      {todayTasks.map((task) => {
        const Icon = taskIcons[task.icon]

        return (
          <TodoItem
            key={`${task.title}-${task.dueTime}`}
            icon={<Icon className="h-[18px] w-[18px]" />}
            iconTint={task.iconTint}
            title={task.title}
            subtitle={task.subtitle}
            badge={task.badge}
            dueTime={task.dueTime}
            action={task.action}
            actionVariant={task.actionVariant}
          />
        )
      })}
    </Card>
  )
}
