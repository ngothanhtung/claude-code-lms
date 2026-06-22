"use client"

import {
  UsersIcon,
  StarIcon,
  BookCheckIcon,
  CheckCircleIcon,
  CircleIcon,
  ArrowRightIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useStudentProfile } from "@/features/elementary/profile/hooks/use-student-profile"
import { useGroupsByClass } from "@/features/elementary/quiz/hooks/use-groups"
import { useLessons } from "@/features/elementary/lessons/hooks/use-lessons"
import { useGroupLessons } from "@/features/elementary/groups/hooks/use-group-lessons"
import { StudentGroupRail } from "@/features/elementary/groups/components/student-group-rail"

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

export function StudentGroupsPage() {
  const { profile, loading: profileLoading } = useStudentProfile()
  const { groups, loading: groupsLoading } = useGroupsByClass(profile?.classId ?? null)
  const { lessons, loading: lessonsLoading } = useLessons()
  const { groupLessons, loading: glLoading } = useGroupLessons(profile?.classId ?? null)

  const loading = profileLoading || groupsLoading || lessonsLoading || glLoading

  // Find the student's group
  const myGroup = profile?.groupId
    ? groups.find((g) => g.id === profile.groupId)
    : null

  // Get group lessons for my group, sorted by lesson number
  const myGroupLessons = myGroup
    ? groupLessons
        .filter((gl) => gl.groupId === myGroup.id)
        .sort((a, b) => {
          const aLesson = lessons.find((l) => l.id === a.lessonId)
          const bLesson = lessons.find((l) => l.id === b.lessonId)
          return (aLesson?.lessonNumber ?? 0) - (bLesson?.lessonNumber ?? 0)
        })
    : []

  // Link to the quiz page with class + group params
  const quizHref = myGroup && profile?.classId
    ? `/elementary-student/quiz?class=${profile.classId}&group=${myGroup.id}`
    : "/elementary-student/quiz"

  if (loading) {
    return (
      <div className="el-col-main">
        <div className="el-loading">
          <div className="el-spinner" />
          <span>Đang tải thông tin nhóm...</span>
        </div>
      </div>
    )
  }

  if (!profile || !myGroup) {
    return (
      <div className="el-col-main">
        <div className="el-sgrp-header">
          <div>
            <h1>Nhóm của mình</h1>
            <p>Bạn chưa được phân vào nhóm nào.</p>
          </div>
        </div>
      </div>
    )
  }

  const quizPct = myGroup.totalQuizzes > 0
    ? Math.round((myGroup.completedQuizzes / myGroup.totalQuizzes) * 100)
    : 0

  return (
    <>
      <div className="el-col-main">
        {/* Header */}
        <div className="el-sgrp-header">
          <div>
            <h1>Nhóm của mình</h1>
            <p>Lớp {myGroup.className} · Năm học 2025–2026</p>
          </div>
        </div>

        {/* Group card */}
        <div className="el-sgrp-card">
          {/* Card header */}
          <div className="el-sgrp-card-header">
            <div className="el-sgrp-card-left">
              <span className="el-scls-grade" data-grade={myGroup.grade}>
                🦊 Nhóm {profile.groupIndex}
              </span>
              <h2 className="el-sgrp-group-name">{myGroup.className}</h2>
              <div className="el-scls-meta">
                <span className="el-scls-meta-item">
                  <UsersIcon />
                  {myGroup.members.length} thành viên
                </span>
                <span className="el-scls-meta-item">
                  {myGroup.status === "active" ? "Đang hoạt động" : "Chờ bắt đầu"}
                </span>
              </div>
            </div>
            <div className="el-sgrp-score-box">
              <div className="el-sgrp-score-value">{myGroup.averageScore}</div>
              <div className="el-sgrp-score-label">Điểm TB nhóm</div>
            </div>
          </div>

          {/* Stats row */}
          <div className="el-scls-stats-row">
            <div className={cn("el-scls-stat-chip", "teal")}>
              <BookCheckIcon />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1 }}>
                  {myGroup.completedQuizzes}/{myGroup.totalQuizzes}
                </div>
                <div style={{ fontSize: 11, marginTop: 2 }}>Quiz đã làm</div>
              </div>
            </div>
            <div className={cn("el-scls-stat-chip", "gold")}>
              <StarIcon />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1 }}>
                  {quizPct}%
                </div>
                <div style={{ fontSize: 11, marginTop: 2 }}>
                  Tỷ lệ hoàn thành
                </div>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="el-scls-section">
            <h3 className="el-scls-section-title">
              Thành viên nhóm
              <span className="el-scls-classmate-count">
                +{myGroup.members.length}
              </span>
            </h3>
            <div className="el-scls-classmates">
              {myGroup.members.map((mate) => (
                <div key={mate.studentId} className="el-scls-classmate">
                  <div className="el-scls-classmate-avatar">
                    {getInitials(mate.name)}
                  </div>
                  <span className="el-scls-classmate-name">{mate.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz progress */}
          <div className="el-scls-section">
            <h3 className="el-scls-section-title">Tiến độ quiz</h3>
            <div className="el-scls-lesson-list">
              {lessons
                .slice()
                .sort((a, b) => a.lessonNumber - b.lessonNumber)
                .map((lesson) => {
                  const gl = myGroupLessons.find((gl) => gl.lessonId === lesson.id)
                  const completed = gl?.status === "completed" && gl.score > 0
                  const score = gl?.score ?? 0

                  return (
                    <div key={lesson.id} className="el-scls-lesson">
                      <div className="el-scls-lesson-left">
                        <div
                          className={cn(
                            "el-scls-lesson-icon",
                            completed ? "done" : "pending"
                          )}
                        >
                          {completed ? <CheckCircleIcon /> : <CircleIcon />}
                        </div>
                        <div>
                          <div className="el-scls-lesson-title">
                            Quiz — Lesson {lesson.lessonNumber}: {lesson.title}
                          </div>
                          {completed && (
                            <div className="el-scls-lesson-score">
                              Score: {score.toFixed(1)}/10
                            </div>
                          )}
                        </div>
                      </div>
                      {completed && (
                        <div className="el-scls-lesson-bar">
                          <div
                            className="el-scls-lesson-bar-fill"
                            style={{ width: `${(score / 10) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Quick action */}
          <div className="el-scls-section">
            <Link href={quizHref} className="el-sgrp-start-quiz">
              <span>Bắt đầu quiz tiếp theo</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>

      {/* Right rail — stats & charts */}
      <StudentGroupRail
        group={myGroup}
        allGroups={groups}
        myGroupId={myGroup.id}
        groupLessons={myGroupLessons}
      />
    </>
  )
}
