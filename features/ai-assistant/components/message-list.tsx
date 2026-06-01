// features/ai-assistant/components/message-list.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react"
import type { Message } from "@/features/ai-assistant/mock/chat.mock"

interface MessageListProps {
  messages: Message[]
  isTyping: boolean
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function Bubble({ message }: { message: Message }) {
  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: message.html }}
    />
  )
}

function TypingIndicator() {
  return (
    <div className="msg ai flex gap-3 items-start">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-primary to-purple-500 flex-shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>
      <div>
        <div className="inline-flex gap-1.5 rounded-xl bg-card border border-border px-4 py-4 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-[bounce_1.3s_infinite_0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-[bounce_1.3s_infinite_180ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-[bounce_1.3s_infinite_360ms]" />
        </div>
      </div>
    </div>
  )
}

// Separate client component for copy action (needs state)
function MessageAction({
  icon,
  label,
  messageHtml,
}: {
  icon: React.ReactNode
  label: string
  messageHtml: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = stripHtml(messageHtml)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:bg-muted px-1.5 py-0.5 rounded transition-colors"
      aria-label={label}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : icon}
      {copied ? "Đã chép" : label}
    </button>
  )
}

export function MessageList({
  messages,
  isTyping,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages or typing state changes
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pt-6">
      <div className="max-w-[860px] mx-auto flex flex-col gap-5 pb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`msg flex gap-3 items-start ${
              m.role === "user" ? "justify-end" : ""
            }`}
          >
            {m.role === "ai" && (
              <>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-primary to-purple-500 flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="rounded-2xl rounded-tl-sm px-4 py-3.5 bg-card border border-border shadow-sm">
                    <Bubble message={m} />
                  </div>
                  <div className="flex items-center gap-1.5 ml-1">
                    <MessageAction
                      icon={<Copy className="w-3 h-3" />}
                      label="Sao chép"
                      messageHtml={m.html}
                    />
                    <button
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:bg-muted px-1.5 py-0.5 rounded transition-colors"
                      aria-label="Hữu ích"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:bg-muted px-1.5 py-0.5 rounded transition-colors"
                      aria-label="Không hữu ích"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground ml-1">{m.time}</span>
                </div>
              </>
            )}

            {m.role === "user" && (
              <div className="flex flex-col gap-1 items-end">
                <div className="rounded-2xl rounded-tr-sm px-4 py-3.5 bg-primary text-primary-foreground">
                  <Bubble message={m} />
                </div>
                <span className="text-xs text-muted-foreground mr-1">{m.time}</span>
              </div>
            )}
          </div>
        ))}

        {isTyping && <TypingIndicator />}
      </div>
    </div>
  )
}
