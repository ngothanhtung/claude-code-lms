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
      if (conv && conv.messages.length === 1 && conv.messages[0].role === "ai") {
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
    <div className="flex flex-1 min-h-0">
      {/* Left: Conversation Panel */}
      <div className="w-[286px] flex-shrink-0 hidden md:flex">
        <ConversationPanel
          conversations={state.conversations}
          activeId={state.activeId}
          onSelect={handleSelect}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Right: Thread */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Thread header */}
        <div className="flex items-center gap-3 px-6 py-3.5 border-b border-border bg-card">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-primary to-purple-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M12 3l1.912 5.813a2 2 0 001.272 1.278L21 12l-5.816 1.909a2 2 0 00-1.278 1.272L12 21l-1.909-5.819a2 2 0 00-1.278-1.278L3 12l5.819-1.909a2 2 0 001.278-1.278L12 3z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold tracking-tight">
              Trợ lý học tập AI
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-500 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Trực tuyến · phản hồi tức thì
            </div>
          </div>
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3 h-3"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            UniLMS AI
          </span>
          <button
            onClick={handleClear}
            className="w-9 h-9 flex items-center justify-center border border-border bg-card rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Xóa hội thoại"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <MessageList
          messages={activeConversation?.messages ?? []}
          isTyping={isTyping}
        />

        {/* Suggestions */}
        {showSuggestions && (
          <div className="px-6 pb-2 pt-1">
            <Suggestions suggestions={SUGGESTIONS} onClick={handleSend} />
          </div>
        )}

        {/* Composer */}
        <Composer onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  )
}
