import Link from "next/link"
import type { ComponentType } from "react"
import {
  BookOpenIcon,
  CodeXmlIcon,
  CoffeeIcon,
  DatabaseIcon,
  FileTextIcon,
  NetworkIcon,
  StarIcon,
  TerminalIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  dashboardCourses,
  type CourseCategory,
  type DashboardCourse,
} from "@/features/courses/mock"
import styles from "./courses.module.css"

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

function CourseCard({ course }: { course: DashboardCourse }) {
  const Icon = courseIcons[course.category]

  return (
    <div className={styles.course}>
      <div className={cn(styles.courseTop, styles[course.category])}>
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
      <div className={styles.courseFoot}>
        <div className={styles.courseStat}>
          <div className={styles.statKey}>
            <FileTextIcon className="icon-sm" />
            Bài tập
          </div>
          <div className={styles.statValue}>{course.assignments}</div>
        </div>
        <div className={styles.courseStat}>
          <div className={styles.statKey}>
            <StarIcon className="icon-sm" />
            Điểm
          </div>
          <div className={styles.statValue}>{course.grade}</div>
        </div>
      </div>
    </div>
  )
}

export function Courses() {
  return (
    <Card className={cn(styles.card, styles.cardPad, "gap-0 py-5 ring-0")}>
      <div className={styles.sectionHead}>
        <h2>Các môn học đang học</h2>
        <Link href="/courses" className={styles.link}>
          Xem tất cả
        </Link>
      </div>
      <div className={styles.courses}>
        {dashboardCourses.map((course) => (
          <CourseCard course={course} key={course.title} />
        ))}
      </div>
    </Card>
  )
}
