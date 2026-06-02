// features/ai-assistant/components/conversation-panel.tsx
"use client"

import { useState } from "react"
import { Plus, Search, MessageSquare } from "lucide-react"
import type { Conversation } from "@/features/ai-assistant/mock/chat.mock"

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

interface ConversationPanelProps {
  conversations: Conversation[]
  activeId: string
  onSelect: (id: string) => void
  onNewChat: () => void
}

export function ConversationPanel({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: ConversationPanelProps) {
  const [search, setSearch] = useState("")

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  const todayItems = filtered.filter((c) => c.group === "today")
  const earlierItems = filtered.filter((c) => c.group === "earlier")

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="p-4 pb-3">
        <button
          onClick={onNewChat}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-primary px-4 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Cuộc trò chuyện mới
        </button>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm cuộc trò chuyện..."
            className="w-full rounded-lg border border-input bg-background py-2 pr-3 pl-9 text-sm transition-all outline-none focus:border-ring focus:bg-white focus:shadow-[0_0_0_3px_hsl(var(--ring)_/_0.12)]"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2.5 pb-3">
        {todayItems.length > 0 && (
          <>
            <div className="px-2 pt-3 pb-1.5 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
              Hôm nay
            </div>
            {todayItems.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                active={c.id === activeId}
                onClick={() => onSelect(c.id)}
              />
            ))}
          </>
        )}

        {earlierItems.length > 0 && (
          <>
            <div className="px-2 pt-3 pb-1.5 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
              Trước đó
            </div>
            {earlierItems.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                active={c.id === activeId}
                onClick={() => onSelect(c.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function ConversationItem({
  conversation,
  active,
  onClick,
}: {
  conversation: Conversation
  active: boolean
  onClick: () => void
}) {
  const last = conversation.messages[conversation.messages.length - 1]
  const snippet = last ? stripHtml(last.html).slice(0, 48) : ""

  return (
    <button
      onClick={onClick}
      className={`flex w-full cursor-pointer items-start gap-2.5 rounded-xl p-2.5 text-left transition-colors ${
        active ? "bg-primary/10" : "hover:bg-muted"
      }`}
    >
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-primary text-white" : "bg-primary/10 text-primary"
        }`}
      >
        <MessageSquare className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={`truncate text-[13px] font-semibold ${
            active ? "text-primary" : "text-foreground"
          }`}
        >
          {conversation.title}
        </div>
        <div className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
          {snippet}
        </div>
      </div>
      <div className="mt-0.5 flex-shrink-0 text-[11px] text-muted-foreground">
        {conversation.time}
      </div>
    </button>
  )
}
