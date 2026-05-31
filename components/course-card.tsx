import { BookOpenIcon, PlayCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

type Category = "violet" | "green" | "blue" | "amber" | "teal" | "rust"

interface CourseCardProps {
    title: string
    category: Category
    instructor: string
    progress?: number
    lessonCount: number
    className?: string
}

const categoryGradients: Record<Category, string> = {
    violet: "from-[oklch(0.52_0.22_280)] to-[oklch(0.45_0.22_280)]",
    green: "from-[oklch(0.63_0.19_152)] to-[oklch(0.55_0.19_152)]",
    blue: "from-[oklch(0.52_0.17_258)] to-[oklch(0.45_0.17_258)]",
    amber: "from-[oklch(0.72_0.17_70)] to-[oklch(0.65_0.17_70)]",
    teal: "from-[oklch(0.52_0.14_175)] to-[oklch(0.45_0.14_175)]",
    rust: "from-[oklch(0.50_0.14_30)] to-[oklch(0.43_0.14_30)]",
}

export function CourseCard({ title, category, instructor, progress, lessonCount, className }: CourseCardProps) {
    return (
        <div className={cn(
            "group flex flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-card transition-all duration-150 hover:-translate-y-1 hover:shadow-[var(--shadow-pop)]",
            className
        )}>
            {/* Gradient Header */}
            <div className={cn("relative flex min-h-[116px] items-end bg-gradient-to-br p-4", categoryGradients[category])}>
                <h3 className="text-white font-bold text-[15px] leading-tight">{title}</h3>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3 p-4 flex-1">
                <div>
                    <p className="text-xs text-muted-foreground font-medium">Giảng viên</p>
                    <p className="text-sm font-medium text-foreground">{instructor}</p>
                </div>

                {progress !== undefined && (
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Tiến độ</span>
                            <span className="font-semibold text-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                    </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpenIcon className="h-3.5 w-3.5" />
                        {lessonCount} bài học
                    </div>
                    <button className="flex items-center gap-1 text-xs font-semibold text-[oklch(0.41_0.17_277)] hover:underline">
                        <PlayCircleIcon className="h-3.5 w-3.5" />
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    )
}
