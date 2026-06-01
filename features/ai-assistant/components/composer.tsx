// features/ai-assistant/components/composer.tsx
"use client"

import { useRef, useState, useCallback } from "react"
import { Paperclip, SendHorizontal } from "lucide-react"

interface ComposerProps {
  onSend: (text: string) => void
  disabled?: boolean
}

export function Composer({ onSend, disabled }: ComposerProps) {
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const el = textareaRef.current
    if (!el || !el.value.trim() || disabled) return
    onSend(el.value.trim())
    el.value = ""
    el.style.height = "auto"
  }, [onSend, disabled])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleInput = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 160) + "px"
  }, [])

  return (
    <div className="px-6 pb-5 pt-3 border-t border-border bg-card">
      {/* Composer box */}
      <div
        className={`flex items-end gap-2.5 rounded-2xl border bg-background px-2 py-2 transition-colors max-w-[860px] mx-auto ${
          focused ? "border-ring shadow-[0_0_0_3px_hsl(var(--ring)_/_0.1)]" : "border-input"
        }`}
      >
        {/* Attach button (placeholder, not functional) */}
        <button
          className="w-9 h-9 flex items-center justify-center text-muted-foreground rounded-xl hover:bg-muted transition-colors flex-shrink-0"
          title="Đính kèm"
          disabled
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Hỏi AI bất cứ điều gì về môn học, bài tập, lịch thi..."
          className="flex-1 border-none bg-transparent outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground py-2 max-h-40 min-h-[22px]"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={disabled}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground flex-shrink-0 transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
          aria-label="Gửi"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Hint */}
      <p className="max-w-[860px] mx-auto mt-2.5 text-xs text-muted-foreground text-center">
        <kbd className="font-semibold bg-muted border border-border rounded px-1.5 py-0.5 text-[11px]">Enter</kbd>
        {" "}để gửi ·{" "}
        <kbd className="font-semibold bg-muted border border-border rounded px-1.5 py-0.5 text-[11px]">Shift</kbd>
        +<kbd className="font-semibold bg-muted border border-border rounded px-1.5 py-0.5 text-[11px]">Enter</kbd>
        {" "}xuống dòng · AI có thể mắc lỗi, hãy kiểm tra thông tin quan trọng.
      </p>
    </div>
  )
}
