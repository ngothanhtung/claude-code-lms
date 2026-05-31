import React from "react"
import { cn } from "@/lib/utils"
import { IconTint } from "@/components/icon-tint"
import { TrendingUpIcon, DatabaseIcon, LayersIcon, ClipboardListIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface StatCardDashboardProps {
    variant: "gpa" | "credits" | "semester" | "todos"
    className?: string
}

export function StatCardDashboard({ variant, className }: StatCardDashboardProps) {
    type StatConfig = {
        icon: React.ComponentType<{ className?: string }>
        iconTint: "indigo" | "green" | "blue" | "amber"
        label: string
        value: string
        spark?: true
        subValue?: string
        detail?: string
        progress?: number
        danger?: true
    }
    const configs: Record<StatCardDashboardProps["variant"], StatConfig> = {
        gpa: {
            icon: TrendingUpIcon,
            iconTint: "indigo" as const,
            label: "GPA hiện tại",
            value: "3.45",
            spark: true,
        },
        credits: {
            icon: DatabaseIcon,
            iconTint: "green" as const,
            label: "Tín chỉ tích lũy",
            value: "96",
            subValue: "/ 140",
            detail: "Hoàn thành 68.6%",
            progress: 68.6,
        },
        semester: {
            icon: LayersIcon,
            iconTint: "blue" as const,
            label: "Tín chỉ học kỳ này",
            value: "18",
            detail: "6 môn học",
        },
        todos: {
            icon: ClipboardListIcon,
            iconTint: "amber" as const,
            label: "Việc cần làm",
            value: "4",
            detail: "Bài tập sắp đến hạn",
            danger: true,
        },
    }

    const c = configs[variant]

    return (
        <Card className={cn(
            "gap-3 rounded-[var(--radius)] border border-border bg-card p-[18px] py-[18px] shadow-[var(--shadow-card)] ring-0 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]",
            className
        )}>
            <div className="flex items-start justify-between">
                <IconTint variant={c.iconTint} size="lg">
                    <c.icon className="h-5 w-5" />
                </IconTint>
                {c.spark && (
                    <svg className="h-[34px] w-[64px]" viewBox="0 0 64 34" fill="none">
                        <polyline
                            points="0,28 12,22 22,25 34,14 44,17 56,6 64,9"
                            stroke="oklch(0.41 0.17 277)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>
            <div className="text-[13px] font-medium text-muted-foreground">
                {c.label}
            </div>
            <div className="text-[30px] font-extrabold tracking-tight leading-[1.05]" style={{ letterSpacing: "-0.02em" }}>
                {c.value}
                {"subValue" in c && <span className="text-[18px] text-muted-foreground font-semibold"> {c.subValue}</span>}
            </div>
            {"progress" in c ? (
                <>
                    <div className="text-[12.5px] text-muted-foreground mt-[10px] mb-[5px]">{c.detail}</div>
                    <div className="h-[7px] rounded-full bg-[oklch(0.965_0_0)] overflow-hidden mt-[4px]">
                        <div className="h-full rounded-full bg-[linear-gradient(90deg,hsl(142_71%_50%),hsl(142_71%_42%))]" style={{ width: `${c.progress}%` }} />
                    </div>
                </>
            ) : (
                <div className={cn("text-[12.5px] mt-[10px]", "danger" in c && c.danger ? "text-[oklch(0.55_0.22_27)] font-semibold" : "text-muted-foreground")}>
                    {c.detail}
                </div>
            )}
        </Card>
    )
}
