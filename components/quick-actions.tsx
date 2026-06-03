import {
  VideoIcon,
  BarChart3Icon,
  UploadIcon,
  CalendarClockIcon,
  ClipboardCheckIcon,
  CircleDollarSignIcon,
  FolderOpenIcon,
  MailIcon,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface QuickAction {
  icon: React.ReactNode
  tint: "blue" | "amber" | "indigo" | "red" | "green"
  label: string
  href?: string
}

const quickActions: QuickAction[] = [
  {
    icon: <VideoIcon className="h-5 w-5" />,
    tint: "blue",
    label: "Tham gia lớp học",
  },
  {
    icon: <BarChart3Icon className="h-5 w-5" />,
    tint: "amber",
    label: "Xem điểm",
    href: "/results",
  },
  {
    icon: <UploadIcon className="h-5 w-5" />,
    tint: "indigo",
    label: "Nộp bài tập",
  },
  {
    icon: <CalendarClockIcon className="h-5 w-5" />,
    tint: "red",
    label: "Lịch thi",
    href: "/exams",
  },
  {
    icon: <ClipboardCheckIcon className="h-5 w-5" />,
    tint: "indigo",
    label: "Đăng ký môn",
  },
  {
    icon: <CircleDollarSignIcon className="h-5 w-5" />,
    tint: "green",
    label: "Học phí",
    href: "/tuition",
  },
  {
    icon: <FolderOpenIcon className="h-5 w-5" />,
    tint: "blue",
    label: "Tài liệu",
  },
  {
    icon: <MailIcon className="h-5 w-5" />,
    tint: "amber",
    label: "Liên hệ GV",
  },
]

const tintClasses = {
  blue: "bg-info-muted text-info",
  amber: "bg-warning-muted text-warning",
  indigo: "bg-primary-muted text-primary",
  red: "bg-danger-muted text-danger",
  green: "bg-success-muted text-success",
}

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {quickActions.map((qa, i) => {
        const content = (
          <>
            <div
              className={`flex h-[38px] w-[38px] items-center justify-center rounded-[11px] ${tintClasses[qa.tint]}`}
            >
              {qa.icon}
            </div>
            <div className="flex min-h-[2.5em] w-full items-center justify-center overflow-hidden wrap-break-word text-center text-[11px] leading-tight font-medium text-muted-foreground">
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

