import type { CalendarEventTone } from "@/features/calendars/mock"

export const eventToneClasses: Record<CalendarEventTone, string> = {
  violet: "bg-[linear-gradient(155deg,hsl(262_83%_62%),hsl(262_83%_50%))]",
  green: "bg-[linear-gradient(155deg,hsl(142_65%_48%),hsl(142_71%_38%))]",
  blue: "bg-[linear-gradient(155deg,hsl(221_83%_58%),hsl(221_83%_46%))]",
  amber: "bg-[linear-gradient(155deg,hsl(36_95%_56%),hsl(28_92%_50%))]",
  teal: "bg-[linear-gradient(155deg,hsl(172_60%_44%),hsl(174_66%_34%))]",
  rust: "bg-[linear-gradient(155deg,hsl(16_60%_60%),hsl(14_52%_48%))]",
}

export const legendSwatchClasses: Record<CalendarEventTone, string> = {
  violet: "bg-[hsl(262_83%_56%)]",
  green: "bg-[hsl(142_68%_43%)]",
  blue: "bg-[hsl(221_83%_52%)]",
  amber: "bg-[hsl(32_93%_53%)]",
  teal: "bg-[hsl(173_63%_39%)]",
  rust: "bg-[hsl(15_56%_54%)]",
}
