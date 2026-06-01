# AI Assistant Chat — Design Specification

## Overview

Implement the AI Chat feature for the LMS student portal, matching the prototype in `docs/prototype/ai-chat.html`. The chat provides an AI learning assistant that can answer questions about courses, assignments, deadlines, grades, and exam schedules.

## Decisions

- **Mock-only AI** — replies are keyword-matched against canned responses; no backend required.
- **Full-width layout** — page uses the full content area (sidebar already renders). Internal layout: 2-column (286px conversation panel + thread).
- **Sidebar card only** — AI Assistant appears as a fixed card at the bottom of the sidebar; no new nav item.
- **localStorage persistence** — conversations survive page reloads. Mock data provides defaults.

## File Structure

```
features/ai-assistant/
├── components/
│   ├── chat-shell.tsx          # Client — 2-col grid, owns all state
│   ├── conversation-panel.tsx  # Client — left sidebar (286px)
│   ├── message-list.tsx         # Client — thread + bubbles
│   ├── composer.tsx             # Client — textarea + send button
│   └── suggestions.tsx          # Client — suggestion chips
├── hooks/
│   └── use-chat.ts              # useReducer + localStorage
└── mock/
    └── chat.mock.ts             # Typed mock data

app/(student)/ai-assistant/
└── page.tsx                     # Server — renders ChatShell
```

## Data Types

```ts
interface Message {
  role: 'ai' | 'user'
  time: string      // "HH:mm" format
  html: string      // raw HTML (bubble content)
}

interface Conversation {
  id: string
  title: string
  time: string      // "HH:mm" or "Hôm qua" or date string
  group: 'today' | 'earlier'
  messages: Message[]
}

interface ReplyRule {
  match: string[]   // keywords to match
  html: string      // reply HTML
}
```

## State Shape

```ts
interface ChatState {
  activeId: string
  conversations: Conversation[]
}
```

Actions: `SEND_MESSAGE`, `NEW_CHAT`, `CLEAR_CHAT`, `SELECT_CONVERSATION`.

localStorage key: `lms-ai-conversations`. Init: merge default mock conversations with localStorage data (localStorage wins).

## Components

### 1. ChatShell (`chat-shell.tsx`)
- `"use client"`
- Grid 2-col: `grid-cols-[286px_1fr]`, full viewport height minus topbar
- Wraps `ConversationPanel` (left) + right column (right)
- Right column: `MessageList` (flex-1) + `Composer` + `Suggestions`
- Owns `useReducer` state, passes down via props + callbacks
- `useEffect` for localStorage read/write (sync on every state change)

### 2. ConversationPanel (`conversation-panel.tsx`)
- Props: `conversations`, `activeId`, `onSelect`, `searchValue`
- Header: primary button "Cuộc trò chuyện mới" + search input with Lucide search icon
- Groups: "HÔM NAY" / "TRƯỚC ĐÓ" — filter + group conversations
- Each item: icon-square avatar, title (truncate), snippet from last message (strip HTML, 48 chars), time
- Active item: `bg-primary/10`, title `text-primary`
- Click → `onSelect(id)`

### 3. MessageList (`message-list.tsx`)
- Props: `messages`, `isTyping`, `onCopy`, `onFeedback`
- `ScrollArea` from shadcn wrapping messages
- AI message: gradient avatar (sparkles) | bubble card (border, shadow, `border-top-left-radius: 5px`) | footer actions | time
- User message: bubble (primary bg, `border-top-right-radius: 5px`, white text) | time right-aligned, no avatar
- Bubble HTML: `dangerouslySetInnerHTML={{ __html: m.html }}`
- Typing indicator: 3 animated dots in bubble, shown when `isTyping === true`
- Scroll to bottom on mount + whenever messages/isTyping changes

### 4. Composer (`composer.tsx`)
- Props: `onSend`, `disabled`
- Border box 16px radius, flex row: attach btn + textarea + send btn
- `useRef` for textarea to auto-resize (max-height: 160px)
- `Enter` → send, `Shift+Enter` → newline
- Send button disabled when textarea empty
- Focus ring on textarea focus (ring shadow)
- Hint text below: keyboard shortcuts + disclaimer

### 5. Suggestions (`suggestions.tsx`)
- Props: `suggestions`, `onClick`
- Row of chip buttons with Lucide icons
- Visible only when conversation has ≤ 1 message (no real user message yet)
- 4 default suggestions from prototype

### 6. useChat (`use-chat.ts`)
- `useReducer` with typed actions
- `pickReply(text)` — keyword match against `ReplyRule[]`, returns first match or fallback
- On `SEND_MESSAGE`: push user message → set `isTyping: true` → `setTimeout(1150ms)` → push AI reply → set `isTyping: false`
- Auto-scroll after each change
- Init from localStorage (merge with defaults)

## Mock Data

Conversations: 5 sample conversations (today + earlier groups), matching prototype data:
- Abstract class vs Interface (active)
- Deadline bài tập tuần này
- Cách tính GPA
- Tóm tắt Lecture 7
- Phòng thi cuối kỳ

Suggestions: 4 chips from prototype.

Replies: keyword-matched canned responses for: abstract/interface, deadline/hạn/bài tập, điểm/gpa, lịch/thi, java/code.

Greeting: default AI greeting message.

## Styling

Use Tailwind CSS utility classes + existing CSS custom properties from `globals.css`. No new CSS variables needed. Bubble code blocks use `bg-slate-900 text-slate-200 font-mono`.

## Sidebar Integration

The existing `.assistant` CSS class in `globals.css` already renders an AI Assistant card at the bottom of the sidebar. The button `onClick` should navigate to `/ai-assistant`. No new nav item added.

## Responsive

- `< 980px`: Conversation panel hidden (same as prototype). Thread takes full width.
