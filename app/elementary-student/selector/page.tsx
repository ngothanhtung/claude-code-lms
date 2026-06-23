"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  UsersIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  GraduationCapIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from "lucide-react"
import { useClasses, grades } from "@/features/elementary/quiz/hooks/use-classes"
import { useGroupsByClass } from "@/features/elementary/quiz/hooks/use-groups"
import { useStudentSession } from "@/features/elementary/profile/hooks/use-student-session"
import type { GradeLevel } from "@/features/elementary/quiz/hooks/use-classes"

type Step = "grade" | "class" | "group" | "name"

export default function SelectorPage() {
  const router = useRouter()
  const { session, setSession, hydrated } = useStudentSession()

  const { classes: allClasses, loading: classesLoading } = useClasses()
  const [step, setStep] = useState<Step>("grade")
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | null>(null)
  const [selectedClassId, setSelectedClassId] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState("")
  const [selectedStudentIdx, setSelectedStudentIdx] = useState<number | null>(null)

  const { groups: allGroups, loading: groupsLoading } = useGroupsByClass(
    selectedClassId || null,
  )

  // Always show selector on this page — never auto-redirect away.
  // (Avoids race: e.g. old sessionStorage entry shouldn't bounce the user
  // past the selector without their consent.)

  const classesForGrade = useMemo(
    () =>
      selectedGrade
        ? allClasses.filter((item) => item.grade === selectedGrade)
        : [],
    [selectedGrade, allClasses],
  )

  const selectedClass = selectedClassId
    ? allClasses.find((item) => item.id === selectedClassId)
    : undefined

  const selectedGroup = selectedGroupId
    ? allGroups.find((group) => group.id === selectedGroupId)
    : undefined

  const handleGradeSelect = useCallback((grade: GradeLevel) => {
    setSelectedGrade(grade)
    setSelectedClassId("")
    setSelectedGroupId("")
    setSelectedStudentIdx(null)
    setStep("class")
  }, [])

  const handleClassSelect = useCallback((nextClassId: string) => {
    setSelectedClassId(nextClassId)
    setSelectedGroupId("")
    setSelectedStudentIdx(null)
    setStep("group")
  }, [])

  const handleGroupSelect = useCallback((nextGroupId: string) => {
    setSelectedGroupId(nextGroupId)
    setSelectedStudentIdx(null)
    setStep("name")
  }, [])

  const handleNameSelect = useCallback(
    (idx: number) => {
      setSelectedStudentIdx(idx)
      const group = allGroups.find((g) => g.id === selectedGroupId)
      const member = group?.members[idx]
      if (!member || !group) return

      const groupParts = group.id.split("_")
      const groupIndex = parseInt(groupParts[groupParts.length - 1], 10)

      setSession({
        studentId: member.studentId,
        name: member.name,
        classId: selectedClassId,
        groupId: group.id,
        groupIndex,
      })

      router.push("/elementary-student/dashboard")
    },
    [allGroups, selectedGroupId, selectedClassId, setSession, router],
  )

  const stepItems = [
    { key: "grade", label: "Khối" },
    { key: "class", label: "Lớp" },
    { key: "group", label: "Nhóm" },
    { key: "name", label: "Tên" },
  ] as const

  const stepOrder = stepItems.findIndex((s) => s.key === step)
  const loading = classesLoading || groupsLoading

  return (
    <div className="el-quiz-entry">
      <div className="el-quiz-entry-hero">
        <div>
          <div className="el-quiz-entry-eyebrow">
            <GraduationCapIcon />
            Học sinh tiểu học
          </div>
          <h1>Chọn lớp và nhóm của em</h1>
          <p>Chọn đúng khối, lớp, nhóm và tên để bắt đầu học.</p>
        </div>
        <div className="el-quiz-entry-steps">
          {stepItems.map((s, i) => (
            <span
              key={s.key}
              className={
                i < stepOrder
                  ? "done"
                  : s.key === step
                    ? "active"
                    : ""
              }
            >
              {i + 1}. {s.label}
              {i < stepItems.length - 1 && <ChevronRightIcon />}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="el-loading">
          <div className="el-spinner" />
          <span>Đang tải danh sách...</span>
        </div>
      ) : (
        <>
          {/* Step 1: Grade */}
          <section className="el-quiz-pick-section">
            <div className="el-quiz-pick-head">
              <GraduationCapIcon />
              <div>
                <h2>Chọn khối</h2>
                <p>Khối 1 đến khối 5</p>
              </div>
            </div>
            <div className="el-quiz-grade-grid">
              {grades.map((grade) => (
                <button
                  key={grade.level}
                  type="button"
                  className={selectedGrade === grade.level ? "active" : ""}
                  onClick={() => handleGradeSelect(grade.level)}
                >
                  <span>Khối {grade.level}</span>
                  <small>{grade.label}</small>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Class */}
          {selectedGrade && (
            <section className="el-quiz-pick-section">
              <div className="el-quiz-pick-head">
                <BookOpenIcon />
                <div>
                  <h2>Chọn lớp</h2>
                  <p>Các lớp khối {selectedGrade}</p>
                </div>
              </div>
              <div className="el-quiz-class-grid">
                {classesForGrade.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={selectedClassId === item.id ? "active" : ""}
                    onClick={() => handleClassSelect(item.id)}
                  >
                    <span>
                      Lớp {item.grade}/{item.classNumber}
                    </span>
                    <small>{item.studentCount} học sinh</small>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Step 3: Group */}
          {selectedClassId && (
            <section className="el-quiz-pick-section">
              <div className="el-quiz-pick-head">
                <UsersIcon />
                <div>
                  <h2>Chọn nhóm</h2>
                  <p>
                    {selectedClass
                      ? `20 nhóm của lớp ${selectedClass.grade}/${selectedClass.classNumber}`
                      : "Chọn lớp trước"}
                  </p>
                </div>
              </div>
              <div className="el-quiz-group-grid">
                {allGroups.map((group) => {
                  const idx = group.id.split("_").pop()
                  return (
                    <button
                      key={group.id}
                      type="button"
                      className={selectedGroupId === group.id ? "active" : ""}
                      onClick={() => handleGroupSelect(group.id)}
                    >
                      <span>Nhóm {idx}</span>
                      <small>
                        {group.members
                          .map((member) => member.name)
                          .join(" · ")}
                      </small>
                      {selectedGroupId === group.id && <CheckCircle2Icon />}
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {/* Step 4: Name */}
          {selectedGroupId && selectedGroup && (
            <section className="el-quiz-pick-section">
              <div className="el-quiz-pick-head">
                <UsersIcon />
                <div>
                  <h2>Chọn tên của em</h2>
                  <p>Chọn đúng tên trong nhóm</p>
                </div>
              </div>
              <div className="el-quiz-group-grid">
                {selectedGroup.members.map((member, idx) => (
                  <button
                    key={member.studentId}
                    type="button"
                    className={
                      selectedStudentIdx === idx ? "active" : ""
                    }
                    onClick={() => handleNameSelect(idx)}
                  >
                    <span>{member.name}</span>
                    <small>{member.studentId}</small>
                    {selectedStudentIdx === idx && <CheckCircle2Icon />}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Selected summary */}
          <div className="el-quiz-entry-footer">
            <div>
              <strong>
                {selectedGroup && selectedStudentIdx !== null
                  ? `Đã chọn: ${selectedGroup.members[selectedStudentIdx].name}`
                  : "Chưa chọn đủ thông tin"}
              </strong>
              <span>
                {selectedClass
                  ? `Lớp ${selectedClass.grade}/${selectedClass.classNumber}`
                  : "Hãy chọn khối, lớp, nhóm và tên"}
              </span>
            </div>
            {step === "name" && selectedStudentIdx === null && (
              <span className="el-quiz-entry-hint">
                Chọn tên của em để vào lớp
                <ArrowRightIcon />
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
