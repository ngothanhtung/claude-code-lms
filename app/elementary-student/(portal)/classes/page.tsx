"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStudentProfile } from "@/features/elementary/profile/hooks/use-student-profile"

export default function StudentClassesRootPage() {
  const router = useRouter()
  const { profile, loading } = useStudentProfile()

  useEffect(() => {
    if (loading) return

    if (profile?.classId) {
      router.replace(`/elementary-student/classes/${profile.classId}`)
    }
  }, [loading, profile, router])

  if (loading) {
    return (
      <div className="el-loading">
        <div className="el-spinner" />
        <span>Đang tải thông tin lớp học...</span>
      </div>
    )
  }

  if (!profile?.classId) {
    return (
      <div className="el-loading">
        <span>Bạn chưa được phân lớp.</span>
      </div>
    )
  }

  return null
}
