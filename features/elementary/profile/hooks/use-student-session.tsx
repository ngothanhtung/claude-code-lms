import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

/**
 * StudentSession — minimal identity stored in sessionStorage.
 * No auth, no Firestore — just enough to resolve classId / groupId / name
 * across the elementary student portal pages.
 */
export interface StudentSession {
  studentId: string   // e.g. "HS3101"
  name: string
  classId: string     // e.g. "class_3_1"
  groupId: string     // e.g. "group_class_3_1_01"
  groupIndex: number  // e.g. 1
}

const STORAGE_KEY = "elementary_student_session"

interface SessionCtx {
  session: StudentSession | null
  setSession: (s: StudentSession) => void
  clearSession: () => void
  /** True once sessionStorage has been read on mount (prevents flash-redirect). */
  hydrated: boolean
}

const StudentSessionCtx = createContext<SessionCtx | null>(null)

export function StudentSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<StudentSession | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from sessionStorage on mount (client only)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        setSessionState(JSON.parse(raw) as StudentSession)
      }
    } catch {
      // corrupt storage — ignore
    }
    setHydrated(true)
  }, [])

  const setSession = useCallback((s: StudentSession) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    setSessionState(s)
  }, [])

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setSessionState(null)
  }, [])

  return (
    <StudentSessionCtx.Provider value={{ session, setSession, clearSession, hydrated }}>
      {children}
    </StudentSessionCtx.Provider>
  )
}

export function useStudentSession(): SessionCtx {
  const ctx = useContext(StudentSessionCtx)
  if (!ctx) throw new Error("useStudentSession must be used inside StudentSessionProvider")
  return ctx
}

export function getStudentSession(): StudentSession | null {
  if (typeof window === "undefined") return null
  try {
    // eslint-disable-next-line no-restricted-globals
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StudentSession) : null
  } catch {
    return null
  }
}
