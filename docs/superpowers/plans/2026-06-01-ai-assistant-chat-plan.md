# AI Assistant Chat — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the AI Chat page at `/ai-assistant` with a 2-column layout (conversation history panel + thread), mock AI replies via keyword matching, and localStorage persistence.

**Architecture:** Chat state lives in a `useReducer` hook inside `ChatShell` (the single client component). All sub-components receive state/props from shell. Mock data in `chat.mock.ts` provides defaults and reply rules.

**Tech Stack:** Next.js App Router, React, Tailwind CSS v4, shadcn/ui (ScrollArea, Button, Textarea, Input), lucide-react, localStorage.

---

## File Map

| File | Action |
|------|--------|
| `features/ai-assistant/mock/chat.mock.ts` | Create |
| `features/ai-assistant/hooks/use-chat.ts` | Create |
| `features/ai-assistant/components/suggestions.tsx` | Create |
| `features/ai-assistant/components/composer.tsx` | Create |
| `features/ai-assistant/components/message-list.tsx` | Create |
| `features/ai-assistant/components/conversation-panel.tsx` | Create |
| `features/ai-assistant/components/chat-shell.tsx` | Create |
| `app/(student)/ai-assistant/page.tsx` | Create (replace stub) |
| `components/app-sidebar.tsx` | Modify — wire button to `/ai-assistant` |

---

## Task 1: Mock Data — `features/ai-assistant/mock/chat.mock.ts`

**Files:**
- Create: `features/ai-assistant/mock/chat.mock.ts`
- Test: N/A (static data)

- [ ] **Step 1: Create the mock data file**

```ts
// features/ai-assistant/mock/chat.mock.ts

export interface Message {
  role: "ai" | "user"
  time: string
  html: string
}

export interface Conversation {
  id: string
  title: string
  time: string
  group: "today" | "earlier"
  messages: Message[]
}

export interface ReplyRule {
  match: string[]
  html: string
}

export interface Suggestion {
  icon: string
  text: string
}

export const SUGGESTIONS: Suggestion[] = [
  { icon: "book-open", text: "Giải thích bài học tuần này" },
  { icon: "calendar-clock", text: "Deadline sắp tới của mình?" },
  { icon: "bar-chart-3", text: "GPA học kỳ này của mình?" },
  { icon: "file-code-2", text: "Giúp mình gỡ lỗi code Java" },
]

const defaultConversations: Conversation[] = [
  {
    id: "c1",
    title: "Abstract class vs Interface",
    time: "09:24",
    group: "today",
    messages: [
      {
        role: "ai",
        time: "09:20",
        html: "<p>Chào Tùng 👋 Mình là trợ lý học tập AI của LMS Portal. Mình có thể giúp bạn giải thích bài học, nhắc deadline, tra cứu điểm và lịch học. Bạn cần hỗ trợ gì hôm nay?</p>",
      },
      {
        role: "user",
        time: "09:23",
        html: "<p>Giải thích giúp mình sự khác nhau giữa abstract class và interface trong Java với.</p>",
      },
      {
        role: "ai",
        time: "09:24",
        html: "<p>Câu hỏi rất hay — đây cũng là nội dung tuần này của môn <strong>Lập trình hướng đối tượng</strong>. Tóm tắt nhanh:</p><table class=\"b-table\"><thead><tr><th>Tiêu chí</th><th>Abstract class</th><th>Interface</th></tr></thead><tbody><tr><td>Kế thừa</td><td>Đơn kế thừa (1 lớp cha)</td><td>Đa kế thừa (nhiều interface)</td></tr><tr><td>Thuộc tính</td><td>Có thể có biến thường</td><td>Chỉ hằng <code>public static final</code></td></tr><tr><td>Phương thức</td><td>Có thể có thân hàm</td><td>Chủ yếu là khai báo (từ Java 8 có <code>default</code>)</td></tr><tr><td>Dùng khi</td><td>Các lớp <em>cùng loại</em>, chia sẻ code chung</td><td>Định nghĩa <em>khả năng</em> (hợp đồng) cho nhiều lớp khác loại</td></tr></tbody></table><p>Ví dụ minh hoạ:</p><pre><code><span class=\"tok-k\">abstract class</span> <span class=\"tok-t\">Animal</span> {\n  <span class=\"tok-k\">abstract void</span> sound();      <span class=\"tok-c\">// chưa có thân</span>\n  <span class=\"tok-k\">void</span> breathe() { ... }       <span class=\"tok-c\">// code dùng chung</span>\n}\n\n<span class=\"tok-k\">interface</span> <span class=\"tok-t\">Swimmable</span> {\n  <span class=\"tok-k\">void</span> swim();                  <span class=\"tok-c\">// chỉ là hợp đồng</span>\n}</code></pre><p><strong>Mẹo nhớ:</strong> dùng <em>abstract class</em> khi trả lời được câu \"<strong>là một</strong>\" (Dog <em>là một</em> Animal); dùng <em>interface</em> khi trả lời \"<strong>có khả năng</strong>\" (Dog <em>có thể</em> bơi).</p>",
      },
    ],
  },
  {
    id: "c2",
    title: "Deadline bài tập tuần này",
    time: "08:05",
    group: "today",
    messages: [
      {
        role: "user",
        time: "08:04",
        html: "<p>Tuần này mình có deadline nào không?</p>",
      },
      {
        role: "ai",
        time: "08:05",
        html: "<p>Mình kiểm tra rồi, bạn có <strong>3 mốc</strong> sắp tới:</p><ul><li>📌 <strong>BTL2 — Quản lý thư viện (Java)</strong> · môn OOP · hạn <strong>09/06</strong> (còn 8 ngày), làm nhóm.</li><li>📝 <strong>Bài tập 1 — Kế thừa &amp; đa hình</strong> · đã nộp, đang chờ chấm.</li><li>🧪 <strong>Quiz chương 3 — Cơ sở dữ liệu</strong> · mở đến <strong>05/06</strong>.</li></ul><p>Bạn muốn mình thêm nhắc nhở cho BTL2 vào lịch không?</p>",
      },
    ],
  },
  {
    id: "c3",
    title: "Cách tính điểm trung bình (GPA)",
    time: "Hôm qua",
    group: "earlier",
    messages: [
      {
        role: "user",
        time: "Hôm qua",
        html: "<p>GPA học kỳ này của mình đang được tính thế nào?</p>",
      },
      {
        role: "ai",
        time: "Hôm qua",
        html: "<p>GPA được tính theo trung bình có trọng số tín chỉ:</p><pre><code>GPA = Σ(điểm hệ 4 × số tín chỉ) / Σ(số tín chỉ)</code></pre><p>Theo dữ liệu hiện tại, điểm tạm tính của bạn là <strong>3.42 / 4.0</strong> (xếp loại <strong>Giỏi</strong>). Môn OOP đang 8.5 (B+), Cơ sở dữ liệu 8.8 (A). Cần mình gợi ý cách kéo điểm các môn còn lại không?</p>",
      },
    ],
  },
  {
    id: "c4",
    title: "Tóm tắt bài giảng Lecture 7",
    time: "Hôm qua",
    group: "earlier",
    messages: [
      {
        role: "user",
        time: "Hôm qua",
        html: "<p>Tóm tắt giúp mình Lecture 7 về Inheritance.</p>",
      },
      {
        role: "ai",
        time: "Hôm qua",
        html: "<p><strong>Lecture 7 — Kế thừa &amp; Đa hình</strong> gồm 3 ý chính:</p><ul><li><strong>Kế thừa (extends):</strong> lớp con tái sử dụng thuộc tính/phương thức của lớp cha.</li><li><strong>Ghi đè (override):</strong> lớp con định nghĩa lại hành vi của phương thức cha.</li><li><strong>Đa hình (polymorphism):</strong> cùng một lời gọi, hành vi khác nhau tuỳ đối tượng thực tế.</li></ul><p>Tài liệu đầy đủ nằm ở tab <em>Tài liệu</em> của lớp OOP nhé.</p>",
      },
    ],
  },
  {
    id: "c5",
    title: "Phòng thi cuối kỳ ở đâu?",
    time: "28/05",
    group: "earlier",
    messages: [
      {
        role: "user",
        time: "28/05",
        html: "<p>Lịch thi cuối kỳ môn Cơ sở dữ liệu khi nào, ở phòng nào?</p>",
      },
      {
        role: "ai",
        time: "28/05",
        html: "<p>Môn <strong>Cơ sở dữ liệu</strong> thi cuối kỳ ngày <strong>20/06/2026</strong>, ca sáng <strong>07:30</strong>, phòng <strong>D9-401</strong>. Hình thức: tự luận 90 phút, được dùng 1 tờ A4 viết tay. Chúc bạn ôn tốt! 📚</p>",
      },
    ],
  },
]

export const REPLY_RULES: ReplyRule[] = [
  {
    match: ["abstract", "interface"],
    html: "<p>Ngắn gọn: <strong>abstract class</strong> dùng khi các lớp <em>cùng loại</em> chia sẻ code chung (đơn kế thừa, có thể chứa biến và phương thức có thân). <strong>Interface</strong> là một \"hợp đồng\" mô tả <em>khả năng</em> mà nhiều lớp khác loại cùng cài đặt (đa kế thừa). Mẹo: \"<strong>là một</strong>\" → abstract class; \"<strong>có khả năng</strong>\" → interface.</p>",
  },
  {
    match: ["deadline", "hạn", "bài tập", "nộp"],
    html: "<p>Bạn đang có các mốc gần nhất:</p><ul><li><strong>BTL2 (OOP)</strong> — hạn <strong>09/06</strong>, làm nhóm.</li><li><strong>Quiz chương 3 (CSDL)</strong> — mở đến <strong>05/06</strong>.</li></ul><p>Muốn mình đặt nhắc nhở không?</p>",
  },
  {
    match: ["điểm", "gpa", "trung bình"],
    html: "<p>GPA tạm tính học kỳ này của bạn là <strong>3.42 / 4.0</strong> (Giỏi). Cao nhất là Cơ sở dữ liệu (A · 8.8), thấp nhất cần chú ý là các môn chưa có điểm thi cuối kỳ.</p>",
  },
  {
    match: ["lịch", "học hôm nay", "thi", "phòng"],
    html: "<p>Hôm nay (Thứ 2, 01/06) bạn có: <strong>07:00 OOP</strong> (A2-201) và buổi tự học buổi chiều. Thi cuối kỳ CSDL: <strong>20/06</strong>, phòng D9-401. Cần lịch chi tiết hơn không?</p>",
  },
  {
    match: ["java", "code", "lập trình"],
    html: "<p>Mình có thể giúp giải thích cú pháp, gỡ lỗi, hoặc gợi ý cấu trúc chương trình Java. Bạn dán đoạn code hoặc mô tả lỗi cụ thể nhé — mình sẽ phân tích từng bước.</p>",
  },
]

export const FALLBACK_REPLY =
  "<p>Mình đã ghi nhận câu hỏi của bạn. Đây là một chủ đề học tập thú vị! Bạn có thể nói rõ hơn một chút (môn học, bài cụ thể) để mình trả lời chính xác hơn không? Mình có thể giải thích lý thuyết, tóm tắt bài giảng, nhắc deadline hoặc tra cứu điểm/lịch thi.</p>"

export const GREETING =
  "<p>Chào Tùng 👋 Mình là trợ lý học tập AI. Hỏi mình về bài học, deadline, điểm số hay lịch thi nhé — mình sẽ trả lời ngay.</p>"

export const DEFAULT_CONVERSATIONS: Conversation[] = defaultConversations
```

- [ ] **Step 2: Verify the file**

Run: `npx tsc --noEmit features/ai-assistant/mock/chat.mock.ts` (type-check)
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add features/ai-assistant/mock/chat.mock.ts
git commit -m "feat(ai-assistant): add mock data with conversations, replies, suggestions"
```

---

## Task 2: useChat Hook — `features/ai-assistant/hooks/use-chat.ts`

**Files:**
- Create: `features/ai-assistant/hooks/use-chat.ts`
- Test: N/A (React hook, manual test only)

- [ ] **Step 1: Create the hook**

```ts
// features/ai-assistant/hooks/use-chat.ts
"use client"

import { useReducer, useEffect, useCallback, useRef } from "react"
import React from "react"
import {
  DEFAULT_CONVERSATIONS,
  REPLY_RULES,
  FALLBACK_REPLY,
  type Conversation,
  type Message,
} from "@/features/ai-assistant/mock/chat.mock"

const STORAGE_KEY = "lms-ai-conversations"

export interface ChatState {
  activeId: string
  conversations: Conversation[]
}

export type ChatAction =
  | { type: "SELECT_CONVERSATION"; id: string }
  | { type: "SEND_USER_MESSAGE"; text: string }
  | { type: "RECEIVE_AI_REPLY"; html: string }
  | { type: "NEW_CHAT" }
  | { type: "CLEAR_CHAT" }
  | { type: "HYDRATE"; conversations: Conversation[] }
  | { type: "UPDATE_TITLE"; id: string; title: string }

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function curTime() {
  const d = new Date()
  return (
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0")
  )
}

export function pickReply(text: string): string {
  const t = text.toLowerCase()
  for (const rule of REPLY_RULES) {
    if (rule.match.some((m) => t.includes(m))) return rule.html
  }
  return FALLBACK_REPLY
}

function loadFromStorage(): Conversation[] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Conversation[]) : null
  } catch {
    return null
  }
}

function saveToStorage(conversations: Conversation[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  } catch {
    // ignore
  }
}

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, conversations: action.conversations }

    case "SELECT_CONVERSATION":
      return { ...state, activeId: action.id }

    case "UPDATE_TITLE":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.id ? { ...c, title: action.title } : c
        ),
      }

    case "NEW_CHAT": {
      const id = "c" + Date.now()
      const conv: Conversation = {
        id,
        title: "Cuộc trò chuyện mới",
        time: curTime(),
        group: "today",
        messages: [
          {
            role: "ai",
            time: curTime(),
            html:
              "<p>Chào Tùng 👋 Mình là trợ lý học tập AI. Hỏi mình về bài học, deadline, điểm số hay lịch thi nhé — mình sẽ trả lời ngay.</p>",
          },
        ],
      }
      return {
        ...state,
        activeId: id,
        conversations: [conv, ...state.conversations],
      }
    }

    case "CLEAR_CHAT":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === state.activeId
            ? {
                ...c,
                messages: [
                  {
                    role: "ai",
                    time: curTime(),
                    html:
                      "<p>Chào Tùng 👋 Mình là trợ lý học tập AI. Hỏi mình về bài học, deadline, điểm số hay lịch thi nhé — mình sẽ trả lời ngay.</p>",
                  },
                ],
              }
            : c
        ),
      }

    case "SEND_USER_MESSAGE": {
      const text = action.text.trim()
      if (!text) return state
      const userMsg: Message = {
        role: "user",
        time: curTime(),
        html: "<p>" + esc(text).replace(/\n/g, "<br>") + "</p>",
      }
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === state.activeId
            ? { ...c, messages: [...c.messages, userMsg] }
            : c
        ),
      }
    }

    case "RECEIVE_AI_REPLY": {
      const aiMsg: Message = { role: "ai", time: curTime(), html: action.html }
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === state.activeId
            ? { ...c, messages: [...c.messages, aiMsg] }
            : c
        ),
      }
    }

    default:
      return state
  }
}

export function useChat() {
  const stored = loadFromStorage()
  const [state, dispatch] = useReducer(chatReducer, {
    activeId: stored?.[0]?.id ?? DEFAULT_CONVERSATIONS[0].id,
    conversations: stored ?? DEFAULT_CONVERSATIONS,
  })

  useEffect(() => {
    saveToStorage(state.conversations)
  }, [state.conversations])

  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" })
  }, [])

  const getActiveConversation = useCallback(() => {
    return state.conversations.find((c) => c.id === state.activeId)
  }, [state.conversations, state.activeId])

  return {
    state,
    dispatch,
    scrollRef,
    scrollToBottom,
    getActiveConversation,
    activeId: state.activeId,
  }
}
```

- [ ] **Step 3: Verify type-check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add features/ai-assistant/hooks/use-chat.ts
git commit -m "feat(ai-assistant): add useChat hook with reducer + localStorage"
```

---

## Task 3: Suggestions Component — `features/ai-assistant/components/suggestions.tsx`

**Files:**
- Create: `features/ai-assistant/components/suggestions.tsx`
- Modify: N/A

- [ ] **Step 1: Create the Suggestions component**

```tsx
// features/ai-assistant/components/suggestions.tsx
"use client"

import { Sparkles, type LucideIcon } from "lucide-react"
import type { Suggestion } from "@/features/ai-assistant/mock/chat.mock"

const ICON_MAP: Record<string, LucideIcon> = {
  "book-open": Sparkles,
  "calendar-clock": Sparkles,
  "bar-chart-3": Sparkles,
  "file-code-2": Sparkles,
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
```

Update the imports to include the correct Lucide icons:

```tsx
import {
  BookOpen,
  CalendarClock,
  BarChart3,
  FileCode2,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "calendar-clock": CalendarClock,
  "bar-chart-3": BarChart3,
  "file-code-2": FileCode2,
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add features/ai-assistant/components/suggestions.tsx
git commit -m "feat(ai-assistant): add Suggestions component"
```

---

## Task 4: Composer Component — `features/ai-assistant/components/composer.tsx`

**Files:**
- Create: `features/ai-assistant/components/composer.tsx`

- [ ] **Step 1: Create the Composer component**

```tsx
// features/ai-assistant/components/composer.tsx
"use client"

import { useRef, useState, useCallback } from "react"
import { Paperclip, ArrowUp, SendHorizontal } from "lucide-react"

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
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add features/ai-assistant/components/composer.tsx
git commit -m "feat(ai-assistant): add Composer component with textarea + send"
```

---

## Task 5: MessageList Component — `features/ai-assistant/components/message-list.tsx`

**Files:**
- Create: `features/ai-assistant/components/message-list.tsx`

- [ ] **Step 1: Create the MessageList component**

```tsx
// features/ai-assistant/components/message-list.tsx
"use client"

import { useEffect, useRef } from "react"
import { Sparkles, Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
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
```

**Note:** Missing `useState` import. Add `import { useState } from "react"` to the top of the file alongside the existing `useEffect, useRef` import.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add features/ai-assistant/components/message-list.tsx
git commit -m "feat(ai-assistant): add MessageList component with bubbles + typing"
```

---

## Task 6: ConversationPanel Component — `features/ai-assistant/components/conversation-panel.tsx`

**Files:**
- Create: `features/ai-assistant/components/conversation-panel.tsx`

- [ ] **Step 1: Create the ConversationPanel component**

```tsx
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
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add features/ai-assistant/components/conversation-panel.tsx
git commit -m "feat(ai-assistant): add ConversationPanel component"
```

---

## Task 7: ChatShell Component — `features/ai-assistant/components/chat-shell.tsx`

**Files:**
- Create: `features/ai-assistant/components/chat-shell.tsx`

- [ ] **Step 1: Create the ChatShell component**

```tsx
// features/ai-assistant/components/chat-shell.tsx
"use client"

import { useCallback, useState, useEffect } from "react"
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
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Test in browser**

Run: `npm run dev`
Expected: Page loads at `/ai-assistant`, shows 2-column layout, typing simulation works

- [ ] **Step 4: Commit**

```bash
git add features/ai-assistant/components/chat-shell.tsx
git commit -m "feat(ai-assistant): add ChatShell component composing all sub-components"
```

---

## Task 8: Page — `app/(student)/ai-assistant/page.tsx`

**Files:**
- Create: `app/(student)/ai-assistant/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
// app/(student)/ai-assistant/page.tsx
import { ChatShell } from "@/features/ai-assistant/components/chat-shell"

export default function AIAssistantPage() {
  return <ChatShell />
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

Run: `npm run dev` — navigate to http://localhost:3000/ai-assistant
Expected: Chat page renders correctly

- [ ] **Step 3: Commit**

```bash
git add app/\(student\)/ai-assistant/page.tsx
git commit -m "feat: add AI Assistant page at /ai-assistant"
```

---

## Task 9: Sidebar Button Wiring — `components/app-sidebar.tsx`

**Files:**
- Modify: `components/app-sidebar.tsx`

- [ ] **Step 1: Find the assistant button**

Read `components/app-sidebar.tsx` and locate the `.assistant-btn` button. It currently has `onClick={window.location.href='ai-chat.html'}`. Replace with Next.js router navigation.

Add to imports (or find existing):
```tsx
import { useRouter } from "next/navigation"
```

Inside the component, add:
```tsx
const router = useRouter()
```

Replace the button `onClick`:
```tsx
onClick={() => router.push("/ai-assistant")}
```

Or if using `<Link>`:
```tsx
import Link from "next/link"
// change <button> to <Link> or use router.push
```

Check existing pattern in the file first — if the button already uses `router.push` or a different approach, follow that pattern.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

Run: `npm run dev` — click "Chat ngay" in sidebar → should navigate to `/ai-assistant`

- [ ] **Step 3: Commit**

```bash
git add components/app-sidebar.tsx
git commit -m "feat(sidebar): wire assistant button to /ai-assistant route"
```

---

## Verification Checklist

After all tasks complete, verify:

- [ ] `/ai-assistant` page loads with 2-column layout
- [ ] Conversation panel shows 5 mock conversations grouped by today/earlier
- [ ] Clicking a conversation loads its messages in the thread
- [ ] "Cuộc trò chuyện mới" creates a new conversation and switches to it
- [ ] Sending a message shows typing indicator for ~1.15s then AI reply appears
- [ ] AI replies match keyword patterns (try: "GPA", "deadline", "abstract")
- [ ] "Xóa hội thoại" clears messages back to greeting
- [ ] Suggestions chips appear when conversation has ≤ 1 message, disappear after first real user message
- [ ] Search filters conversation list
- [ ] localStorage persists across page reloads
- [ ] Sidebar "Chat ngay" button navigates to `/ai-assistant`
- [ ] `< 980px`: conversation panel hidden, thread full width
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
