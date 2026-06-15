"use client"

import {
  UsersIcon,
  StarIcon,
  BookCheckIcon,
  CheckCircleIcon,
  CircleIcon,
  CalendarCheck2Icon,
  ArrowRightIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { myGroup } from "@/features/elementary/groups/mock/student-groups.mock"
import { StudentGroupRail } from "@/features/elementary/groups/components/student-group-rail"

function getInitials(name: string) {
  const parts = name.split(" ")
  return parts[parts.length - 1][0]
}

function getScoreVariant(score: number) {
  if (score >= 9) return "excellent"
  if (score >= 7.5) return "good"
  return "average"
}

export function StudentGroupsPage() {
  const group = myGroup
  const quizPct = Math.round((group.completedQuizzes / group.totalQuizzes) * 100)

  return (
    <>
      <div className="el-col-main">
        {/* Header */}
        <div className="el-sgrp-header">
          <div>
            <h1>Nhóm của mình</h1>
            <p>
              Lớp {group.className} · Năm học 2025–2026
            </p>
          </div>
        </div>

        {/* Group card */}
        <div className="el-sgrp-card">
          {/* Card header */}
          <div className="el-sgrp-card-header">
            <div className="el-sgrp-card-left">
              <span
                className="el-scls-grade"
                data-grade={group.grade}
              >
                🦊 Nhóm 2
              </span>
              <h2 className="el-sgrp-group-name">{group.className}</h2>
              <div className="el-scls-meta">
                <span className="el-scls-meta-item">
                  <UsersIcon />
                  {group.members.length} thành viên
                </span>
                <span className="el-scls-meta-item">
                  <CalendarCheck2Icon />
                  Bắt đầu từ tháng 1/2026
                </span>
              </div>
            </div>
            <div className="el-sgrp-score-box">
              <div className="el-sgrp-score-value">{group.averageScore}</div>
              <div className="el-sgrp-score-label">Điểm TB nhóm</div>
            </div>
          </div>

          {/* Stats row */}
          <div className="el-scls-stats-row">
            <div className={cn("el-scls-stat-chip", "teal")}>
              <BookCheckIcon />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1 }}>
                  {group.completedQuizzes}/{group.totalQuizzes}
                </div>
                <div style={{ fontSize: 11, marginTop: 2 }}>
                  Quiz đã làm
                </div>
              </div>
            </div>
            <div className={cn("el-scls-stat-chip", "gold")}>
              <StarIcon />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1 }}>{quizPct}%</div>
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
              <span className="el-scls-classmate-count">+{group.members.length}</span>
            </h3>
            <div className="el-scls-classmates">
              {group.members.map((mate) => (
                <div key={mate.studentId} className="el-scls-classmate">
                  <div className="el-scls-classmate-avatar">{getInitials(mate.name)}</div>
                  <span className="el-scls-classmate-name">{mate.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz progress */}
          <div className="el-scls-section">
            <h3 className="el-scls-section-title">Tiến độ quiz</h3>
            <div className="el-scls-lesson-list">
              {group.quizzes.map((quiz, idx) => (
                <div key={idx} className="el-scls-lesson">
                  <div className="el-scls-lesson-left">
                    <div
                      className={cn(
                        "el-scls-lesson-icon",
                        quiz.completed ? "done" : "pending"
                      )}
                    >
                      {quiz.completed ? (
                        <CheckCircleIcon />
                      ) : (
                        <CircleIcon />
                      )}
                    </div>
                    <div>
                      <div className="el-scls-lesson-title">{quiz.title}</div>
                      {quiz.completed && (
                        <div className="el-scls-lesson-score">
                          Score: {quiz.score.toFixed(1)}/10
                        </div>
                      )}
                    </div>
                  </div>
                  {quiz.completed && (
                    <div className="el-scls-lesson-bar">
                      <div
                        className="el-scls-lesson-bar-fill"
                        style={{ width: `${(quiz.score / 10) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick action */}
          <div className="el-scls-section">
            <Link href="/elementary-student/quiz?group=g-3-1-02&class=3-1" className="el-sgrp-start-quiz">
              <span>Bắt đầu quiz tiếp theo</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>

      {/* Right rail — stats & charts */}
      <StudentGroupRail group={group} />
    </>
  )
}
