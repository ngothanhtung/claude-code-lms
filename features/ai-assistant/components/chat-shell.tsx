// features/ai-assistant/components/chat-shell.tsx
"use client"

import { useCallback, useState } from "react"
import { Trash2 } from "lucide-react"
import { ConversationPanel } from "./conversation-panel"
import { MessageList } from "./message-list"
import { Composer } from "./composer"
import { Suggestions } from "./suggestions"
import { useChat, pickReply } from "@/features/ai-assistant/hooks/use-chat"
import { SUGGESTIONS } from "@/features/ai-assistant/mock/chat.mock"

export function ChatShell() {
  const { state, dispatch, getActiveConversation } = useChat()
  const [isTyping, setIsTyping] = useState(false)

  const activeConversation = getActiveConversation()

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      // Update title if first user message
      const conv = getActiveConversation()
      if (
        conv &&
        conv.messages.length === 1 &&
        conv.messages[0].role === "ai"
      ) {
        const title = trimmed.length > 40 ? trimmed.slice(0, 40) + "…" : trimmed
        dispatch({ type: "UPDATE_TITLE", id: state.activeId, title })
      }

      // Send user message
      dispatch({ type: "SEND_USER_MESSAGE", text: trimmed })

      // Trigger typing indicator
      setIsTyping(true)

      // AI reply after delay
      setTimeout(() => {
        setIsTyping(false)
        const html = pickReply(trimmed)
        dispatch({ type: "RECEIVE_AI_REPLY", html })
      }, 1150)
    },
    [dispatch, getActiveConversation, state.activeId]
  )

  const handleSelect = useCallback(
    (id: string) => {
      dispatch({ type: "SELECT_CONVERSATION", id })
    },
    [dispatch]
  )

  const handleNewChat = useCallback(() => {
    dispatch({ type: "NEW_CHAT" })
  }, [dispatch])

  const handleClear = useCallback(() => {
    dispatch({ type: "CLEAR_CHAT" })
  }, [dispatch])

  const showSuggestions =
    activeConversation && activeConversation.messages.length <= 1

  return (
    <div className="flex h-[calc(100vh-138px)] max-sm:h-[calc(100vh-122px)] min-h-0 flex-1 border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
      {/* Left: Conversation Panel */}
      <div className="hidden w-[286px] shrink-0 md:flex flex-col">
        <ConversationPanel
          conversations={state.conversations}
          activeId={state.activeId}
          onSelect={handleSelect}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Right: Thread */}
      <div className="flex min-w-0 flex-1 flex-col bg-background">
        {/* Thread header */}
        <div className="flex items-center gap-3 border-b border-border bg-card px-6 py-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-500 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 3l1.912 5.813a2 2 0 001.272 1.278L21 12l-5.816 1.909a2 2 0 00-1.278 1.272L12 21l-1.909-5.819a2 2 0 00-1.278-1.278L3 12l5.819-1.909a2 2 0 001.278-1.278L12 3z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold tracking-tight">
              Trợ lý học tập AI
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-green-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              Trực tuyến · phản hồi tức thì
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3 w-3"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            UniLMS AI
          </span>
          <button
            onClick={handleClear}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Xóa hội thoại"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <MessageList
          messages={activeConversation?.messages ?? []}
          isTyping={isTyping}
        />

        {/* Suggestions */}
        {showSuggestions && (
          <div className="px-6 pt-1 pb-2">
            <Suggestions suggestions={SUGGESTIONS} onClick={handleSend} />
          </div>
        )}

        {/* Composer */}
        <Composer onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  )
}
