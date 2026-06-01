import { Button } from "@/components/ui/button"
import { BadgeStatus } from "@/components/badge-status"

type BadgeVariant = "destructive" | "warning" | "info" | "success"

interface TodoItemProps {
  icon: React.ReactNode
  iconTint: "red" | "amber" | "blue" | "indigo" | "green"
  title: string
  subtitle: string
  badge: { label: string; variant: BadgeVariant }
  dueTime: string
  action: string
  actionVariant?: "primary" | "default"
}

const tintToIconClass: Record<TodoItemProps["iconTint"], string> = {
  red: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
  amber: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
  blue: "bg-[oklch(0.96_0.04_250)] text-[oklch(0.60_0.18_250)]",
  indigo: "bg-[oklch(0.96_0.04_277)] text-[oklch(0.41_0.17_277)]",
  green: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
}

export function TodoItem({
  icon,
  iconTint,
  title,
  subtitle,
  badge,
  dueTime,
  action,
  actionVariant = "default",
}: TodoItemProps) {
  return (
    <div className="flex items-center gap-3.5 border-t border-border py-[13px] first:border-t-0 first:pt-0.5">
      <div
        className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[11px] ${tintToIconClass[iconTint]}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold">{title}</div>
        <div className="text-[12.5px] text-muted-foreground">{subtitle}</div>
      </div>
      <div className="text-right leading-[1.3]">
        <BadgeStatus variant={badge.variant}>{badge.label}</BadgeStatus>
        <div className="mt-[3px] text-[12px] text-muted-foreground">
          {dueTime}
        </div>
      </div>
      <Button
        variant={actionVariant === "primary" ? "default" : "outline"}
        size="sm"
        className="h-7 shrink-0 px-3.5 text-[12.5px] font-semibold whitespace-nowrap"
      >
        {action}
      </Button>
    </div>
  )
}
