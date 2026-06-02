import {
  BookOpenCheckIcon,
  LayersIcon,
  StarIcon,
  ClipboardListIcon,
} from "lucide-react"
import { CoursesClient } from "@/features/courses/components/courses-client"
import {
  allCourses,
  totalCredits,
  totalAssignments,
  averageGrade,
} from "@/features/courses/mock"
import { PageHeader } from "@/components/page-header"
import styles from "./courses.module.css"

export default function CoursesPage() {
  const learningCount = allCourses.filter((c) => c.status === "learning").length

  return (
    <div className="col-main col-span-full">
      {/* Page header */}
      <PageHeader
        title="Khóa học của tôi"
        subtitle={`Học kỳ II, năm học 2025 - 2026 · ${learningCount} môn đang theo học`}
        className={styles.pageHead}
      >
        {/* Stat chips */}
        <div className={styles.headStats}>
          <div className={styles.statChip}>
            <div className={styles.statChipIcon} data-variant="indigo">
              <BookOpenCheckIcon />
            </div>
            <div>
              <div className={styles.statChipNum}>{allCourses.length}</div>
              <div className={styles.statChipLbl}>Môn học</div>
            </div>
          </div>

          <div className={styles.statChip}>
            <div className={styles.statChipIcon} data-variant="blue">
              <LayersIcon />
            </div>
            <div>
              <div className={styles.statChipNum}>{totalCredits}</div>
              <div className={styles.statChipLbl}>Tín chỉ</div>
            </div>
          </div>

          <div className={styles.statChip}>
            <div className={styles.statChipIcon} data-variant="red">
              <ClipboardListIcon />
            </div>
            <div>
              <div className={styles.statChipNum}>{totalAssignments}</div>
              <div className={styles.statChipLbl}>Bài tập</div>
            </div>
          </div>

          <div className={styles.statChip}>
            <div className={styles.statChipIcon} data-variant="green">
              <StarIcon />
            </div>
            <div>
              <div className={styles.statChipNum}>{averageGrade}</div>
              <div className={styles.statChipLbl}>Điểm TB</div>
            </div>
          </div>
        </div>
      </PageHeader>

      {/* Interactive course list */}
      <CoursesClient />
    </div>
  )
}
