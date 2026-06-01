// features/ai-assistant/components/suggestions.tsx
"use client"

import {
  BookOpen,
  CalendarClock,
  BarChart3,
  FileCode2,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import type { Suggestion } from "@/features/ai-assistant/mock/chat.mock"

const ICON_MAP: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "calendar-clock": CalendarClock,
  "bar-chart-3": BarChart3,
  "file-code-2": FileCode2,
}

interface SuggestionsProps {
  suggestions: Suggestion[]
  onClick: (text: string) => void
}

export function Suggestions({ suggestions, onClick }: SuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 max-w-[860px] mx-auto">
      {suggestions.map((s, i) => {
        const Icon = ICON_MAP[s.icon] ?? Sparkles
        return (
          <button
            key={i}
            onClick={() => onClick(s.text)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground bg-card border border-border rounded-full px-4 py-2 cursor-pointer transition-colors hover:border-primary/40 hover:bg-primary/4"
          >
            <Icon className="w-3.5 h-3.5 text-primary" />
            {s.text}
          </button>
        )
      })}
    </div>
  )
}
