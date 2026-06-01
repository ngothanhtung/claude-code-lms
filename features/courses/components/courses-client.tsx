"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { ComponentType } from "react"
import {
  BookOpenIcon,
  CalendarIcon,
  ChevronDownIcon,
  CodeXmlIcon,
  CoffeeIcon,
  DatabaseIcon,
  FileTextIcon,
  LayersIcon,
  NetworkIcon,
  SearchIcon,
  StarIcon,
  TerminalIcon,
  XIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { allCourses, type Course, type CourseCategory } from "@/features/courses/mock"
import styles from "./courses-client.module.css"

const categoryGradients: Record<CourseCategory, string> = {
  violet: styles.violet,
  green: styles.green,
  blue: styles.blue,
  amber: styles.amber,
  teal: styles.teal,
  rust: styles.rust,
}

const courseIcons: Record<
  CourseCategory,
  ComponentType<{ className?: string }>
> = {
  violet: CodeXmlIcon,
  green: DatabaseIcon,
  blue: NetworkIcon,
  amber: CoffeeIcon,
  teal: BookOpenIcon,
  rust: TerminalIcon,
}

function CourseCard({ course }: { course: Course }) {
  const Icon = courseIcons[course.category]

  return (
    <div className={styles.courseCard}>
      <div className={cn(styles.courseTop, categoryGradients[course.category])}>
        <div className={styles.courseEmblem}>
          <Icon />
        </div>
        <div className={styles.courseName}>{course.title}</div>
        <div className={styles.courseInstructor}>GV: {course.instructor}</div>
        <div className={styles.courseProgress}>
          <div className={styles.courseProgressRow}>
            <span>Tiến độ</span>
            <span>{course.progress}%</span>
          </div>
          <div className={styles.courseTrack}>
            <span style={{ width: `${course.progress}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.courseMeta}>
        <div className={styles.metaItem}>
          <CalendarIcon />
          <span>{course.schedule}</span>
        </div>
        <div className={styles.metaItem}>
          <LayersIcon />
          <span>{course.credits} tín chỉ</span>
        </div>
      </div>

      <div className={styles.courseFoot}>
        <div className={styles.courseStat}>
          <div className={styles.statIcon} data-variant="amber">
            <FileTextIcon />
          </div>
          <div>
            <div className={styles.statNum}>{course.assignments}</div>
            <div className={styles.statLbl}>Bài tập</div>
          </div>
        </div>
        <div className={styles.courseStat}>
          <div className={styles.statIcon} data-variant="green">
            <StarIcon />
          </div>
          <div>
            <div className={styles.statNum}>{course.grade}</div>
            <div className={styles.statLbl}>Điểm</div>
          </div>
        </div>
        <div className={styles.courseSpacer} />
        <Button size="sm" variant="outline" className="text-[13px] font-semibold">
          Vào lớp
        </Button>
      </div>
    </div>
  )
}

type FilterTab = "all" | "learning" | "done"

const tabs: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "learning", label: "Đang học" },
  { value: "done", label: "Hoàn thành" },
]

export function CoursesClient() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [search, setSearch] = useState("")

  const counts = useMemo(() => {
    const learning = allCourses.filter((c) => c.status === "learning").length
    const done = allCourses.filter((c) => c.status === "done").length
    return { all: allCourses.length, learning, done }
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return allCourses.filter((c) => {
      const matchTab =
        activeTab === "all" || c.status === activeTab
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
      return matchTab && matchSearch
    })
  }, [activeTab, search])

  return (
    <div className={styles.wrapper}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={cn(
                styles.tab,
                activeTab === tab.value && styles.tabActive
              )}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
              <span
                className={cn(
                  styles.tabCount,
                  activeTab === tab.value && styles.tabCountActive
                )}
              >
                {counts[tab.value]}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.search}>
          <SearchIcon className={styles.searchIcon} />
          <Input
            className={styles.searchInput}
            placeholder="Lọc theo tên môn hoặc giảng viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className={styles.searchClear}
              onClick={() => setSearch("")}
              aria-label="Xóa tìm kiếm"
            >
              <XIcon />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((course) => (
            <CourseCard course={course} key={course.title} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <SearchIcon className={styles.emptyIcon} />
          <p>Không tìm thấy môn học phù hợp.</p>
        </div>
      )}
    </div>
  )
}
