import {
  FileQuestionIcon,
  TerminalIcon,
  HelpCircleIcon,
  BookOpenIcon,
  CalendarClockIcon,
  CircleDollarSignIcon,
  FolderGit2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "lucide-react"
import { GreetingCard } from "@/components/greeting-card"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { StatCardDashboard } from "@/components/stat-card-dashboard"
import { TodoItem } from "@/components/todo-item"
import { ScheduleSlot } from "@/components/schedule-slot"
import { CourseCardDashboard } from "@/components/course-card-dashboard"
import { DashboardRail } from "@/components/dashboard-rail"

const mockCourses = [
  {
    title: "Lập trình hướng đối tượng",
    category: "violet" as const,
    instructor: "Nguyễn Minh Tuấn",
    progress: 66,
    assignments: 2,
    grade: "8.5",
  },
  {
    title: "Cơ sở dữ liệu",
    category: "green" as const,
    instructor: "Trần Thị Hương",
    progress: 48,
    assignments: 1,
    grade: "7.0",
  },
  {
    title: "Cấu trúc dữ liệu và giải thuật",
    category: "blue" as const,
    instructor: "Lê Văn Nam",
    progress: 72,
    assignments: 0,
    grade: "8.0",
  },
  {
    title: "Lập trình Java",
    category: "amber" as const,
    instructor: "Phạm Quốc Bảo",
    progress: 30,
    assignments: 3,
    grade: "6.5",
  },
  {
    title: "Tiếng Anh học thuật",
    category: "teal" as const,
    instructor: "Đỗ Thu Trang",
    progress: 60,
    assignments: 1,
    grade: "9.0",
  },
  {
    title: "Claude Code for BackEnd",
    category: "rust" as const,
    instructor: "Hoàng Anh Khoa",
    progress: 15,
    assignments: 1,
    grade: "—",
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <GreetingCard
        userName="Ngô Thanh Tùng"
        semester="Học kỳ II, năm học 2025 - 2026"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCardDashboard variant="gpa" />
        <StatCardDashboard variant="credits" />
        <StatCardDashboard variant="semester" />
        <StatCardDashboard variant="todos" />
      </div>

      <AnnouncementBanner
        title="Thông báo quan trọng"
        message="Sinh viên khóa K21 đăng ký học phần học kỳ III từ ngày 20/05 – 30/05/2026. Xem chi tiết tại đây"
        href="#"
      />

      {/* Two-column: Todos + Schedule */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Todos */}
        <div className="rounded-[var(--radius)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
              Việc cần làm hôm nay
            </h2>
            <a
              href="#"
              className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
            >
              Xem tất cả <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
          <TodoItem
            icon={<FileQuestionIcon className="h-[18px] w-[18px]" />}
            iconTint="red"
            title="Nộp Assignment OOP – Bài tập lớn chương 3"
            subtitle="Lập trình hướng đối tượng"
            badge={{ label: "Hạn hôm nay", variant: "destructive" }}
            dueTime="23:59"
            action="Nộp bài"
            actionVariant="primary"
          />
          <TodoItem
            icon={<TerminalIcon className="h-[18px] w-[18px]" />}
            iconTint="red"
            title="Nộp Lab 1 – Build REST API với Claude Code"
            subtitle="Claude Code for BackEnd"
            badge={{ label: "Còn 4 giờ", variant: "warning" }}
            dueTime="22:00"
            action="Nộp bài"
            actionVariant="primary"
          />
          <TodoItem
            icon={<HelpCircleIcon className="h-[18px] w-[18px]" />}
            iconTint="amber"
            title="Quiz Java - Quiz 2"
            subtitle="Lập trình Java"
            badge={{ label: "Còn 2 giờ", variant: "warning" }}
            dueTime="20:00"
            action="Làm quiz"
          />
          <TodoItem
            icon={<BookOpenIcon className="h-[18px] w-[18px]" />}
            iconTint="blue"
            title="Đọc tài liệu trước buổi học"
            subtitle="Cơ sở dữ liệu"
            badge={{ label: "Ngày mai", variant: "info" }}
            dueTime="21/05"
            action="Xem ngay"
          />
          <TodoItem
            icon={<CalendarClockIcon className="h-[18px] w-[18px]" />}
            iconTint="indigo"
            title="Lịch thi giữa kỳ CTDL&GT"
            subtitle="Cấu trúc dữ liệu và giải thuật"
            badge={{ label: "Ngày mai", variant: "info" }}
            dueTime="21/05"
            action="Xem lịch thi"
          />
          <TodoItem
            icon={<CircleDollarSignIcon className="h-[18px] w-[18px]" />}
            iconTint="green"
            title="Đóng học phí học kỳ II"
            subtitle="Phòng Tài chính"
            badge={{ label: "Còn 5 ngày", variant: "success" }}
            dueTime="25/05"
            action="Thanh toán"
          />
          <TodoItem
            icon={<FolderGit2Icon className="h-[18px] w-[18px]" />}
            iconTint="indigo"
            title="Đọc yêu cầu đồ án cuối kỳ"
            subtitle="Lập trình hướng đối tượng"
            badge={{ label: "Còn 20 ngày", variant: "success" }}
            dueTime="09/06"
            action="Xem ngay"
          />
        </div>

        {/* Schedule */}
        <div className="rounded-[var(--radius)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
              Lịch học hôm nay
            </h2>
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] font-medium text-muted-foreground">
                Thứ 6, 29/05/2026
              </span>
              <div className="flex gap-1">
                <button className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-border bg-card text-muted-foreground hover:bg-muted">
                  <ChevronLeftIcon className="h-3.5 w-3.5" />
                </button>
                <button className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-border bg-card text-muted-foreground hover:bg-muted">
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          <ScheduleSlot
            time="08:00 - 09:50"
            status="live"
            title="Cơ sở dữ liệu"
            room="A1-201"
            tag="Đang diễn ra"
            tagColor="oklch(0.63 0.19 152)"
          />
          <ScheduleSlot
            time="10:00 - 11:50"
            status="default"
            title="Lập trình hướng đối tượng"
            room="B1-302"
            action={{ label: "Tham gia online", variant: "outline" }}
          />
          <ScheduleSlot
            time="13:00 - 14:50"
            status="default"
            title="Tiếng Anh học thuật"
            room="C2-405"
            action={{ label: "Xem chi tiết", variant: "default" }}
          />

          <div className="mt-2 flex items-center gap-2.5 border-t border-border pt-3 text-[11.5px] font-bold tracking-wide text-muted-foreground uppercase">
            NGÀY MAI · THỨ 7, 30/05/2026
          </div>

          <ScheduleSlot
            time="07:30 - 09:20"
            status="upcoming"
            title="Cấu trúc dữ liệu và giải thuật"
            room="A2-105"
            tag="Sắp tới"
            tagColor="oklch(0.55 0.01 265)"
          />
          <ScheduleSlot
            time="10:00 - 11:50"
            status="upcoming"
            title="Lập trình Java"
            room="B1-204"
            tag="Sắp tới"
            tagColor="oklch(0.55 0.01 265)"
          />
          <ScheduleSlot
            time="13:00 - 14:50"
            status="upcoming"
            title="Claude Code for BackEnd"
            room="Lab CNTT-301"
            tag="Sắp tới"
            tagColor="oklch(0.55 0.01 265)"
          />

          <div className="mt-[6px] border-t border-border pt-[14px] text-center">
            <a
              href="/calendar"
              className="flex items-center justify-center gap-1 text-[13px] font-semibold text-primary hover:underline"
            >
              Xem toàn bộ lịch học <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Courses + Right Rail side by side */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1fr_404px]">
        {/* Courses */}
        <div className="rounded-[var(--radius)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
              Các môn học đang học
            </h2>
            <a
              href="/courses"
              className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
            >
              Xem tất cả <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((c) => (
              <CourseCardDashboard key={c.title} {...c} />
            ))}
          </div>
        </div>

        {/* Right Rail */}
        <DashboardRail />
      </div>
    </div>
  )
}
