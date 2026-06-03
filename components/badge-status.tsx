import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type BadgeVariant =
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "outline"
  | "default"

interface BadgeStatusProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-primary text-primary-foreground",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  destructive: "bg-danger-muted text-danger",
  info: "bg-info-muted text-info",
  outline: "border border-border bg-transparent text-foreground",
}

export function BadgeStatus({
  variant = "default",
  children,
  className,
}: BadgeStatusProps) {
  return (
    <Badge
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Badge>
  )
}
