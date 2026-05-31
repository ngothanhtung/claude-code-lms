interface ActivityItemProps {
    icon: React.ReactNode
    iconTint: "red" | "green" | "blue" | "amber"
    title: string
    subtitle: string
    time: string
}

const tintClasses = {
    red: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
    green: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
    blue: "bg-[oklch(0.96_0.04_250)] text-[oklch(0.60_0.18_250)]",
    amber: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
}

export function ActivityItem({ icon, iconTint, title, subtitle, time }: ActivityItemProps) {
    return (
        <div className="flex gap-[10px] py-[11px] border-t border-border first:border-t-0 first:pt-0">
            <div className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${tintClasses[iconTint]}`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold">{title}</div>
                <div className="text-[12px] text-muted-foreground">{subtitle}</div>
                <div className="text-[11px] text-muted-foreground mt-[2px]">{time}</div>
            </div>
        </div>
    )
}
