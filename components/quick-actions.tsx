import { VideoIcon, BarChart3Icon, UploadIcon, CalendarClockIcon, ClipboardCheckIcon, CircleDollarSignIcon, FolderOpenIcon, MailIcon } from "lucide-react"
import Link from "next/link"

interface QuickAction {
    icon: React.ReactNode
    tint: "blue" | "amber" | "indigo" | "red" | "green"
    label: string
    href?: string
}

const quickActions: QuickAction[] = [
    { icon: <VideoIcon className="h-5 w-5" />, tint: "blue", label: "Tham gia lớp học" },
    { icon: <BarChart3Icon className="h-5 w-5" />, tint: "amber", label: "Xem điểm", href: "/results" },
    { icon: <UploadIcon className="h-5 w-5" />, tint: "indigo", label: "Nộp bài tập" },
    { icon: <CalendarClockIcon className="h-5 w-5" />, tint: "red", label: "Lịch thi", href: "/exams" },
    { icon: <ClipboardCheckIcon className="h-5 w-5" />, tint: "indigo", label: "Đăng ký môn" },
    { icon: <CircleDollarSignIcon className="h-5 w-5" />, tint: "green", label: "Học phí", href: "/tuition" },
    { icon: <FolderOpenIcon className="h-5 w-5" />, tint: "blue", label: "Tài liệu" },
    { icon: <MailIcon className="h-5 w-5" />, tint: "amber", label: "Liên hệ GV" },
]

const tintClasses = {
    blue: "bg-[oklch(0.96_0.04_250)] text-[oklch(0.60_0.18_250)]",
    amber: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
    indigo: "bg-[oklch(0.96_0.04_277)] text-[oklch(0.41_0.17_277)]",
    red: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
    green: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
}

export function QuickActions() {
    return (
        <div className="flex flex-wrap gap-3">
            {quickActions.map((qa, i) => (
                qa.href ? (
                    <Link
                        key={i}
                        href={qa.href}
                        className="w-[74px] flex flex-col items-center gap-2 rounded-[12px] border border-border bg-card p-[14px_4px] text-center transition-all duration-150 hover:-translate-y-0.5 hover:bg-muted hover:border-[hsl(243_60%_86%)]"
                    >
                        <div className={`flex h-[38px] w-[38px] items-center justify-center rounded-[11px] ${tintClasses[qa.tint]}`}>
                            {qa.icon}
                        </div>
                        <div className="text-[11px] font-medium text-[hsl(215_18%_38%)] text-center leading-tight">{qa.label}</div>
                    </Link>
                ) : (
                    <div
                        key={i}
                        className="w-[74px] flex flex-col items-center gap-2 rounded-[12px] border border-border bg-card p-[14px_4px] text-center transition-all duration-150 hover:-translate-y-0.5 hover:bg-muted hover:border-[hsl(243_60%_86%)]"
                    >
                        <div className={`flex h-[38px] w-[38px] items-center justify-center rounded-[11px] ${tintClasses[qa.tint]}`}>
                            {qa.icon}
                        </div>
                        <div className="text-[11px] font-medium text-[hsl(215_18%_38%)] text-center leading-tight">{qa.label}</div>
                    </div>
                )
            ))}
        </div>
    )
}
