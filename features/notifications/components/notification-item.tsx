interface NotificationItemProps {
  icon: React.ReactNode
  iconTint: "indigo" | "green" | "amber" | "red"
  title: string
  subtitle: string
  time: string
  unread?: boolean
}

const tintClasses = {
  indigo: "bg-[oklch(0.96_0.04_277)] text-[oklch(0.41_0.17_277)]",
  green: "bg-[oklch(0.96_0.03_152)] text-[oklch(0.63_0.19_152)]",
  amber: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.70_0.18_75)]",
  red: "bg-[oklch(0.96_0.03_27)] text-[oklch(0.55_0.22_27)]",
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
      <div
        className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] ${tintClasses[iconTint]}`}
      >
        {icon}
      </div>
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
