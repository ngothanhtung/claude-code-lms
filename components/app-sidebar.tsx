"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BarChart3Icon,
    BellIcon,
    BookOpenCheckIcon,
    CalendarClockIcon,
    CalendarDaysIcon,
    ChevronDownIcon,
    CircleDollarSignIcon,
    ClipboardCheckIcon,
    FileTextIcon,
    FolderOpenIcon,
    GraduationCapIcon,
    HomeIcon,
    LifeBuoyIcon,
    MessageCircleIcon,
    SettingsIcon,
    SparklesIcon,
    UserCheckIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { title: "Trang chủ", icon: HomeIcon, href: "/dashboard" },
    { title: "Khóa học của tôi", icon: BookOpenCheckIcon, href: "/courses" },
    { title: "Lịch học", icon: CalendarDaysIcon, href: "/calendar" },
    {
        title: "Bài tập",
        icon: FileTextIcon,
        href: "/assignments",
        sub: [
            { title: "Bài tập cá nhân", href: "/assignments/personal" },
            { title: "Bài tập nhóm", href: "/assignments/group" },
            { title: "Đồ án cuối kỳ", href: "/final-project" },
        ],
    },
    { title: "Kết quả học tập", icon: BarChart3Icon, href: "/results" },
    { title: "Điểm danh", icon: UserCheckIcon, href: "/attendance" },
    { title: "Lịch thi", icon: CalendarClockIcon, href: "/exams" },
    {
        title: "Tài liệu",
        icon: FolderOpenIcon,
        href: "/documents",
        open: true,
        sub: [
            { title: "Tài liệu tham khảo", href: "/documents" },
            { title: "Tài liệu luyện thi", href: "/exam-materials" },
        ],
    },
    { title: "Thông báo", icon: BellIcon, href: "/notifications", badge: "6" },
    { title: "Học phí", icon: CircleDollarSignIcon, href: "/tuition" },
    { title: "Đăng ký môn học", icon: ClipboardCheckIcon, href: "/registration" },
    { title: "Hỗ trợ", icon: LifeBuoyIcon, href: "/support" },
    { title: "Cài đặt", icon: SettingsIcon, href: "/settings" },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-mark">
                    <GraduationCapIcon className="h-6 w-6" />
                </div>
                <div>
                    <div className="brand-name">LMS Portal</div>
                    <div className="brand-sub">Dành cho Sinh viên</div>
                </div>
            </div>

            <nav className="nav">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    if (item.sub) {
                        return (
                            <div className={cn("nav-group", item.open && "open")} key={item.title}>
                                <button
                                    type="button"
                                    className={cn(
                                        "nav-item nav-parent",
                                        active && "active",
                                    )}
                                    data-tip={item.title}
                                >
                                    <Icon className="icon" />
                                    <span>{item.title}</span>
                                    <ChevronDownIcon className="icon-sm nav-caret" />
                                </button>
                                <div className="nav-sub">
                                    <div className="nav-sub-inner">
                                        {item.sub.map((sub) => (
                                            <Link
                                                className="nav-subitem"
                                                href={sub.href}
                                                key={sub.title}
                                            >
                                                <span className="nav-dot" />
                                                {sub.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    return (
                        <Link
                            className={cn(
                                "nav-item",
                                active && "active",
                            )}
                            data-tip={item.title}
                            href={item.href}
                            key={item.title}
                        >
                            <Icon className="icon" />
                            {item.title}
                            {item.badge && (
                                <span className="nav-badge">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="assistant">
                <div className="assistant-top">
                    <div className="assistant-avatar">
                        <SparklesIcon className="icon" />
                    </div>
                    <div>
                        <div className="assistant-title">AI Assistant</div>
                        <div className="assistant-sub">Bạn cần hỗ trợ gì?</div>
                    </div>
                </div>
                <button className="assistant-btn" type="button">
                    <MessageCircleIcon className="icon-sm" />
                    Chat ngay
                </button>
            </div>
        </aside>
    )
}
