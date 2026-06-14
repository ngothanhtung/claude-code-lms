"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  BookCheckIcon,
  ChevronRightIcon,
  LinkIcon,
  PlusIcon,
  StarIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { allClasses } from "@/features/elementary/classes/mock"
import { allGroups, getSummary } from "@/features/elementary/groups/mock"
import type { GradeLevel, GroupStatus } from "@/features/elementary/groups/mock"
import styles from "./groups-page.module.css"

/* ─── Grade emoji helper ─── */
const gradeEmoji: Record<GradeLevel, string> = {
  1: "🐣",
  2: "🐥",
  3: "🦊",
  4: "🐯",
  5: "🦅",
}

/* ─── Get initials from name ─── */
function initials(name: string) {
  const parts = name.split(" ").filter(Boolean)
  return parts.slice(-2).map((p) => p[0]).join("")
}

/* ─── Status tabs config ─── */
type StatusFilter = "all" | GroupStatus

const statusTabs: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang hoạt động" },
  { value: "waiting", label: "Đang chờ" },
]

export function GroupsPage({ classId }: { classId?: string }) {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all")

  const selectedClass = classId
    ? allClasses.find((c) => c.id === classId)
    : undefined

  const filtered = useMemo(
    () =>
      allGroups.filter((g) => {
        const matchClass = !classId || g.classId === classId
        const matchStatus = activeStatus === "all" || g.status === activeStatus
        return matchClass && matchStatus
      }),
    [classId, activeStatus]
  )

  const pageSummary = useMemo(() => getSummary(filtered), [filtered])

  return (
    <div className={styles.pageWrap}>
      {/* ─── Header ─── */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          {selectedClass && (
            <div className={styles.breadcrumb}>
              <Link
                href="/elementary-teacher/classes"
                className={styles.breadcrumbLink}
              >
                Lớp học
              </Link>
              <ChevronRightIcon className={styles.breadcrumbSep} />
              <span className={styles.breadcrumbCurrent}>
                Lớp {selectedClass.grade}/{selectedClass.classNumber}
              </span>
            </div>
          )}
          <h1>{selectedClass ? `Nhóm — Lớp ${selectedClass.grade}/${selectedClass.classNumber}` : "Nhóm học"}</h1>
          <p>
            {selectedClass
              ? `GVCN: ${selectedClass.homeroomTeacher} · ${selectedClass.studentCount} học sinh`
              : "Theo dõi các nhóm ghép đôi học sinh · Năm học 2025–2026"}
          </p>
        </div>

        {/* Stats chips */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statIcon} data-variant="indigo">
              <UsersIcon />
            </div>
            <div>
              <div className={styles.statNum}>{pageSummary.totalGroups}</div>
              <div className={styles.statLbl}>Nhóm</div>
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statIcon} data-variant="teal">
              <UserPlusIcon />
            </div>
            <div>
              <div className={styles.statNum}>{pageSummary.totalStudents}</div>
              <div className={styles.statLbl}>Học sinh</div>
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statIcon} data-variant="amber">
              <LinkIcon />
            </div>
            <div>
              <div className={styles.statNum}>{pageSummary.activeGroups}</div>
              <div className={styles.statLbl}>Đang hoạt động</div>
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statIcon} data-variant="sky">
              <StarIcon />
            </div>
            <div>
              <div className={styles.statNum}>{pageSummary.avgScore}</div>
              <div className={styles.statLbl}>Điểm TB</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Filters row ─── */}
      <div className={styles.filters}>
        {/* Status toggle */}
        <div className={styles.statusTabs}>
          {statusTabs.map((tab) => {
            const scopeGroups = classId
              ? allGroups.filter((g) => g.classId === classId)
              : allGroups
            const count =
              tab.value === "all"
                ? scopeGroups.length
                : scopeGroups.filter((g) => g.status === tab.value).length
            return (
              <button
                key={tab.value}
                type="button"
                className={cn(
                  styles.statusTab,
                  activeStatus === tab.value && styles.statusTabActive
                )}
                onClick={() => setActiveStatus(tab.value)}
              >
                {tab.label}
                <span className={styles.statusTabCount}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Groups grid ─── */}
      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((group) => {
            const pct =
              group.status === "active" && group.totalQuizzes > 0
                ? Math.round(
                    (group.completedQuizzes / group.totalQuizzes) * 100
                  )
                : null

            return (
              <div key={group.id} className={styles.card}>
                {/* Top: grade + status */}
                <div className={styles.cardTop}>
                  <span className={styles.gradeBadge} data-grade={group.grade}>
                    {gradeEmoji[group.grade]} {group.className}
                  </span>
                  <span
                    className={cn(
                      styles.statusBadge,
                      group.status === "active"
                        ? styles.statusBadgeActive
                        : styles.statusBadgeWaiting
                    )}
                  >
                    {group.status === "active" ? "Đang hoạt động" : "Đang chờ"}
                  </span>
                </div>

                {/* Members */}
                <div className={styles.cardBody}>
                  <div className={styles.className}>Nhóm {group.id.split("-").pop()}</div>

                  <div className={styles.members}>
                    {group.members.map((m, i) => (
                      <div key={m.studentId} className={styles.member}>
                        <div className={styles.memberAvatar} data-idx={i}>
                          {initials(m.name)}
                        </div>
                        <div>
                          <div className={styles.memberName}>{m.name}</div>
                          <div className={styles.memberId}>{m.studentId}</div>
                        </div>
                      </div>
                    ))}

                    {group.status === "waiting" && group.members.length === 1 && (
                      <div className={styles.memberEmptySlot}>
                        <div className={styles.memberEmptyAvatar}>
                          <PlusIcon />
                        </div>
                        <span className={styles.memberEmptyLabel}>Chờ ghép đôi</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quiz info */}
                {group.status === "active" ? (
                  <div className={styles.quizSection}>
                    <div className={styles.quizLeft}>
                      <BookCheckIcon />
                      <span>
                        {group.completedQuizzes}/{group.totalQuizzes} đã làm
                      </span>
                    </div>
                    <div className={styles.quizRight}>
                      {pct !== null && (
                        <div className={styles.quizProgress}>
                          <div className={styles.quizTrack}>
                            <span
                              className={styles.quizTrackFill}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className={styles.quizPct}>{pct}%</span>
                        </div>
                      )}
                      {group.averageScore !== "—" ? (
                        <div className={styles.score}>
                          <StarIcon />
                          {group.averageScore}
                        </div>
                      ) : (
                        <span className={styles.scoreEmpty}>—</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.quizSection}>
                    <div className={styles.quizLeft}>
                      <PlusIcon />
                      <span style={{ fontStyle: "italic" }}>Chưa có bài quiz</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <UsersIcon />
          <p>Không tìm thấy nhóm phù hợp.</p>
        </div>
      )}
    </div>
  )
}
