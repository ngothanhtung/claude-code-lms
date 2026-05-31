import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type BadgeVariant = "success" | "warning" | "destructive" | "info" | "outline" | "default"

interface BadgeStatusProps {
    variant?: BadgeVariant
    children: React.ReactNode
    className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-primary text-primary-foreground",
    success: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
    warning: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
    destructive: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
    info: "bg-[oklch(0.96_0.04_250)] text-[oklch(0.60_0.18_250)]",
    outline: "border border-border bg-transparent text-foreground",
}

export function BadgeStatus({ variant = "default", children, className }: BadgeStatusProps) {
    return (
        <Badge className={cn(
            "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
            variantClasses[variant],
            className
        )}>
            {children}
        </Badge>
    )
}
