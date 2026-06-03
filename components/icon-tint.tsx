import { cn } from "@/lib/utils"

interface IconTintProps {
  variant?: "indigo" | "green" | "amber" | "red" | "blue"
  size?: "sm" | "md" | "lg"
  className?: string
  children: React.ReactNode
}

const variantClasses = {
  indigo: "bg-primary-muted text-primary",
  green: "bg-success-muted text-success",
  amber: "bg-warning-muted text-warning",
  red: "bg-danger-muted text-danger",
  blue: "bg-info-muted text-info",
}

const sizeClasses = {
  sm: "h-8 w-8 rounded-[9px]",
  md: "h-10 w-10 rounded-[10px]",
  lg: "h-11 w-11 rounded-[11px]",
}

export function IconTint({
  variant = "indigo",
  size = "md",
  className,
  children,
}: IconTintProps) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}
