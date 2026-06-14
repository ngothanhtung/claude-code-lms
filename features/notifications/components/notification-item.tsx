import { IconTint } from "@/components/icon-tint"

interface NotificationItemProps {
  icon: React.ReactNode
  iconTint: "indigo" | "green" | "amber" | "red"
  title: string
  subtitle: string
  time: string
  unread?: boolean
}

export function NotificationItem({
  icon,
  iconTint,
  title,
  subtitle,
  time,
  unread,
}: NotificationItemProps) {
  return (
    <div className="relative flex gap-3 border-t border-border py-[13px] first:border-t-0 first:pt-0.5">
      <IconTint variant={iconTint} className="h-[34px] w-[34px] rounded-[10px]">
        {icon}
      </IconTint>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] leading-[1.3] font-semibold">{title}</div>
        <div className="mt-[1px] text-[12px] text-muted-foreground">
          {subtitle}
        </div>
        <div className="mt-[3px] text-[11.5px] text-muted-foreground">
          {time}
        </div>
      </div>
      {unread && (
        <span className="absolute top-[16px] right-[2px] h-[8px] w-[8px] shrink-0 rounded-full bg-[oklch(0.55_0.22_27)]" />
      )}
    </div>
  )
}
