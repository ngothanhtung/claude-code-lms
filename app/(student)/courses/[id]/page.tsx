// app/(student)/courses/[id]/page.tsx
"use client"

import { use, useState, useCallback, useMemo } from "react"
import {
  Hash,
  Calendar,
  MapPin,
  Layers,
  Users,
  User,
  Mail,
  Video,
  Loader2,
  Newspaper,
  ListChecks,
  FileText,
  Folder,
  BarChart3,
  Heart,
  MessageCircle,
  Play,
  Code,
  Lock,
  Check,
  ChevronDown,
  Upload,
  Download,
  Presentation,
  FileCode2,
  FileSpreadsheet,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Terminal,
  Database,
  Network,
  Coffee,
  Bookmark,
} from "lucide-react"
import { allCourses, type Course } from "@/features/courses/mock"
import {
  COURSE_DETAILS_MAP,
  COURSE_FULL_DETAILS_MAP,
} from "@/features/courses/mock/course-details.mock"
import { PageHeader } from "@/components/page-header"

interface PageProps {
  params: Promise<{ id: string }>
}

// Map categories to specific styles and icons
const categoryMeta = {
  violet: {
    gradient: "from-purple-600 to-indigo-600",
    emblemBg: "bg-white/15",
    buttonText: "text-indigo-600",
    icon: Code,
    accentText: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
    colorClass: "indigo",
  },
  green: {
    gradient: "from-emerald-600 to-teal-600",
    emblemBg: "bg-white/15",
    buttonText: "text-teal-600",
    icon: Database,
    accentText: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    colorClass: "green",
  },
  blue: {
    gradient: "from-blue-600 to-sky-600",
    emblemBg: "bg-white/15",
    buttonText: "text-blue-600",
    icon: Network,
    accentText: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    colorClass: "blue",
  },
  amber: {
    gradient: "from-amber-500 to-orange-500",
    emblemBg: "bg-white/15",
    buttonText: "text-amber-600",
    icon: Coffee,
    accentText: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    colorClass: "amber",
  },
  teal: {
    gradient: "from-teal-600 to-cyan-600",
    emblemBg: "bg-white/15",
    buttonText: "text-teal-600",
    icon: BookOpen,
    accentText: "text-teal-600",
    badge: "bg-teal-100 text-teal-700",
    colorClass: "teal",
  },
  rust: {
    gradient: "from-rose-600 to-amber-700",
    emblemBg: "bg-white/15",
    buttonText: "text-rose-600",
    icon: Terminal,
    accentText: "text-rose-600",
    badge: "bg-rose-100 text-rose-700",
    colorClass: "red",
  },
}

function getCourseBySlug(slug: string): Course {
  const normSlug = slug.toLowerCase().trim()
  const found = allCourses.find((c) => {
    const titleSlug = c.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    return (
      titleSlug === normSlug ||
      c.category === normSlug ||
      (normSlug === "oop" && c.category === "violet")
    )
  })
  return found || allCourses[0]
}

export default function CourseDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const course = useMemo(() => getCourseBySlug(id), [id])
  const details = useMemo(() => {
    return COURSE_DETAILS_MAP[course.category] || COURSE_DETAILS_MAP.violet
  }, [course.category])

  const fullDetails = useMemo(() => {
    return (
      COURSE_FULL_DETAILS_MAP[course.category] || COURSE_FULL_DETAILS_MAP.violet
    )
  }, [course.category])

  const meta = categoryMeta[course.category] || categoryMeta.violet
  const CourseIcon = meta.icon

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "stream" | "content" | "work" | "files" | "grades"
  >("stream")

  // Week syllabus collapsibles
  const [openWeeks, setOpenWeeks] = useState<Record<string, boolean>>({
    T1: true,
    T2: true,
    T3: true,
    T4: false,
  })

  const toggleWeek = (weekId: string) => {
    setOpenWeeks((current) => ({ ...current, [weekId]: !current[weekId] }))
  }

  // Connecting Mock Loader State
  const [isConnecting, setIsConnecting] = useState(false)

  const handleJoinLive = useCallback(() => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
    }, 1800)
  }, [])

  // Post Likes State (Initialized from central mock details file)
  const [posts, setPosts] = useState(fullDetails.posts)
  const [prevPosts, setPrevPosts] = useState(fullDetails.posts)

  if (fullDetails.posts !== prevPosts) {
    setPrevPosts(fullDetails.posts)
    setPosts(fullDetails.posts)
  }

  const handleLike = (postId: string) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
        }
        return post
      })
    )
  }

  // Derived Syllabus numbers
  const { totalLessons, doneLessons } = useMemo(() => {
    let total = 0
    let done = 0
    fullDetails.syllabus.forEach((w) => {
      total += w.lessons.length
      w.lessons.forEach((l) => {
        if (l.done) done++
      })
    })
    return { totalLessons: total, doneLessons: done }
  }, [fullDetails.syllabus])

  // Derived Grade details
  const gradeDetails = useMemo(() => {
    const score = parseFloat(course.grade)
    if (isNaN(score)) return { letter: "—", label: "Chưa xếp loại" }
    if (score >= 9.0) return { letter: "A", label: "Xếp loại Xuất sắc" }
    if (score >= 8.5) return { letter: "B+", label: "Xếp loại Khá Giỏi" }
    if (score >= 8.0) return { letter: "B", label: "Xếp loại Khá" }
    if (score >= 7.0) return { letter: "C+", label: "Xếp loại Trung bình Khá" }
    if (score >= 6.5) return { letter: "C", label: "Xếp loại Trung bình" }
    if (score >= 5.5) return { letter: "D+", label: "Xếp loại Yếu" }
    return { letter: "F", label: "Kém" }
  }, [course.grade])

  return (
    <div className="col-span-full flex h-full min-w-0 flex-1 flex-col gap-5.5">
      {/* Page header */}
      <PageHeader
        title={course.title}
        subtitle="Không gian học tập và tương tác lớp học trực tuyến"
        breadcrumbs={[
          { label: "Khóa học của tôi", href: "/courses" },
          { label: course.title },
        ]}
      />

      {/* Hero card banner */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${meta.gradient} p-6 text-white shadow-sm sm:p-7.5`}
      >
        {/* Decorative circle details */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/8 select-none" />
        <div className="pointer-events-none absolute right-16 -bottom-24 h-44 w-44 rounded-full bg-white/6 select-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Emblem Icon */}
          <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl bg-white/16 backdrop-blur-md">
            <CourseIcon className="h-7.5 w-7.5 text-white" />
          </div>

          {/* Details body */}
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/18 px-3 py-1 text-[11px] font-extrabold tracking-wide uppercase">
              <Hash className="h-3.5 w-3.5" />
              {details.code} · {details.group}
            </span>
            <h1 className="mt-3.5 text-2xl font-black tracking-tight sm:text-3xl">
              {course.title}
            </h1>
            <div className="mt-2.5 flex items-center gap-2 text-sm font-medium text-white/90">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/22 text-[11px] font-extrabold">
                {details.instructorInfo.initials}
              </span>
              {details.instructorInfo.name}
            </div>

            {/* Meta Tags Row */}
            <div className="mt-4.5 flex flex-wrap gap-2 text-[12.5px] font-semibold text-white/85">
              <div className="flex items-center gap-1.5 rounded-lg bg-white/14 px-3 py-1.5">
                <Calendar className="h-4 w-4 opacity-90" />
                {course.schedule} · {details.timeRange}
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/14 px-3 py-1.5">
                <MapPin className="h-4 w-4 opacity-90" />
                {details.room}
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/14 px-3 py-1.5">
                <Layers className="h-4 w-4 opacity-90" />
                {course.credits} tín chỉ
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/14 px-3 py-1.5">
                <Users className="h-4 w-4 opacity-90" />
                {details.totalStudents} sinh viên
              </div>
            </div>
          </div>

          {/* Progress & Live Actions */}
          <div className="flex flex-col gap-3.5 sm:min-w-[200px] lg:items-end">
            <div className="w-full text-left sm:w-50 lg:text-right">
              <div className="flex justify-between text-xs font-semibold text-white/95 sm:text-[12.5px]">
                <span>Tiến độ môn học</span>
                <span>{course.progress}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/22">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleJoinLive}
                disabled={isConnecting}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-none bg-white px-4.5 py-3 text-xs font-extrabold text-indigo-700 shadow-sm transition-all select-none hover:scale-[1.02] hover:shadow-md disabled:opacity-85"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang kết nối...
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    Vào lớp trực tuyến
                  </>
                )}
              </button>
              <button className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/28 bg-white/16 px-4 py-3 text-xs font-extrabold text-white transition-colors hover:bg-white/26">
                <Mail className="h-4 w-4" />
                Liên hệ GV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-1 overflow-x-auto border-b border-border select-none">
        <button
          onClick={() => setActiveTab("stream")}
          className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all sm:text-[13.5px] ${
            activeTab === "stream"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Newspaper className="h-4 w-4" />
          Bảng tin
        </button>
        <button
          onClick={() => setActiveTab("content")}
          className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all sm:text-[13.5px] ${
            activeTab === "content"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListChecks className="h-4 w-4" />
          Nội dung
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
              activeTab === "content"
                ? "bg-primary/12 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {totalLessons}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("work")}
          className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all sm:text-[13.5px] ${
            activeTab === "work"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          Bài tập
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
              activeTab === "work"
                ? "bg-primary/12 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {course.assignments}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("files")}
          className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all sm:text-[13.5px] ${
            activeTab === "files"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Folder className="h-4 w-4" />
          Tài liệu
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
              activeTab === "files"
                ? "bg-primary/12 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {fullDetails.materials.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("grades")}
          className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all sm:text-[13.5px] ${
            activeTab === "grades"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Điểm số
        </button>
      </div>

      {/* Grid: Main Left and Right Rail */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_340px]">
        {/* Left main area */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* TAB 1: STREAM */}
          {activeTab === "stream" && (
            <>
              {/* Post Composer card */}
              <div className="rounded-2xl border border-border bg-card p-5.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-sm font-bold text-white select-none">
                    NT
                  </div>
                  <input
                    type="text"
                    placeholder="Chia sẻ điều gì đó với lớp..."
                    className="flex-1 rounded-full border border-input bg-background px-4.5 py-3 text-xs transition-all outline-none focus:border-ring focus:bg-card focus:shadow-[0_0_0_3px_hsl(var(--ring)_/_0.12)] sm:text-sm"
                  />
                </div>
              </div>

              {/* Feed lists */}
              <div className="flex flex-col gap-5">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-2xl border border-border bg-card p-5.5 shadow-xs"
                  >
                    <div className="flex gap-3.5">
                      {/* Avatar */}
                      <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-sm font-bold text-white select-none">
                        {post.avatar}
                      </div>

                      {/* Content block */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs select-none">
                          <span className="text-[13.5px] font-extrabold text-foreground">
                            {post.author}
                          </span>
                          {post.role === "Giảng viên" && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">
                              Giảng viên
                            </span>
                          )}
                          <span className="font-medium text-muted-foreground">
                            · {post.time}
                          </span>
                        </div>

                        <div
                          className="mt-2.5 text-sm leading-relaxed font-normal text-slate-700"
                          dangerouslySetInnerHTML={{ __html: post.text }}
                        />

                        {/* Attachment block */}
                        {post.attach && (
                          <div className="mt-3.5 flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-3 transition-all select-none hover:border-primary/50 hover:bg-primary/3">
                            <div
                              className={`flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-lg ${
                                post.attach.type === "pdf"
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-amber-500/10 text-amber-500"
                              }`}
                            >
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[13px] font-bold text-foreground">
                                {post.attach.name}
                              </div>
                              <div className="mt-0.5 text-xs font-semibold text-muted-foreground">
                                {post.attach.sub}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Feed foot interactions */}
                        <div className="mt-4 flex gap-4 border-t border-border/60 pt-3 select-none">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex cursor-pointer items-center gap-1.5 text-xs font-bold transition-colors hover:text-red-500 sm:text-[12.5px] ${
                              post.liked
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            <Heart
                              className={`h-4.5 w-4.5 ${post.liked ? "fill-red-500 text-red-500" : ""}`}
                            />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-primary sm:text-[12.5px]">
                            <MessageCircle className="h-4.5 w-4.5" />
                            <span>{post.comments} bình luận</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TAB 2: SYLLABUS / CONTENT */}
          {activeTab === "content" && (
            <div className="rounded-2xl border border-border bg-card p-5.5 shadow-xs">
              <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                <h2 className="text-base font-extrabold tracking-tight text-foreground sm:text-[16.5px]">
                  Nội dung môn học
                </h2>
                <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-700 select-none">
                  {doneLessons}/{totalLessons} hoàn thành
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {fullDetails.syllabus.map((w) => (
                  <div
                    key={w.id}
                    className={`overflow-hidden rounded-xl border border-border bg-card ${
                      openWeeks[w.id] ? "shadow-xs" : ""
                    }`}
                  >
                    {/* Accordion header */}
                    <div
                      onClick={() => toggleWeek(w.id)}
                      className="flex cursor-pointer items-center gap-3.5 p-4 select-none hover:bg-muted"
                    >
                      <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">
                        {w.id}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-foreground">
                          {w.title}
                        </div>
                        <div className="mt-0.5 text-xs font-semibold text-muted-foreground">
                          {w.subtitle}
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4.5 w-4.5 text-muted-foreground transition-transform duration-200 ${
                          openWeeks[w.id] ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {/* Accordion body lessons */}
                    {openWeeks[w.id] && (
                      <div className="divide-y divide-border/60 border-t border-border bg-card/40 px-4 pb-2">
                        {w.lessons.map((l) => (
                          <div
                            key={l.id}
                            className="flex items-center gap-3 py-3"
                          >
                            <div className="shrink-0 select-none">
                              {l.done ? (
                                <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-green-500 text-white">
                                  <Check className="h-3.5 w-3.5" />
                                </div>
                              ) : (
                                <div className="flex h-5.5 w-5.5 rounded-full border-2 border-border bg-card" />
                              )}
                            </div>
                            <div
                              className={`flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg ${
                                l.type === "lock"
                                  ? "bg-muted/60 text-muted-foreground/50"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {l.type === "play" && (
                                <Play className="h-4 w-4" />
                              )}
                              {l.type === "file" && (
                                <FileText className="h-4 w-4" />
                              )}
                              {l.type === "code" && (
                                <Code className="h-4 w-4" />
                              )}
                              {l.type === "lock" && (
                                <Lock className="h-3.5 w-3.5" />
                              )}
                            </div>
                            <div
                              className={`flex-1 text-[13px] font-bold ${
                                l.type === "lock"
                                  ? "text-muted-foreground/70"
                                  : "text-slate-700"
                              }`}
                            >
                              {l.name}
                            </div>
                            <div
                              className={`text-xs font-semibold ${
                                l.type === "lock"
                                  ? "text-muted-foreground/60"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {l.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WORK / ASSIGNMENTS */}
          {activeTab === "work" && (
            <div className="rounded-2xl border border-border bg-card p-5.5 shadow-xs">
              <div className="border-b border-border pb-4">
                <h2 className="text-base font-extrabold tracking-tight text-foreground sm:text-[16.5px]">
                  Bài tập &amp; bài kiểm tra
                </h2>
              </div>

              <div className="mt-4.5 flex flex-col gap-3">
                {fullDetails.assignments.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-col gap-4.5 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs sm:flex-row sm:items-center sm:gap-4.5"
                  >
                    <div
                      className={`flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-xl ${
                        a.status === "graded"
                          ? "bg-green-500/10 text-green-500"
                          : a.status === "submitted"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {a.status === "graded" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : a.type === "quiz" ? (
                        <HelpCircle className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm leading-tight font-bold text-foreground">
                        {a.title}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          {a.type === "group" ? (
                            <Users className="h-3.5 w-3.5" />
                          ) : a.type === "quiz" ? (
                            <HelpCircle className="h-3.5 w-3.5" />
                          ) : (
                            <User className="h-3.5 w-3.5" />
                          )}
                          {a.typeLabel}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {a.dueLabel}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 select-none">
                      {a.score !== undefined && (
                        <span className="text-lg font-black tracking-tight text-green-600">
                          {a.score.toFixed(1)}
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          a.statusColor === "red"
                            ? "bg-red-100 text-red-700"
                            : a.statusColor === "amber"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {a.statusLabel}
                      </span>
                      {a.status === "not_submitted" && (
                        <button className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:brightness-115 active:scale-95">
                          <Upload className="h-3.5 w-3.5" />
                          Nộp bài
                        </button>
                      )}
                      {a.submittedTime && (
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {a.submittedTime}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MATERIALS / FILES */}
          {activeTab === "files" && (
            <div className="rounded-2xl border border-border bg-card p-5.5 shadow-xs">
              <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                <h2 className="text-base font-extrabold tracking-tight text-foreground sm:text-[16.5px]">
                  Tài liệu môn học
                </h2>
                <button className="cursor-pointer text-xs font-bold text-primary hover:underline">
                  Tải tất cả
                </button>
              </div>

              <div className="mt-4.5 flex flex-col gap-3">
                {fullDetails.materials.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-3.5 transition-colors hover:border-primary/50 hover:bg-primary/2"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        f.type === "pdf"
                          ? "bg-red-500/10 text-red-500"
                          : f.type === "ppt"
                            ? "bg-amber-500/10 text-amber-500"
                            : f.type === "zip"
                              ? "bg-indigo-500/10 text-indigo-500"
                              : f.type === "video"
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {f.type === "pdf" && <FileText className="h-5 w-5" />}
                      {f.type === "ppt" && <Presentation className="h-5 w-5" />}
                      {f.type === "zip" && <FileCode2 className="h-5 w-5" />}
                      {f.type === "video" && <Video className="h-5 w-5" />}
                      {f.type === "xls" && (
                        <FileSpreadsheet className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] leading-tight font-bold text-foreground">
                        {f.name}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-muted-foreground">
                        {f.meta}
                      </div>
                    </div>
                    <button className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-primary/8 hover:text-primary active:scale-95">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GRADES / SCORE CARD */}
          {activeTab === "grades" && (
            <div className="rounded-2xl border border-border bg-card p-5.5 shadow-xs">
              <div className="border-b border-border pb-4">
                <h2 className="text-base font-extrabold tracking-tight text-foreground sm:text-[16.5px]">
                  Bảng điểm thành phần
                </h2>
              </div>

              {/* Grades Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-left text-[13.5px]">
                  <thead>
                    <tr className="border-b border-border text-[11.5px] font-bold tracking-wider text-muted-foreground uppercase select-none">
                      <th className="px-3 pb-3">Thành phần</th>
                      <th className="px-3 pb-3 text-right">Trọng số</th>
                      <th className="px-3 pb-3 text-right">Điểm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {fullDetails.grades.map((g, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-3.5 font-bold text-foreground">
                          {g.name}
                        </td>
                        <td className="px-3 py-3.5 text-right font-medium text-muted-foreground">
                          {g.weight}
                        </td>
                        <td
                          className={`px-3 py-3.5 text-right text-[15px] font-extrabold ${
                            g.isMuted
                              ? "text-muted-foreground/60 select-none"
                              : "text-green-600"
                          }`}
                        >
                          {g.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grades Summary card */}
              <div className="mt-5.5 flex items-center justify-between rounded-2xl border border-primary/14 bg-gradient-to-br from-primary/3 to-purple-500/3 p-5">
                <div>
                  <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase select-none sm:text-[13px]">
                    Điểm tạm tính (phần đã có)
                  </div>
                  <div className="mt-1.5 text-3xl font-black tracking-tight text-primary">
                    {course.grade}
                  </div>
                </div>
                <div className="text-right select-none">
                  <div className="text-2xl leading-none font-black tracking-tight text-green-600">
                    {gradeDetails.letter}
                  </div>
                  <div className="mt-1.5 text-xs font-semibold text-muted-foreground">
                    {gradeDetails.label}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side widgets rail */}
        <div className="flex flex-col gap-5">
          {/* Live class widget */}
          <div className="rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-purple-50 to-indigo-50/50 p-5 shadow-xs">
            <div className="mb-3.5 flex items-center gap-2 select-none">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.75 text-[10px] font-extrabold text-red-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
                ĐANG DIỄN RA
              </span>
            </div>
            <div className="text-[15px] font-black tracking-tight text-foreground">
              {details.activeLecture.title}
            </div>
            <div className="mt-1 text-xs leading-relaxed font-medium text-muted-foreground">
              {details.room} · {details.instructorInfo.name}
            </div>
            <div className="my-3.5 flex items-baseline gap-1.5 select-none">
              <span className="text-2xl font-black tracking-tight text-primary">
                {details.activeLecture.studentsCount}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                / {details.totalStudents} sinh viên đang tham gia
              </span>
            </div>
            <button
              onClick={handleJoinLive}
              disabled={isConnecting}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-extrabold text-white transition-all select-none hover:brightness-110 active:scale-98"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang kết nối...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  Tham gia ngay
                </>
              )}
            </button>
          </div>

          {/* Due Soon widget */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <h2 className="border-b border-border pb-3 text-sm font-extrabold text-foreground select-none">
              Sắp đến hạn
            </h2>
            <div className="mt-1.5 divide-y divide-border/60">
              {fullDetails.dueSoon.map((d) => (
                <div
                  key={d.id}
                  className="flex gap-3 py-3 first:pt-2 last:pb-0"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      d.type === "red"
                        ? "bg-red-500/10 text-red-500"
                        : d.type === "amber"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {d.type === "red" && <Bookmark className="h-4.5 w-4.5" />}
                    {d.type === "amber" && <BookOpen className="h-4.5 w-4.5" />}
                    {d.type === "blue" && <Calendar className="h-4.5 w-4.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-bold text-foreground">
                      {d.title}
                    </div>
                    <div className="mt-0.5 text-xs font-semibold text-muted-foreground">
                      {d.dueMeta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Contact Card widget */}
          <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-xl font-black text-white select-none">
              {details.instructorInfo.initials}
            </div>
            <div className="mt-3.5 text-[15px] font-extrabold text-foreground">
              {details.instructorInfo.name}
            </div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground">
              {details.instructorInfo.department}
            </div>

            <div className="mt-4 flex flex-col gap-2.5 text-left text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate transition-colors select-all hover:text-primary">
                  {details.instructorInfo.email}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{details.instructorInfo.officeHours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{details.instructorInfo.office}</span>
              </div>
            </div>

            <button className="mt-5.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary bg-transparent py-3 text-xs font-extrabold text-primary transition-colors select-none hover:bg-primary/8 active:scale-98">
              <Mail className="h-4 w-4" />
              Gửi tin nhắn
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
