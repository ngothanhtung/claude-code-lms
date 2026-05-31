import { CodeXmlIcon, DatabaseIcon, NetworkIcon, CoffeeIcon, BookOpenIcon, TerminalIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Category = "violet" | "green" | "blue" | "amber" | "teal" | "rust"

interface CourseCardDashboardProps {
    title: string
    category: Category
    instructor: string
    progress: number
    assignments: number
    grade: string
    className?: string
}

const configs: Record<Category, { gradient: string; icon: React.ReactNode }> = {
    violet: { gradient: "from-[oklch(0.52_0.22_280)] to-[oklch(0.45_0.22_280)]", icon: <CodeXmlIcon className="h-[18px] w-[18px]" /> },
    green: { gradient: "from-[oklch(0.63_0.19_152)] to-[oklch(0.55_0.19_152)]", icon: <DatabaseIcon className="h-[18px] w-[18px]" /> },
    blue: { gradient: "from-[oklch(0.52_0.17_258)] to-[oklch(0.45_0.17_258)]", icon: <NetworkIcon className="h-[18px] w-[18px]" /> },
    amber: { gradient: "from-[oklch(0.72_0.17_70)] to-[oklch(0.65_0.17_70)]", icon: <CoffeeIcon className="h-[18px] w-[18px]" /> },
    teal: { gradient: "from-[oklch(0.52_0.14_175)] to-[oklch(0.45_0.14_175)]", icon: <BookOpenIcon className="h-[18px] w-[18px]" /> },
    rust: { gradient: "from-[oklch(0.50_0.14_30)] to-[oklch(0.43_0.14_30)]", icon: <TerminalIcon className="h-[18px] w-[18px]" /> },
}

export function CourseCardDashboard({ title, category, instructor, progress, assignments, grade, className }: CourseCardDashboardProps) {
    const c = configs[category]
    return (
        <div className={cn(
            "flex flex-col overflow-hidden rounded-[14px] border border-border bg-card transition-all duration-150 hover:-translate-y-[3px]",
            className
        )}>
            <div className={cn("relative flex min-h-[116px] flex-col justify-end p-[14px_14px_16px]", "bg-gradient-to-br", c.gradient)}>
                <div className="absolute right-3 top-[13px] opacity-[0.9]">{c.icon}</div>
                <div className="pr-6 text-[14px] font-bold leading-tight text-white">{title}</div>
                <div className="text-[11.5px] opacity-90 mt-[3px]">GV: {instructor}</div>
                <div className="mt-auto pt-2">
                    <div className="flex items-center justify-between text-[12px] font-semibold mb-[5px]">
                        <span>Tiến độ</span><span>{progress}%</span>
                    </div>
                    <div className="h-[6px] rounded-full bg-white/[0.3] overflow-hidden">
                        <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="flex-1 px-3 py-2.5">
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                        Bài tập
                    </div>
                    <div className="text-[15px] font-extrabold mt-[2px]">{assignments}</div>
                </div>
                <div className="flex-1 border-l border-border px-3 py-2.5">
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        Điểm
                    </div>
                    <div className="text-[15px] font-extrabold mt-[2px]">{grade}</div>
                </div>
            </div>
        </div>
    )
}
