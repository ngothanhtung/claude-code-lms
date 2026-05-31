"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BookOpenIcon,
    CalendarIcon,
    LayoutDashboardIcon,
    SettingsIcon,
    BellIcon,
    Code2Icon,
    GraduationCapIcon,
    ChevronDownIcon,
    BotMessageSquareIcon,
    PanelLeftCloseIcon,
    PanelLeftIcon,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
    useSidebar,
} from "@/components/ui/sidebar"

const mainNavItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboardIcon,
        href: "/dashboard",
    },
    {
        title: "Khóa học của tôi",
        icon: GraduationCapIcon,
        href: "/courses",
    },
    {
        title: "Lịch học",
        icon: CalendarIcon,
        href: "/calendar",
    },
    {
        title: "Bài tập",
        icon: BookOpenIcon,
        sub: [
            { title: "Cá nhân", href: "/assignments/personal" },
            { title: "Nhóm", href: "/assignments/group" },
        ],
    },
]

const otherNavItems = [
    {
        title: "Workspace",
        icon: Code2Icon,
        href: "/workspace",
    },
    {
        title: "Thông báo",
        icon: BellIcon,
        href: "/notifications",
    },
    {
        title: "Cài đặt",
        icon: SettingsIcon,
        href: "/settings",
    },
]

export function AppSidebar() {
    const { state, toggleSidebar } = useSidebar()
    const pathname = usePathname()
    const [assignmentsOpen, setAssignmentsOpen] = useState(true)

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

    return (
        <Sidebar className="border-r border-sidebar-border" collapsible="icon">
            <SidebarHeader className="h-(--topbar-height) flex flex-row items-center gap-3 border-b border-sidebar-border px-4">
                {/* Brand Logo */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-br from-[oklch(0.52_0.22_280)] to-[oklch(0.41_0.17_277)]">
                    <GraduationCapIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-[18px] font-extrabold tracking-tight text-sidebar-foreground">
                        UniLMS
                    </span>
                    <span className="text-[11.5px] font-medium text-sidebar-foreground/50">
                        Học tập thông minh
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Học tập Group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                        Học tập
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    {item.sub ? (
                                        <>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={isActive("/assignments")}
                                                onClick={() => setAssignmentsOpen(!assignmentsOpen)}
                                                className="group-data-[collapsible=icon]:hidden"
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                                <ChevronDownIcon className={cn(
                                                    "ml-auto h-4 w-4 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
                                                    assignmentsOpen && "rotate-180"
                                                )} />
                                            </SidebarMenuButton>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={isActive("/assignments")}
                                                onClick={() => setAssignmentsOpen(!assignmentsOpen)}
                                                className="hidden group-data-[collapsible=icon]:flex"
                                            >
                                                <item.icon />
                                            </SidebarMenuButton>
                                            <SidebarMenuSub className={cn(
                                                "transition-all duration-200 ease-in-out",
                                                !assignmentsOpen && "h-0 overflow-hidden opacity-0"
                                            )}>
                                                {item.sub.map((sub) => (
                                                    <SidebarMenuSubItem key={sub.href}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={isActive(sub.href)}
                                                        >
                                                            <Link href={sub.href}>{sub.title}</Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </>
                                    ) : (
                                        <SidebarMenuButton tooltip={item.title} isActive={isActive(item.href)} asChild>
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator className="mx-2" />

                {/* Khác Group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                        Khác
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {otherNavItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton tooltip={item.title} isActive={isActive(item.href)} asChild>
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Assistant Card */}
                <div className="mx-3 mt-4 hidden group-data-[collapsible=icon]:block">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-gradient-to-br from-[oklch(0.52_0.22_280)] to-[oklch(0.41_0.17_277)]">
                        <BotMessageSquareIcon className="h-5 w-5 text-white" />
                    </div>
                </div>
                <div className="mx-3 mt-4 group-data-[collapsible=icon]:hidden">
                    <div className="rounded-[14px] bg-gradient-to-br from-[oklch(0.96_0.04_277)] to-[oklch(0.94_0.06_280)] p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.52_0.22_280)] to-[oklch(0.41_0.17_277)]">
                                <BotMessageSquareIcon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-sidebar-foreground">Trợ lý AI</span>
                        </div>
                        <p className="text-xs text-sidebar-foreground/60 mb-3">
                            Hỏi đáp bài giảng, gợi ý học tập, và hỗ trợ 24/7
                        </p>
                        <button className="w-full rounded-[9px] bg-[oklch(0.41_0.17_277)] py-2 text-xs font-semibold text-white transition-colors hover:bg-[oklch(0.36_0.17_277)]">
                            Chat ngay
                        </button>
                    </div>
                </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={state === "expanded" ? "Thu gọn" : "Mở rộng"}
                            onClick={toggleSidebar}
                        >
                            {state === "expanded" ? (
                                <PanelLeftCloseIcon />
                            ) : (
                                <PanelLeftIcon />
                            )}
                            <span className="group-data-[collapsible=icon]:hidden">
                                Thu gọn
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
