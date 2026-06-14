import {
  CheckSquareIcon,
  ClipboardListIcon,
  PenSquareIcon,
  UsersIcon,
  FileTextIcon,
  UserPlusIcon,
  MegaphoneIcon,
  BarChart3Icon,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { quickActions } from "@/features/elementary/dashboard/mock"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "check-square": CheckSquareIcon,
  "clipboard-list": ClipboardListIcon,
  "pen-square": PenSquareIcon,
  users: UsersIcon,
  "file-text": FileTextIcon,
  "user-plus": UserPlusIcon,
  megaphone: MegaphoneIcon,
  "bar-chart-3": BarChart3Icon,
}

const tintClasses = {
  blue: "bg-info-muted text-info",
  amber: "bg-warning-muted text-warning",
  indigo: "bg-primary-muted text-primary",
  red: "bg-danger-muted text-danger",
  green: "bg-success-muted text-success",
}

export function TeacherQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {quickActions.map((qa, i) => {
        const Icon = iconMap[qa.icon] ?? CheckSquareIcon
        const content = (
          <>
            <div
              className={`flex h-[38px] w-[38px] items-center justify-center rounded-[11px] ${tintClasses[qa.tint]}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex min-h-[2.5em] w-full items-start justify-center px-3 text-center text-[11px] leading-tight font-bold wrap-break-word text-muted-foreground">
              {qa.label}
            </div>
          </>
        )

        return qa.href ? (
          <Button
            asChild
            variant="outline"
            key={i}
            className="h-auto w-full flex-col items-center gap-2 rounded-[12px] border border-border bg-card p-[14px_4px] text-center whitespace-normal transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted"
          >
            <Link href={qa.href}>{content}</Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            key={i}
            className="h-auto w-full flex-col items-center gap-2 rounded-[12px] border border-border bg-card p-[14px_4px] text-center whitespace-normal transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted"
          >
            {content}
          </Button>
        )
      })}
    </div>
  )
}
