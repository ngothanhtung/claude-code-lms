import { cn } from "@/lib/utils"
import { IconTint } from "@/components/icon-tint"

interface StatCardProps {
  label: string
  value: string | number
  trend?: { value: number; label?: string }
  icon: React.ReactNode
  iconTint?: "indigo" | "green" | "amber" | "red" | "blue"
  className?: string
}

export function StatCard({
  label,
  value,
  trend,
  icon,
  iconTint = "indigo",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-card p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <IconTint variant={iconTint}>{icon}</IconTint>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold",
              trend.value >= 0
                ? "text-[oklch(0.63_0.19_152)]"
                : "text-[oklch(0.55_0.22_27)]"
            )}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}%
            {trend.label && (
              <span className="text-muted-foreground"> {trend.label}</span>
            )}
          </span>
        )}
      </div>
      <div>
        <p
          className="text-3xl font-extrabold tracking-tight text-foreground"
          style={{ letterSpacing: "-0.02em" }}
        >
          {value}
        </p>
        <p className="mt-0.5 text-sm font-medium text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  )
}
