import {
    FileTextIcon, BarChart3Icon, MegaphoneIcon, CalendarHeartIcon,
    BookOpenIcon, UploadIcon, VideoIcon
} from "lucide-react"
import { NotificationItem } from "@/components/notification-item"
import { ActivityItem } from "@/components/activity-item"
import { QuickActions } from "@/components/quick-actions"
import { DonutChart } from "@/components/donut-chart"
import Link from "next/link"

const donutSegments = [
    { value: 12, color: "oklch(0.63 0.19 152)" },
    { value: 6, color: "oklch(0.60 0.18 250)" },
    { value: 2, color: "oklch(0.70 0.18 75)" },
    { value: 1, color: "oklch(0.55 0.22 27)" },
]

export function DashboardRail() {
    return (
        <aside className="flex flex-col gap-5">
            {/* Notifications */}
            <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[16.5px] font-bold tracking-tight m-0">Thông báo gần đây</h2>
                    <Link href="/notifications" className="text-[13px] font-semibold text-primary hover:underline">Xem tất cả</Link>
                </div>
                <NotificationItem icon={<FileTextIcon className="h-[14px] w-[14px]" />} iconTint="indigo" title="Giảng viên thông báo bài tập mới" subtitle="Lập trình Java - Bài tập số 4" time="10 phút trước" unread />
                <NotificationItem icon={<BarChart3Icon className="h-[14px] w-[14px]" />} iconTint="green" title="Điểm mới được công bố" subtitle="Cơ sở dữ liệu - Quiz 1" time="1 giờ trước" />
                <NotificationItem icon={<MegaphoneIcon className="h-[14px] w-[14px]" />} iconTint="amber" title="Thông báo từ Phòng Đào tạo" subtitle="Về việc đăng ký học phần học kỳ III" time="3 giờ trước" />
                <NotificationItem icon={<CalendarHeartIcon className="h-[14px] w-[14px]" />} iconTint="red" title="Sự kiện sắp diễn ra" subtitle="Ngày hội việc làm mùa Hè 2026" time="1 ngày trước" />
                <div className="text-center mt-[10px] pt-[14px] border-t border-border">
                    <Link href="/notifications" className="text-[13px] font-semibold text-primary hover:underline">Xem tất cả thông báo →</Link>
                </div>
            </div>

            {/* Results */}
            <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[16.5px] font-bold tracking-tight m-0">Kết quả học tập</h2>
                    <Link href="/results" className="text-[13px] font-semibold text-primary hover:underline">Xem chi tiết</Link>
                </div>
                <div className="flex items-center gap-4">
                    <DonutChart segments={donutSegments} centerLabel="21" centerSub="môn học" />
                    <div className="flex flex-col gap-[9px] flex-1">
                        <div className="flex items-center gap-2 text-[12.5px]">
                            <span className="h-[9px] w-[9px] rounded-full shrink-0 bg-[oklch(0.63_0.19_152)]" />
                            <span className="flex-1 font-medium">Tốt (A, B)</span>
                            <span className="text-muted-foreground font-semibold text-[12px]">12 môn (57%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12.5px]">
                            <span className="h-[9px] w-[9px] rounded-full shrink-0 bg-[oklch(0.60_0.18_250)]" />
                            <span className="flex-1 font-medium">Khá (C)</span>
                            <span className="text-muted-foreground font-semibold text-[12px]">6 môn (29%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12.5px]">
                            <span className="h-[9px] w-[9px] rounded-full shrink-0 bg-[oklch(0.70_0.18_75)]" />
                            <span className="flex-1 font-medium">Trung bình (D)</span>
                            <span className="text-muted-foreground font-semibold text-[12px]">2 môn (10%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12.5px]">
                            <span className="h-[9px] w-[9px] rounded-full shrink-0 bg-[oklch(0.55_0.22_27)]" />
                            <span className="flex-1 font-medium">Yếu (F)</span>
                            <span className="text-muted-foreground font-semibold text-[12px]">1 môn (4%)</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 mt-4 pt-4 border-t border-border">
                    <div className="text-center">
                        <div className="text-[12px] text-muted-foreground">CPA hiện tại</div>
                        <div className="text-[22px] font-extrabold mt-[3px]" style={{ letterSpacing: "-0.01em" }}>3.38</div>
                    </div>
                    <div className="text-center border-l border-border">
                        <div className="text-[12px] text-muted-foreground">Xếp loại</div>
                        <div className="text-[22px] font-extrabold mt-[3px] text-primary" style={{ letterSpacing: "-0.01em" }}>Khá</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                <h2 className="text-[16.5px] font-bold tracking-tight mb-4">Thao tác nhanh</h2>
                <QuickActions />
            </div>

            {/* Activity */}
            <div className="rounded-[var(--radius)] border border-border bg-card shadow-[var(--shadow-card)] p-5">
                <h2 className="text-[16.5px] font-bold tracking-tight mb-0">Hoạt động gần đây</h2>
                <ActivityItem icon={<BookOpenIcon className="h-[14px] w-[14px]" />} iconTint="red" title="Bạn đã xem tài liệu" subtitle="Lecture 3 - OOP Principles.pdf" time="2 giờ trước" />
                <ActivityItem icon={<UploadIcon className="h-[14px] w-[14px]" />} iconTint="green" title="Bạn đã nộp bài tập" subtitle="BTL_OOP_Chuong2.zip" time="Hôm qua" />
                <ActivityItem icon={<VideoIcon className="h-[14px] w-[14px]" />} iconTint="blue" title="Bạn đã tham gia lớp học" subtitle="CSDL - Online Class" time="Hôm qua" />
                <ActivityItem icon={<BarChart3Icon className="h-[14px] w-[14px]" />} iconTint="amber" title="Bạn đã xem điểm" subtitle="Quiz 1 - Cơ sở dữ liệu" time="2 ngày trước" />
            </div>
        </aside>
    )
}
