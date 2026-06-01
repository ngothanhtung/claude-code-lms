// features/ai-assistant/components/conversation-panel.tsx
"use client"

import { useState } from "react"
import { Plus, Search, MessageSquare } from "lucide-react"
import type { Conversation } from "@/features/ai-assistant/mock/chat.mock"

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
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
    <div className="flex flex-col h-full border-r border-border bg-card">
      {/* Header */}
      <div className="p-4 pb-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-primary hover:brightness-110 border-none rounded-xl py-3 px-4 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          Cuộc trò chuyện mới
        </button>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm cuộc trò chuyện..."
            className="w-full text-sm pl-9 pr-3 py-2 border border-input rounded-lg bg-background outline-none focus:border-ring focus:bg-white focus:shadow-[0_0_0_3px_hsl(var(--ring)_/_0.12)] transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2.5 pb-3">
        {todayItems.length > 0 && (
          <>
            <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground px-2 pt-3 pb-1.5">
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
            <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground px-2 pt-3 pb-1.5">
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
      className={`w-full flex gap-2.5 items-start p-2.5 rounded-xl cursor-pointer transition-colors text-left ${
        active
          ? "bg-primary/10"
          : "hover:bg-muted"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
          active ? "bg-primary text-white" : "bg-primary/10 text-primary"
        }`}
      >
        <MessageSquare className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-[13px] font-semibold truncate ${
            active ? "text-primary" : "text-foreground"
          }`}
        >
          {conversation.title}
        </div>
        <div className="text-[11.5px] text-muted-foreground truncate mt-0.5">
          {snippet}
        </div>
      </div>
      <div className="text-[11px] text-muted-foreground flex-shrink-0 mt-0.5">
        {conversation.time}
      </div>
    </button>
  )
}
