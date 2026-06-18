"use client"

import { useMemo, useState } from "react"
import { PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react"
import { BadgeStatus } from "@/components/badge-status"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { StaffClass, StaffClassStatus } from "../types"
import { STATUS_LABELS, STATUS_VARIANT_MAP } from "../mock"
import { ClassFormDialog } from "./class-form-dialog"
import { ClassDeleteDialog } from "./class-delete-dialog"
import { formatSchedule } from "../helpers"

type ClassesTableProps = {
  classes: StaffClass[]
  summary: { total: number; active: number; paused: number; ended: number }
}

type FilterTab = "all" | StaffClassStatus

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang hoạt động" },
  { value: "paused", label: "Tạm dừng" },
  { value: "ended", label: "Đã kết thúc" },
]

export function ClassesTable({ classes, summary }: ClassesTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterTab>("all")

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingClass, setEditingClass] = useState<StaffClass | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingClass, setDeletingClass] = useState<StaffClass | null>(null)

  const [localClasses, setLocalClasses] = useState<StaffClass[]>(classes)

  const filtered = useMemo(() => {
    return localClasses.filter((cls) => {
      if (statusFilter !== "all" && cls.status !== statusFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          cls.code.toLowerCase().includes(q) ||
          cls.name.toLowerCase().includes(q) ||
          cls.instructor.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [localClasses, searchQuery, statusFilter])

  function handleCreate() {
    setFormMode("create")
    setEditingClass(null)
    setFormOpen(true)
  }

  function handleEdit(cls: StaffClass) {
    setFormMode("edit")
    setEditingClass(cls)
    setFormOpen(true)
  }

  function handleDelete(cls: StaffClass) {
    setDeletingClass(cls)
    setDeleteOpen(true)
  }

  function handleSubmit(data: Omit<StaffClass, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString().slice(0, 10)

    if (formMode === "create") {
      const newClass: StaffClass = {
        ...data,
        id: `cls-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      }
      setLocalClasses((prev) => [newClass, ...prev])
    } else if (editingClass) {
      setLocalClasses((prev) =>
        prev.map((c) =>
          c.id === editingClass.id ? { ...c, ...data, updatedAt: now } : c
        )
      )
    }
    setFormOpen(false)
  }

  function handleConfirmDelete() {
    if (!deletingClass) return
    setLocalClasses((prev) => prev.filter((c) => c.id !== deletingClass.id))
    setDeleteOpen(false)
    setDeletingClass(null)
  }

  return (
    <>
      <div className="st-table-toolbar">
        <div className="st-filters">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm mã lớp, tên, giảng viên..."
              className="pl-9 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`st-filter-btn ${statusFilter === tab.value ? "active" : ""}`}
              onClick={() => setStatusFilter(tab.value)}
            >
              {tab.label}
              {tab.value === "all" && <span>{summary.total}</span>}
              {tab.value === "active" && <span>{summary.active}</span>}
              {tab.value === "paused" && <span>{summary.paused}</span>}
              {tab.value === "ended" && <span>{summary.ended}</span>}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={handleCreate}>
          <PlusIcon className="h-4 w-4" />
          Thêm lớp mới
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="st-empty">
          <SearchIcon className="st-empty-icon" />
          <p className="st-empty-text">Không tìm thấy lớp học nào</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã lớp</TableHead>
              <TableHead>Tên lớp</TableHead>
              <TableHead>Giảng viên</TableHead>
              <TableHead>Bộ môn</TableHead>
              <TableHead>Sĩ số</TableHead>
              <TableHead>Lịch học</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>
                  <span className="font-mono text-sm font-semibold">{cls.code}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{cls.name}</span>
                </TableCell>
                <TableCell>{cls.instructor}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects.map((s) => (
                      <span key={s} className="st-subject-badge">{s}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="st-student-count">
                    {cls.currentStudents}/{cls.maxStudents}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="st-schedule-text">
                    {formatSchedule(cls.schedule)}
                  </span>
                </TableCell>
                <TableCell>
                  <BadgeStatus variant={STATUS_VARIANT_MAP[cls.status] as "success" | "warning" | "outline"}>
                    {STATUS_LABELS[cls.status]}
                  </BadgeStatus>
                </TableCell>
                <TableCell className="text-right">
                  <div className="st-table-actions justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(cls)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(cls)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ClassFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initialData={editingClass}
        onSubmit={handleSubmit}
      />

      <ClassDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        classCode={deletingClass?.code ?? ""}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
