"use client"

import { useState } from "react"
import { PlusIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { ClassSchedule, StaffClass, StaffClassStatus } from "../types"
import { getDayLabel } from "../helpers"

type ClassFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initialData?: StaffClass | null
  onSubmit: (data: Omit<StaffClass, "id" | "createdAt" | "updatedAt">) => void
}

const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7]
const STATUS_OPTIONS: { value: StaffClassStatus; label: string }[] = [
  { value: "active", label: "Đang hoạt động" },
  { value: "paused", label: "Tạm dừng" },
  { value: "ended", label: "Đã kết thúc" },
]

function ClassFormInner({
  mode,
  initialData,
  onSubmit,
  onOpenChange,
}: {
  mode: "create" | "edit"
  initialData?: StaffClass | null
  onSubmit: (data: Omit<StaffClass, "id" | "createdAt" | "updatedAt">) => void
  onOpenChange: (open: boolean) => void
}) {
  const isEdit = mode === "edit" && initialData

  const [code, setCode] = useState(isEdit ? initialData.code : "")
  const [name, setName] = useState(isEdit ? initialData.name : "")
  const [instructor, setInstructor] = useState(isEdit ? initialData.instructor : "")
  const [subjects, setSubjects] = useState<string[]>(isEdit ? [...initialData.subjects] : [])
  const [subjectInput, setSubjectInput] = useState("")
  const [maxStudents, setMaxStudents] = useState(isEdit ? initialData.maxStudents : 30)
  const [currentStudents, setCurrentStudents] = useState(isEdit ? initialData.currentStudents : 0)
  const [schedule, setSchedule] = useState<ClassSchedule[]>(
    isEdit ? [...initialData.schedule] : [{ dayOfWeek: 2, startTime: "18:00", endTime: "20:00" }]
  )
  const [status, setStatus] = useState<StaffClassStatus>(isEdit ? initialData.status : "active")
  const [startDate, setStartDate] = useState(isEdit ? initialData.startDate : "")
  const [endDate, setEndDate] = useState(isEdit ? initialData.endDate : "")
  const [location, setLocation] = useState(isEdit ? (initialData.location ?? "") : "")

  function addSubject() {
    const val = subjectInput.trim()
    if (val && !subjects.includes(val)) {
      setSubjects((prev) => [...prev, val])
      setSubjectInput("")
    }
  }

  function removeSubject(s: string) {
    setSubjects((prev) => prev.filter((x) => x !== s))
  }

  function addScheduleRow() {
    setSchedule((prev) => [
      ...prev,
      { dayOfWeek: 2, startTime: "18:00", endTime: "20:00" },
    ])
  }

  function removeScheduleRow(index: number) {
    setSchedule((prev) => prev.filter((_, i) => i !== index))
  }

  function updateScheduleRow(
    index: number,
    field: keyof ClassSchedule,
    value: string | number
  ) {
    setSchedule((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      code,
      name,
      instructor,
      subjects,
      maxStudents,
      currentStudents,
      schedule,
      status,
      startDate,
      endDate,
      location: location || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
      {/* Mã lớp */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Mã lớp *</label>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="VD: LHP-2026-01"
          required
        />
      </div>

      {/* Tên lớp */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Tên lớp *</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="VD: Lập trình Web Full Stack"
          required
        />
      </div>

      {/* Giảng viên */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Giảng viên *</label>
        <Input
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          placeholder="VD: TS. Nguyễn Văn An"
          required
        />
      </div>

      {/* Bộ môn */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Bộ môn *</label>
        <div className="flex gap-2">
          <Input
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            placeholder="Nhập tên bộ môn"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addSubject()
              }
            }}
          />
          <Button type="button" variant="outline" size="icon" onClick={addSubject}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {subjects.map((s) => (
              <span key={s} className="st-subject-badge">
                {s}
                <button
                  type="button"
                  className="ml-1 opacity-60 hover:opacity-100"
                  aria-label={`Xóa ${s}`}
                  onClick={() => removeSubject(s)}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sĩ số */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Sĩ số tối đa *</label>
          <Input
            type="number"
            min={1}
            value={maxStudents}
            onChange={(e) => setMaxStudents(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Sĩ số hiện tại</label>
          <Input
            type="number"
            min={0}
            value={currentStudents}
            onChange={(e) => setCurrentStudents(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Lịch học */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Lịch học *</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={addScheduleRow}
          >
            <PlusIcon className="h-3 w-3" />
            Thêm buổi
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {schedule.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                aria-label="Thứ trong tuần"
                value={s.dayOfWeek}
                onChange={(e) =>
                  updateScheduleRow(i, "dayOfWeek", Number(e.target.value))
                }
              >
                {DAY_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {getDayLabel(d)}
                  </option>
                ))}
              </select>
              <Input
                type="time"
                className="w-28"
                value={s.startTime}
                onChange={(e) =>
                  updateScheduleRow(i, "startTime", e.target.value)
                }
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="time"
                className="w-28"
                value={s.endTime}
                onChange={(e) =>
                  updateScheduleRow(i, "endTime", e.target.value)
                }
              />
              {schedule.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeScheduleRow(i)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trạng thái */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="st-status-select" className="text-sm font-medium">Trạng thái</label>
        <select
          id="st-status-select"
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as StaffClassStatus)}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Ngày bắt đầu</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Ngày kết thúc</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Địa điểm */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Địa điểm</label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="VD: Phòng A201, Tầng 2"
        />
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Hủy
        </Button>
        <Button type="submit">
          {mode === "create" ? "Tạo lớp" : "Cập nhật"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function ClassFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: ClassFormDialogProps) {
  const formKey = mode === "edit" ? initialData?.id : "create"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm lớp mới" : "Chỉnh sửa lớp học"}
          </DialogTitle>
        </DialogHeader>
        {open && (
          <ClassFormInner
            key={formKey}
            mode={mode}
            initialData={initialData}
            onSubmit={onSubmit}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
