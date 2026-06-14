import { IconTint } from "@/components/icon-tint"

interface ActivityItemProps {
  icon: React.ReactNode
  iconTint: "red" | "green" | "blue" | "amber"
  title: string
  subtitle: string
  time: string
}

export function ActivityItem({
  icon,
  iconTint,
  title,
  subtitle,
  time,
}: ActivityItemProps) {
  return (
    <div className="flex gap-[10px] border-t border-border py-[11px] first:border-t-0 first:pt-0">
      <IconTint variant={iconTint} className="h-[34px] w-[34px] rounded-[9px]">
        {icon}
      </IconTint>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-semibold">{title}</div>
        <div className="text-[12px] text-muted-foreground">{subtitle}</div>
        <div className="mt-[2px] text-[11px] text-muted-foreground">{time}</div>
      </div>
    </div>
  )
}
