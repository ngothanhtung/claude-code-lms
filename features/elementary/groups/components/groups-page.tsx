"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  BookCheckIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CircleIcon,
  ClockIcon,
  LinkIcon,
  PlayIcon,
  PlusIcon,
  StarIcon,
  TrophyIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useClasses, type GradeLevel } from "@/features/elementary/quiz/hooks/use-classes"
import { useGroupsByClass, type Group } from "@/features/elementary/quiz/hooks/use-groups"
import { useLessons, type Lesson, type LessonStatus } from "@/features/elementary/lessons/hooks/use-lessons"
import { useClassLessons } from "@/features/elementary/lessons/hooks/use-class-lessons"
import { useGroupLessons } from "@/features/elementary/groups/hooks/use-group-lessons"
import { LessonQuizDialog } from "@/features/elementary/quiz/components/lesson-quiz-dialog"

function getGroupDisplayName(groupId: string) {
  const num = parseInt(groupId.split("_").pop() ?? "0", 10)
  return `Nhóm ${num}`
}

type GroupStatus = "waiting" | "active"

function getSummary(groups: Group[]) {
  const active = groups.filter((g) => g.status === "active")
  const waiting = groups.filter((g) => g.status === "waiting")
  const totalStudents = groups.reduce((s, g) => s + g.members.length, 0)
  const scores = active
    .filter((g) => g.averageScore !== "—")
    .map((g) => parseFloat(g.averageScore))
  const avgScore = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : "—"

  return {
    totalGroups: groups.length,
    activeGroups: active.length,
    waitingGroups: waiting.length,
    totalStudents,
    avgScore,
  }
}

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
  return parts
    .slice(-2)
    .map((p) => p[0])
    .join("")
}

/* ─── Status tabs config ─── */
type StatusFilter = "all" | GroupStatus
type ViewMode = "list" | "lesson-ranking" | "overall-ranking" | "lessons"

const statusTabs: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang hoạt động" },
  { value: "waiting", label: "Đang chờ" },
]

/* ─── Status badge for lessons ─── */
const lessonStatusConfig = {
  completed: { label: "Đã học", icon: CheckCircleIcon, className: "done" },
  current: { label: "Đang học", icon: ClockIcon, className: "current" },
  pending: { label: "Sắp học", icon: CircleIcon, className: "pending" },
} as const

export function GroupsPage({ classId }: { classId?: string }) {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedLesson, setSelectedLesson] = useState<(Lesson & { status: LessonStatus }) | null>(null)

  const { classes: allClasses } = useClasses()
  const { groups: allGroups } = useGroupsByClass(classId ?? null)
  const { lessons, loading: lessonsLoading } = useLessons()
  const { classLessons, loading: classLessonsLoading, setCurrentLesson, updating: updatingLesson } = useClassLessons(
    classId ?? null
  )
  const { groupLessons, loading: groupLessonsLoading } = useGroupLessons(
    classId ?? null
  )

  const selectedClass = classId
    ? allClasses.find((c) => c.id === classId)
    : undefined

  const filtered = useMemo(
    () =>
      allGroups.filter((g) => activeStatus === "all" || g.status === activeStatus),
    [allGroups, activeStatus]
  )

  const pageSummary = useMemo(() => getSummary(filtered), [filtered])

  /** Lessons merged with per-class progress */
  const lessonsWithProgress = useMemo(() => {
    return lessons
      .slice()
      .sort((a, b) => a.lessonNumber - b.lessonNumber)
      .map((lesson) => {
        const cl = classLessons.find((c) => c.lessonId === lesson.id)
        return {
          ...lesson,
          status: cl?.status ?? ("pending" as const),
        }
      })
  }, [lessons, classLessons])

  const completedCount = lessonsWithProgress.filter(
    (l) => l.status === "completed"
  ).length
  const currentLesson = lessonsWithProgress.find((l) => l.status === "current")

  /** Score map: groupId → score for the current lesson (from groupLessons) */
  const groupLessonScoreMap = useMemo(() => {
    const map = new Map<string, { score: number; completionPct: number }>()
    if (!currentLesson) return map
    for (const gl of groupLessons) {
      if (gl.lessonId === currentLesson.id) {
        map.set(gl.groupId, { score: gl.score, completionPct: gl.completionPct })
      }
    }
    return map
  }, [groupLessons, currentLesson?.id])

  const lessonProgressPct =
    lessonsWithProgress.length > 0
      ? Math.round((completedCount / lessonsWithProgress.length) * 100)
      : 0

  const rankedGroups = useMemo(() => {
    const activeGroups = filtered.filter((group) => group.status === "active")

    return activeGroups
      .map((group) => {
        const completionPct =
          group.totalQuizzes > 0
            ? Math.round((group.completedQuizzes / group.totalQuizzes) * 100)
            : 0
        const score =
          group.averageScore === "—" ? 0 : parseFloat(group.averageScore)

        return {
          ...group,
          completionPct,
          score,
        }
      })
      .sort((a, b) => {
        if (viewMode === "lesson-ranking") {
          const aScore =
            groupLessonScoreMap.get(a.id)?.score ?? a.lessonScore
          const bScore =
            groupLessonScoreMap.get(b.id)?.score ?? b.lessonScore
          if (bScore !== aScore) return bScore - aScore

          const aPct =
            groupLessonScoreMap.get(a.id)?.completionPct ??
            a.lessonCompletionPct
          const bPct =
            groupLessonScoreMap.get(b.id)?.completionPct ??
            b.lessonCompletionPct
          return bPct - aPct
        }

        if (b.overallPoints !== a.overallPoints) {
          return b.overallPoints - a.overallPoints
        }

        return b.score - a.score
      })
  }, [filtered, viewMode, groupLessonScoreMap])

  const isRankingMode = viewMode === "lesson-ranking" || viewMode === "overall-ranking"
  const isLessonsMode = viewMode === "lessons"

  return (
    <div className="el-grp-page">
      {/* ─── Header ─── */}
      <div className="el-grp-header">
        <div>
          {selectedClass && (
            <div className="el-grp-breadcrumb">
              <Link href="/elementary-teacher/classes">Lớp học</Link>
              <ChevronRightIcon className="el-grp-breadcrumb-sep" />
              <span className="el-grp-breadcrumb-current">
                Lớp {selectedClass.grade}/{selectedClass.classNumber}
              </span>
            </div>
          )}
          <h1>
            {selectedClass
              ? `Nhóm — Lớp ${selectedClass.grade}/${selectedClass.classNumber}`
              : "Nhóm học"}
          </h1>
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
        {/* View tabs (left) */}
        <div className="el-grp-view-tabs" aria-label="Chế độ xem">
          <button
            type="button"
            className={cn("el-grp-view-tab", viewMode === "list" && "active")}
            onClick={() => setViewMode("list")}
          >
            <UsersIcon />
            Danh sách
          </button>
          {classId && (
            <button
              type="button"
              className={cn("el-grp-view-tab", viewMode === "lessons" && "active")}
              onClick={() => setViewMode("lessons")}
            >
              <BookOpenIcon />
              Bài học
            </button>
          )}
          <button
            type="button"
            className={cn(
              "el-grp-view-tab",
              viewMode === "lesson-ranking" && "active"
            )}
            onClick={() => setViewMode("lesson-ranking")}
          >
            <BookCheckIcon />
            Xếp hạng bài học
          </button>
          <button
            type="button"
            className={cn(
              "el-grp-view-tab",
              viewMode === "overall-ranking" && "active"
            )}
            onClick={() => setViewMode("overall-ranking")}
          >
            <TrophyIcon />
            Xếp hạng tổng hợp
          </button>
        </div>

        {/* Status toggle — only in list mode */}
        {!isLessonsMode && (
          <div className="el-grp-status-tabs">
            {statusTabs.map((tab) => {
              const count =
                tab.value === "all"
                  ? allGroups.length
                  : allGroups.filter((g) => g.status === tab.value).length
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
        )}
      </div>

      {/* ─── Content ─── */}
      {isLessonsMode ? (
        /* ─── Lessons tab ─── */
        lessonsLoading || classLessonsLoading ? (
          <div className="el-grp-empty">
            <div className="el-spinner" />
            <p>Đang tải danh sách bài học...</p>
          </div>
        ) : lessonsWithProgress.length > 0 ? (
          <div className="el-lesson-view">
            {/* Summary bar */}
            <div className="el-lesson-summary">
              <div className="el-lesson-summary-left">
                <div className="el-lesson-summary-ring">
                  <svg viewBox="0 0 36 36">
                    <path
                      className="el-lesson-ring-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="el-lesson-ring-fill"
                      strokeDasharray={`${lessonProgressPct}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="el-lesson-ring-text">{lessonProgressPct}%</span>
                </div>
              </div>
              <div className="el-lesson-summary-right">
                <h3>Tiến độ bài học</h3>
                <p>
                  Đã học {completedCount}/{lessonsWithProgress.length} bài
                  {currentLesson && (
                    <>
                      {" "}· Bài hiện tại: <strong>{currentLesson.title}</strong>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Lesson list */}
            <div className="el-lesson-list">
              {lessonsWithProgress.map((lesson) => {
                const cfg = lessonStatusConfig[lesson.status]
                const StatusIcon = cfg.icon
                return (
                  <div
                    key={lesson.id}
                    className={cn("el-lesson-item", cfg.className)}
                  >
                    <button
                      type="button"
                      className="el-lesson-clickable"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <div className="el-lesson-icon">
                        <StatusIcon />
                      </div>
                      <div className="el-lesson-info">
                        <div className="el-lesson-title">
                          Lesson {lesson.lessonNumber}: {lesson.title}
                        </div>
                        <div className="el-lesson-meta">
                          {lesson.description} · {lesson.totalWords} từ · {lesson.quizCount} quiz
                        </div>
                      </div>
                      <span className={cn("el-lesson-badge", cfg.className)}>
                        {cfg.label}
                      </span>
                    </button>
                    {lesson.status === "pending" && (
                      <button
                        type="button"
                        className="el-lesson-set-current"
                        disabled={updatingLesson}
                        onClick={() => setCurrentLesson(lesson.lessonNumber)}
                      >
                        <PlayIcon className="h-3.5 w-3.5" />
                        Đặt làm bài hiện tại
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="el-grp-empty">
            <BookOpenIcon />
            <p>Chưa có bài học nào.</p>
          </div>
        )
      ) : isRankingMode ? (
        /* ─── Ranking tabs ─── */
        groupLessonsLoading && groupLessonScoreMap.size === 0 ? (
          <div className="el-grp-empty">
            <div className="el-spinner" />
            <p>Đang tải dữ liệu xếp hạng...</p>
          </div>
        ) : rankedGroups.length > 0 ? (
          <div className="el-grp-ranking">
            {viewMode === "lesson-ranking" && currentLesson && (
              <div className="el-grp-ranking-current">
                <BookOpenIcon />
                Xếp hạng theo bài: <strong>{currentLesson.title}</strong>
              </div>
            )}
            {rankedGroups.map((group, index) => (
              <div
                key={group.id}
                className={cn(
                  "el-grp-rank-card",
                  index === 0 && "top-1",
                  index === 1 && "top-2",
                  index === 2 && "top-3"
                )}
              >
                <div className="el-grp-rank-medal">
                  {index < 3 ? ["1", "2", "3"][index] : index + 1}
                </div>

                <div className="el-grp-rank-main">
                  <div className="el-grp-rank-title">
                    <span>{getGroupDisplayName(group.id)}</span>
                    <span className="el-scls-grade" data-grade={group.grade}>
                      {gradeEmoji[group.grade]} {group.className}
                    </span>
                  </div>

                  <div className="el-grp-rank-members">
                    {group.members.map((member, memberIndex) => (
                      <span
                        key={member.studentId}
                        className="el-grp-rank-member"
                      >
                        <span
                          className="el-grp-member-avatar"
                          data-idx={memberIndex}
                        >
                          {initials(member.name)}
                        </span>
                        {member.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="el-grp-rank-metrics">
                  <div className="el-grp-rank-score">
                    {viewMode === "lesson-ranking" ? (
                      <BookCheckIcon />
                    ) : (
                      <StarIcon />
                    )}
                    {viewMode === "lesson-ranking"
                      ? (groupLessonScoreMap.get(group.id)?.score ?? group.lessonScore).toFixed(1)
                      : group.averageScore}
                  </div>
                  <div className="el-grp-rank-progress">
                    <span>
                      {viewMode === "lesson-ranking"
                        ? (() => {
                            const gl = groupLessonScoreMap.get(group.id)
                            const pct = gl?.completionPct ?? group.lessonCompletionPct
                            const lessonTitle = currentLesson?.title ?? group.currentLesson
                            return `${lessonTitle} · ${pct}%`
                          })()
                        : `${group.completionPct}% hoàn thành`}
                    </span>
                    <div className="el-grp-quiz-track">
                      <span
                        className="el-grp-quiz-track-fill"
                        style={{
                          width: `${
                            viewMode === "lesson-ranking"
                              ? (groupLessonScoreMap.get(group.id)?.completionPct ?? group.lessonCompletionPct)
                              : group.completionPct
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="el-grp-rank-points">
                    {viewMode === "lesson-ranking"
                      ? `${groupLessonScoreMap.get(group.id)?.completionPct ?? group.lessonCompletionPct}% bài học`
                      : `${group.overallPoints} điểm tổng hợp`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="el-grp-empty">
            <TrophyIcon />
            <p>Chưa có nhóm đủ dữ liệu để xếp hạng.</p>
          </div>
        )
      ) : filtered.length > 0 ? (
        /* ─── Groups list ─── */
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
                  <div className="el-grp-class-name">
                    {getGroupDisplayName(group.id)}
                  </div>

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

                    {group.status === "waiting" &&
                      group.members.length === 1 && (
                        <div className="el-grp-member-empty">
                          <div className="el-grp-member-empty-avatar">
                            <PlusIcon />
                          </div>
                          <span className="el-grp-member-empty-label">
                            Chờ ghép đôi
                          </span>
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
                      <span style={{ fontStyle: "italic" }}>
                        Chưa có bài quiz
                      </span>
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

      {/* ─── Lesson Quiz Dialog ─── */}
      {selectedLesson && (
        <LessonQuizDialog
          lesson={selectedLesson}
          status={selectedLesson.status}
          open={!!selectedLesson}
          onOpenChange={(open) => {
            if (!open) setSelectedLesson(null)
          }}
        />
      )}
    </div>
  )
}
