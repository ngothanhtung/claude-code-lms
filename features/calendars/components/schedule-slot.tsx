import { MapPinIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScheduleSlotProps {
  time: string
  status: "live" | "upcoming" | "default"
  title: string
  room: string
  tag?: string
  tagColor?: string
  action?: { label: string; variant: "primary" | "outline" | "default" }
}

export function ScheduleSlot({
  time,
  status,
  title,
  room,
  tag,
  tagColor,
  action,
}: ScheduleSlotProps) {
  return (
    <div className="flex gap-3 py-2.5">
      <div className="w-[88px] shrink-0 pt-[2px] text-[12.5px] font-semibold whitespace-nowrap text-muted-foreground">
        {time}
      </div>
      <div
        className={`w-[3px] shrink-0 rounded-full ${status === "live" ? "bg-success" : "bg-border"}`}
        style={{ minHeight: "40px" }}
      />
      <div className="min-w-0 flex-1 pt-[2px]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[13.5px] leading-[1.3] font-semibold">
              {title}
            </div>
            <div className="mt-[2px] flex items-center gap-1 text-[12px] text-muted-foreground">
              <MapPinIcon className="h-3 w-3 shrink-0" />
              {room}
            </div>
          </div>
          {tag && (
            <span
              className="shrink-0 text-[12px] font-semibold whitespace-nowrap"
              style={{ color: tagColor }}
            >
              {tag}
            </span>
          )}
          {action && (
            <Button
              variant={action.variant === "primary" ? "default" : "outline"}
              size="sm"
              className={`h-7 shrink-0 px-3.5 text-[12.5px] font-semibold ${
                action.variant === "outline"
                  ? "border-primary/30 bg-primary-muted text-primary hover:bg-primary/10"
                  : ""
              }`}
            >
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
