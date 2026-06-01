import { cn } from "@/lib/utils"

interface IconTintProps {
  variant?: "indigo" | "green" | "amber" | "red" | "blue"
  size?: "sm" | "md" | "lg"
  className?: string
  children: React.ReactNode
}

const variantClasses = {
  indigo: "bg-[oklch(0.96_0.04_277)] text-[oklch(0.41_0.17_277)]",
  green: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
  amber: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
  red: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
  blue: "bg-[oklch(0.96_0.04_250)] text-[oklch(0.60_0.18_250)]",
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
