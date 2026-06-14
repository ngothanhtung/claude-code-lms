import { Button } from "@/components/ui/button"
import { BadgeStatus } from "@/components/badge-status"
import { IconTint } from "@/components/icon-tint"

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
      <IconTint variant={iconTint} className="h-[36px] w-[36px] rounded-[11px]">
        {icon}
      </IconTint>
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
