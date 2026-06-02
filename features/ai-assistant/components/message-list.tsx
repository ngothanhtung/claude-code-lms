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
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
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
    <div className="msg ai flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-purple-500 text-white">
        <Sparkles className="h-4 w-4" />
      </div>
      <div>
        <div className="inline-flex gap-1.5 rounded-xl border border-border bg-card px-4 py-4 shadow-sm">
          <span className="h-1.5 w-1.5 animate-[bounce_1.3s_infinite_0ms] rounded-full bg-muted-foreground/60" />
          <span className="h-1.5 w-1.5 animate-[bounce_1.3s_infinite_180ms] rounded-full bg-muted-foreground/60" />
          <span className="h-1.5 w-1.5 animate-[bounce_1.3s_infinite_360ms] rounded-full bg-muted-foreground/60" />
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
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted"
      aria-label={label}
    >
      {copied ? <Check className="h-3 w-3 text-green-500" /> : icon}
      {copied ? "Đã chép" : label}
    </button>
  )
}

export function MessageList({ messages, isTyping }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages or typing state changes
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pt-6">
      <div className="mx-auto flex max-w-[860px] flex-col gap-5 pb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`msg flex items-start gap-3 ${
              m.role === "user" ? "justify-end" : ""
            }`}
          >
            {m.role === "ai" && (
              <>
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3.5 shadow-sm">
                    <Bubble message={m} />
                  </div>
                  <div className="ml-1 flex items-center gap-1.5">
                    <MessageAction
                      icon={<Copy className="h-3 w-3" />}
                      label="Sao chép"
                      messageHtml={m.html}
                    />
                    <button
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted"
                      aria-label="Hữu ích"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted"
                      aria-label="Không hữu ích"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="ml-1 text-xs text-muted-foreground">
                    {m.time}
                  </span>
                </div>
              </>
            )}

            {m.role === "user" && (
              <div className="flex flex-col items-end gap-1">
                <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-3.5 text-primary-foreground">
                  <Bubble message={m} />
                </div>
                <span className="mr-1 text-xs text-muted-foreground">
                  {m.time}
                </span>
              </div>
            )}
          </div>
        ))}

        {isTyping && <TypingIndicator />}
      </div>
    </div>
  )
}
