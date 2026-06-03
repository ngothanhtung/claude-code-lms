"use client"

import {
  BellIcon,
  CalendarIcon,
  ChevronDownIcon,
  MenuIcon,
  MessageSquareIcon,
  SearchIcon,
  SettingsIcon,
  LogOutIcon,
  UserRoundIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppTopbar() {
  return (
    <header className="topbar">
      <Button
        className="icon-btn"
        variant="ghost"
        size="icon"
        aria-label="Thu gọn menu"
        type="button"
      >
        <MenuIcon className="icon-lg" />
      </Button>

      <div className="search">
        <SearchIcon className="icon" />
        <input
          placeholder="Tìm kiếm khóa học, tài liệu, bài tập..."
          type="text"
        />
      </div>

      <div className="topbar-right">
        <Button
          className="icon-btn"
          variant="ghost"
          size="icon"
          aria-label="Lịch"
          type="button"
        >
          <CalendarIcon className="icon-lg" />
        </Button>
        <Button
          className="icon-btn"
          variant="ghost"
          size="icon"
          aria-label="Thông báo"
          type="button"
        >
          <BellIcon className="icon-lg" />
          <span className="dot-badge">6</span>
        </Button>
        <Button
          className="icon-btn"
          variant="ghost"
          size="icon"
          aria-label="Tin nhắn"
          type="button"
        >
          <MessageSquareIcon className="icon-lg" />
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="profile" type="button">
              <div className="profile-meta">
                <div className="profile-name">Ngô Thanh Tùng</div>
                <div className="profile-sub">MSSV: 21123456</div>
              </div>
              <Avatar className="avatar" size="lg">
                <AvatarFallback className="rounded-[11px] bg-transparent text-[15px] font-bold text-white">
                  A
                </AvatarFallback>
              </Avatar>
              <ChevronDownIcon className="icon-sm profile-caret text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-[13px]">
            <DropdownMenuItem className="gap-3">
              <UserRoundIcon className="h-4 w-4" />
              Tài khoản
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3">
              <SettingsIcon className="h-4 w-4" />
              Cấu hình
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-3 text-destructive focus:text-destructive">
              <LogOutIcon className="h-4 w-4" />
              Thoát
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
