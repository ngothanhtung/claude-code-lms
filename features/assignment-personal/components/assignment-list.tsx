"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRightIcon,
  ClockIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  BookOpenCheckIcon,
  SearchIcon,
  FileTextIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { BadgeStatus } from "@/components/badge-status"
import { Button } from "@/components/ui/button"
import {
  personalAssignments,
  type AssignmentStatus,
} from "@/features/assignment-personal/mock"

const statusConfig: Record<
  AssignmentStatus,
  { label: string; variant: "destructive" | "warning" | "success" | "info"; icon: typeof ClockIcon }
> = {
  overdue: { label: "Quá hạn", variant: "destructive", icon: AlertTriangleIcon },
  pending: { label: "Chưa nộp", variant: "warning", icon: ClockIcon },
  submitted: { label: "Đã nộp", variant: "success", icon: CheckCircle2Icon },
  graded: { label: "Đã chấm", variant: "info", icon: BookOpenCheckIcon },
}

const statusOrder: AssignmentStatus[] = ["overdue", "pending", "submitted", "graded"]

export function AssignmentList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | "all">("all")

  const sorted = [...personalAssignments].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  )

  const filtered = sorted.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = statusFilter === "all" || a.status === statusFilter
    return matchesSearch && matchesFilter
  })

  const actionLabel = (status: AssignmentStatus): string => {
    switch (status) {
      case "overdue":
      case "pending":
        return "Nộp bài"
      case "submitted":
        return "Xem lại"
      case "graded":
        return "Xem điểm"
    }
  }

  const actionVariant = (status: AssignmentStatus): "primary" | "default" =>
    status === "overdue" || status === "pending" ? "primary" : "default"

  return (
    <Card className="gap-0 rounded-[var(--radius)] border border-border bg-card p-5 shadow-[var(--shadow-card)] ring-0">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="m-0 text-[16.5px] font-bold tracking-tight">
          Danh sách bài tập
        </h2>
        <span className="text-[13px] font-medium text-muted-foreground">
          {filtered.length}/{personalAssignments.length} bài tập
        </span>
      </div>

      {/* Search + Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2">
          <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            placeholder="Tìm kiếm bài tập..."
            aria-label="Tìm kiếm bài tập"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "overdue", "pending", "submitted", "graded"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s === "all"
                ? "Tất cả"
                : s === "overdue"
                  ? "Quá hạn"
                  : s === "pending"
                    ? "Chưa nộp"
                    : s === "submitted"
                      ? "Đã nộp"
                      : "Đã chấm"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <FileTextIcon className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-[14px] font-medium text-muted-foreground">
            Không tìm thấy bài tập nào
          </p>
        </div>
      ) : (
        filtered.map((assignment) => {
          const StatusIcon = statusConfig[assignment.status].icon

          return (
            <div
              key={assignment.id}
              className="flex flex-wrap items-center gap-3.5 border-t border-border py-[13px] first:border-t-0 first:pt-0.5"
            >
              {/* Icon */}
              <div
                className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[11px] ${
                  assignment.status === "overdue"
                    ? "bg-danger-muted text-danger"
                    : assignment.status === "pending"
                      ? "bg-warning-muted text-warning"
                      : assignment.status === "submitted"
                        ? "bg-info-muted text-info"
                        : "bg-success-muted text-success"
                }`}
              >
                <StatusIcon className="h-[18px] w-[18px]" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold">
                  {assignment.title}
                </div>
                <div className="text-[12.5px] text-muted-foreground">
                  {assignment.course}
                </div>
              </div>

              {/* Due date */}
              <div className="text-right text-[12.5px] leading-tight">
                <div className="font-medium text-foreground">
                  {assignment.dueDate}
                </div>
                <div className="text-muted-foreground">
                  {assignment.dueTime}
                </div>
              </div>

              {/* Grade (if graded) */}
              {assignment.grade && assignment.grade !== "—" && (
                <div className="text-right">
                  <div className="text-[15px] font-extrabold text-success">
                    {assignment.grade}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Điểm</div>
                </div>
              )}

              {/* Status badge */}
              <BadgeStatus variant={statusConfig[assignment.status].variant}>
                {statusConfig[assignment.status].label}
              </BadgeStatus>

              {/* Action button */}
              <Button
                variant={actionVariant(assignment.status) === "primary" ? "default" : "outline"}
                size="sm"
                className="h-7 shrink-0 px-3.5 text-[12.5px] font-semibold whitespace-nowrap"
              >
                {actionLabel(assignment.status)}
              </Button>
            </div>
          )
        })
      )}

      {/* Footer */}
      <div className="mt-2 flex items-center justify-center border-t border-border pt-[14px]">
        <Link
          href="/calendar"
          className="inline-flex items-center justify-center gap-1 text-[13px] font-semibold text-primary hover:underline"
        >
          Xem tất cả trên lịch <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  )
}
