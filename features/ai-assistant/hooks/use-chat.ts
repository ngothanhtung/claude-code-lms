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
