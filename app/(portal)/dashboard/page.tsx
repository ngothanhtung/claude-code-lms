import { StatCard } from "@/components/stat-card"
import { CourseCard } from "@/components/course-card"
import { BookOpenIcon, CheckCircleIcon, ClockIcon, TrendingUpIcon } from "lucide-react"

const mockCourses = [
    { title: "Lập trình Python cơ bản", category: "violet" as const, instructor: "TS. Minh Tuấn", progress: 72, lessonCount: 24 },
    { title: "Toán rời rạc", category: "blue" as const, instructor: "PGS. Lan Hương", progress: 45, lessonCount: 18 },
    { title: "Nhập môn AI & ML", category: "green" as const, instructor: "TS. Hoàng Nam", progress: 88, lessonCount: 12 },
]

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[26px] font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                    Tổng quan
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Chào mừng bạn quay trở lại! Đây là tiến độ học tập của bạn.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Khóa học đang học" value="5" icon={<BookOpenIcon className="h-5 w-5" />} iconTint="indigo" trend={{ value: 2, label: "so với tháng trước" }} />
                <StatCard label="Hoàn thành tuần này" value="3" icon={<CheckCircleIcon className="h-5 w-5" />} iconTint="green" trend={{ value: 12 }} />
                <StatCard label="Bài tập đang chờ" value="7" icon={<ClockIcon className="h-5 w-5" />} iconTint="amber" />
                <StatCard label="Điểm trung bình" value="8.4" icon={<TrendingUpIcon className="h-5 w-5" />} iconTint="blue" trend={{ value: 5 }} />
            </div>

            {/* Courses */}
            <div>
                <h2 className="text-base font-bold tracking-tight" style={{ letterSpacing: "-0.01em" }}>
                    Khóa học đang theo học
                </h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockCourses.map((course) => (
                        <CourseCard key={course.title} {...course} />
                    ))}
                </div>
            </div>
        </div>
    )
}
