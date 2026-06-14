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
    <div className="el-grp-page">
      {/* ─── Header ─── */}
      <div className="el-grp-header">
        <div>
          {selectedClass && (
            <div className="el-grp-breadcrumb">
              <Link
                href="/elementary-teacher/classes"
              >
                Lớp học
              </Link>
              <ChevronRightIcon className="el-grp-breadcrumb-sep" />
              <span className="el-grp-breadcrumb-current">
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
        <div className="el-grp-stats">
          <div className="el-grp-stat">
            <div className="el-grp-stat-icon" data-variant="indigo">
              <UsersIcon />
            </div>
            <div>
              <div className="el-grp-stat-num">{pageSummary.totalGroups}</div>
              <div className="el-grp-stat-lbl">Nhóm</div>
            </div>
          </div>

          <div className="el-grp-stat">
            <div className="el-grp-stat-icon" data-variant="teal">
              <UserPlusIcon />
            </div>
            <div>
              <div className="el-grp-stat-num">{pageSummary.totalStudents}</div>
              <div className="el-grp-stat-lbl">Học sinh</div>
            </div>
          </div>

          <div className="el-grp-stat">
            <div className="el-grp-stat-icon" data-variant="amber">
              <LinkIcon />
            </div>
            <div>
              <div className="el-grp-stat-num">{pageSummary.activeGroups}</div>
              <div className="el-grp-stat-lbl">Đang hoạt động</div>
            </div>
          </div>

          <div className="el-grp-stat">
            <div className="el-grp-stat-icon" data-variant="sky">
              <StarIcon />
            </div>
            <div>
              <div className="el-grp-stat-num">{pageSummary.avgScore}</div>
              <div className="el-grp-stat-lbl">Điểm TB</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Filters row ─── */}
      <div className="el-grp-filters">
        {/* Status toggle */}
        <div className="el-grp-status-tabs">
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
                  "el-grp-status-tab",
                  activeStatus === tab.value && "active"
                )}
                onClick={() => setActiveStatus(tab.value)}
              >
                {tab.label}
                <span className="el-grp-status-tab-count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Groups grid ─── */}
      {filtered.length > 0 ? (
        <div className="el-grp-grid">
          {filtered.map((group) => {
            const pct =
              group.status === "active" && group.totalQuizzes > 0
                ? Math.round(
                    (group.completedQuizzes / group.totalQuizzes) * 100
                  )
                : null

            return (
              <div key={group.id} className="el-grp-card">
                {/* Top: grade + status */}
                <div className="el-grp-card-top">
                  <span className="el-scls-grade" data-grade={group.grade}>
                    {gradeEmoji[group.grade]} {group.className}
                  </span>
                  <span
                    className={cn(
                      "el-grp-status-badge",
                      group.status === "active" ? "active" : "waiting"
                    )}
                  >
                    {group.status === "active" ? "Đang hoạt động" : "Đang chờ"}
                  </span>
                </div>

                {/* Members */}
                <div className="el-grp-card-body">
                  <div className="el-grp-class-name">Nhóm {group.id.split("-").pop()}</div>

                  <div className="el-grp-members">
                    {group.members.map((m, i) => (
                      <div key={m.studentId} className="el-grp-member">
                        <div className="el-grp-member-avatar" data-idx={i}>
                          {initials(m.name)}
                        </div>
                        <div>
                          <div className="el-grp-member-name">{m.name}</div>
                          <div className="el-grp-member-id">{m.studentId}</div>
                        </div>
                      </div>
                    ))}

                    {group.status === "waiting" && group.members.length === 1 && (
                      <div className="el-grp-member-empty">
                        <div className="el-grp-member-empty-avatar">
                          <PlusIcon />
                        </div>
                        <span className="el-grp-member-empty-label">Chờ ghép đôi</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quiz info */}
                {group.status === "active" ? (
                  <div className="el-grp-quiz-section">
                    <div className="el-grp-quiz-left">
                      <BookCheckIcon />
                      <span>
                        {group.completedQuizzes}/{group.totalQuizzes} đã làm
                      </span>
                    </div>
                    <div className="el-grp-quiz-right">
                      {pct !== null && (
                        <div className="el-grp-quiz-progress">
                          <div className="el-grp-quiz-track">
                            <span
                              className="el-grp-quiz-track-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="el-grp-quiz-pct">{pct}%</span>
                        </div>
                      )}
                      {group.averageScore !== "—" ? (
                        <div className="el-grp-score">
                          <StarIcon />
                          {group.averageScore}
                        </div>
                      ) : (
                        <span className="el-grp-score-empty">—</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="el-grp-quiz-section">
                    <div className="el-grp-quiz-left">
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
        <div className="el-grp-empty">
          <UsersIcon />
          <p>Không tìm thấy nhóm phù hợp.</p>
        </div>
      )}
    </div>
  )
}
