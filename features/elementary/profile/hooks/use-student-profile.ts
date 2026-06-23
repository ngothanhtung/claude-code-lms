"use client"

import { useStudentSession } from "./use-student-session"

/**
 * Derived view of the StudentSession — same shape as before for
 * backwards compatibility with existing components.
 *
 * No Firestore lookup — the selector page already resolved classId and
 * groupId, so we just expose them as a StudentProfile.
 */
export interface StudentProfile {
  userId: string
  name: string
  classId: string
  groupId: string | null
  groupIndex: number | null
}

interface UseStudentProfileReturn {
  profile: StudentProfile | null
  loading: boolean
  error: string | null
}

export function useStudentProfile(): UseStudentProfileReturn {
  const { session, hydrated } = useStudentSession()

  // Until the session is hydrated from sessionStorage we report loading=true
  // so callers don't briefly render the empty state.
  const loading = !hydrated
  if (!session) {
    return { profile: null, loading, error: null }
  }

  return {
    profile: {
      userId: session.studentId,
      name: session.name,
      classId: session.classId,
      groupId: session.groupId,
      groupIndex: session.groupIndex,
    },
    loading,
    error: null,
  }
}
