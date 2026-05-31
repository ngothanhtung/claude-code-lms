"use client"

import { SearchIcon, BellIcon, ChevronDownIcon, GlobeIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Chào buổi sáng"
    if (hour < 18) return "Chào buổi chiều"
    return "Chào buổi tối"
}

function formatDate() {
    return new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
    })
}

export function AppTopbar() {
    const [lang, setLang] = useState<"vi" | "en">("vi")

    return (
        <header className="sticky top-0 z-40 flex h-(--topbar-height) items-center border-b border-border bg-background/95 backdrop-blur px-6 gap-4">
            {/* Left: Greeting */}
            <div className="flex flex-col min-w-0 flex-1">
                <h1 className="text-base font-semibold text-foreground truncate">
                    {getGreeting()}, Tùng! 👋
                </h1>
                <p className="text-xs text-muted-foreground">
                    {formatDate()}
                </p>
            </div>

            {/* Center: Search */}
            <div className="relative hidden md:flex flex-1 max-w-md">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Tìm kiếm khóa học, bài tập..."
                    className="h-11 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-[3px] focus:ring-ring/15 transition-all"
                />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Language */}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setLang(l => l === "vi" ? "en" : "vi")}
                    className="text-muted-foreground"
                >
                    <GlobeIcon className="h-4 w-4" />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground relative">
                    <BellIcon className="h-4 w-4" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
                </Button>

                {/* Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors">
                            <Avatar size="sm">
                                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tung" />
                                <AvatarFallback>T</AvatarFallback>
                            </Avatar>
                            <div className="hidden lg:flex flex-col items-start">
                                <span className="text-sm font-medium leading-none">Ngô Thanh Tùng</span>
                                <span className="text-xs text-muted-foreground leading-none mt-0.5">Sinh viên</span>
                            </div>
                            <ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground hidden lg:block" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
                        <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Đăng xuất</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
