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

export function ScheduleSlot({ time, status, title, room, tag, tagColor, action }: ScheduleSlotProps) {
    return (
        <div className={`flex gap-3 py-3 ${status === "upcoming" ? "opacity-[0.78]" : ""}`}>
            <div className="w-[88px] shrink-0 text-[12.5px] font-semibold text-muted-foreground pt-0.5 whitespace-nowrap">
                {time}
            </div>
            <div className={`w-[3px] shrink-0 rounded-full ${status === "live" ? "bg-[oklch(0.63_0.19_152)]" : "bg-border"}`} />
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold leading-[1.3]">{title}</div>
                        <div className="flex items-center gap-1 text-[12.5px] text-muted-foreground mt-1">
                            <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                            {room}
                        </div>
                    </div>
                    {tag && (
                        <span className="shrink-0 text-[12px] font-semibold whitespace-nowrap" style={{ color: tagColor }}>
                            {tag}
                        </span>
                    )}
                    {action && (
                        <Button
                            variant={action.variant === "primary" ? "default" : "outline"}
                            size="sm"
                            className={`shrink-0 text-[12.5px] font-semibold h-7 px-3.5 ${
                                action.variant === "outline"
                                    ? "border-[hsl(243_75%_85%)] text-[oklch(0.41_0.17_277)] bg-[oklch(0.41_0.17_277/0.06)] hover:bg-[oklch(0.41_0.17_277/0.12)]"
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
