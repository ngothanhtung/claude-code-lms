"use client"

import { useCallback, useRef, useState } from "react"
import {
  doc,
  writeBatch,
  Timestamp,
  collection,
  getDocs,
} from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
import {
  seedClasses,
  seedClassLessons,
  seedGroups,
  seedGroupLessons,
  seedLessons,
  seedQuizzes,
  seedQuestions,
  seedAnswers,
  seedSchools,
  seedLevels,
  seedRoles,
  seedUsers,
  seedStudentUsers,
  seedQuizQuestions,
} from "../seed-data"

/** All users to seed — fixed staff/admin + auto-generated students from groups */
const seedAllUsers = [...seedUsers, ...seedStudentUsers]

type Status = "idle" | "running" | "done" | "error"

interface TaskLog {
  label: string
  count: number
  status: Status
  error?: string
}

export function SeedPage() {
  const [logs, setLogs] = useState<TaskLog[]>([])
  const [overall, setOverall] = useState<Status>("idle")
  const runningRef = useRef(false)

  const updateLog = useCallback((label: string, patch: Partial<TaskLog>) => {
    setLogs((prev) => {
      const idx = prev.findIndex((l) => l.label === label)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], ...patch }
        return next
      }
      return [...prev, { label, count: 0, status: "idle", ...patch }]
    })
  }, [])

  const seedCollection = useCallback(
    async (
      collectionName: string,
      data: { id: string }[],
      label: string
    ) => {
      updateLog(label, { status: "running", count: 0 })

      const batchSize = 500
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = writeBatch(db)
        const slice = data.slice(i, i + batchSize)
        for (const item of slice) {
          const { id, ...rest } = item
          batch.set(doc(db, collectionName, id), rest as Record<string, unknown>)
        }
        await batch.commit()
        updateLog(label, { count: Math.min(i + batchSize, data.length) })
      }

      updateLog(label, { status: "done", count: data.length })
    },
    [updateLog]
  )

  const clearCollection = useCallback(
    async (collectionName: string) => {
      const snapshot = await getDocs(collection(db, collectionName))
      if (snapshot.empty) return 0
      let deleted = 0
      const batchSize = 500
      const docs = snapshot.docs
      for (let i = 0; i < docs.length; i += batchSize) {
        const batch = writeBatch(db)
        for (const d of docs.slice(i, i + batchSize)) {
          batch.delete(d.ref)
        }
        await batch.commit()
        deleted += Math.min(batchSize, docs.length - i)
      }
      return deleted
    },
    []
  )

  const handleSeedAll = useCallback(async (clearFirst: boolean) => {
    if (runningRef.current) return
    runningRef.current = true
    setLogs([])
    setOverall("running")

    try {
      // List of all collections in seed order
      const collections = [
        "schools", "levels", "roles", "users",
        "lessons", "quizzes", "questions", "quizQuestions",
        "classes", "classLessons", "groups", "groupLessons", "answers",
      ]

      // Clear all collections first if requested
      if (clearFirst) {
        for (const name of collections) {
          await clearCollection(name)
          updateLog(name, { status: "idle", count: 0 })
        }
      }

      // 0. Schools
      await seedCollection("schools", seedSchools, "schools")

      // 1. Levels
      await seedCollection("levels", seedLevels, "levels")

      // 2. Roles
      await seedCollection("roles", seedRoles, "roles")

      // 3. Users
      await seedCollection("users", seedAllUsers, "users")

      // 4. Lessons
      await seedCollection("lessons", seedLessons, "lessons")

      // 5. Quizzes
      await seedCollection("quizzes", seedQuizzes, "quizzes")

      // 6. Questions
      await seedCollection("questions", seedQuestions, "questions")

      // 7. QuizQuestions
      await seedCollection("quizQuestions", seedQuizQuestions, "quizQuestions")

      // 8. Classes
      await seedCollection("classes", seedClasses, "classes")

      // 9. Class Lessons
      await seedCollection("classLessons", seedClassLessons, "classLessons")

      // 10. Groups
      await seedCollection("groups", seedGroups, "groups")

      // 11. Group Lessons
      await seedCollection("groupLessons", seedGroupLessons, "groupLessons")

      // 12. Answers (add Timestamp)
      const answersForFirestore = seedAnswers.map((a) => ({
        ...a,
        answeredAt: Timestamp.fromDate(a.answeredAt),
      }))
      await seedCollection("answers", answersForFirestore, "answers")

      setOverall("done")
    } catch (err) {
      setOverall("error")
      updateLog("Lỗi chung", {
        status: "error",
        count: 0,
        error: err instanceof Error ? err.message : String(err),
      })
    } finally {
      runningRef.current = false
    }
  }, [seedCollection, updateLog])

  const handleSeedCollection = useCallback(
    async (name: string, data: { id: string }[], label: string) => {
      if (runningRef.current) return
      runningRef.current = true
      setOverall("running")
      try {
        await seedCollection(name, data, label)
        setOverall("done")
      } catch (err) {
        setOverall("error")
        updateLog(label, {
          status: "error",
          error: err instanceof Error ? err.message : String(err),
        })
      } finally {
        runningRef.current = false
      }
    },
    [seedCollection, updateLog]
  )

  const answerWithTimestamp = seedAnswers.map((a) => ({
    ...a,
    answeredAt: Timestamp.fromDate(a.answeredAt),
  }))

  const tasks = [
    { label: "schools", count: seedSchools.length, collection: "schools", data: seedSchools },
    { label: "levels", count: seedLevels.length, collection: "levels", data: seedLevels },
    { label: "roles", count: seedRoles.length, collection: "roles", data: seedRoles },
    { label: "users", count: seedAllUsers.length, collection: "users", data: seedAllUsers },
    { label: "lessons", count: seedLessons.length, collection: "lessons", data: seedLessons },
    { label: "quizzes", count: seedQuizzes.length, collection: "quizzes", data: seedQuizzes },
    { label: "questions", count: seedQuestions.length, collection: "questions", data: seedQuestions },
    { label: "quizQuestions", count: seedQuizQuestions.length, collection: "quizQuestions", data: seedQuizQuestions },
    { label: "classes", count: seedClasses.length, collection: "classes", data: seedClasses },
    { label: "classLessons", count: seedClassLessons.length, collection: "classLessons", data: seedClassLessons },
    { label: "groups", count: seedGroups.length, collection: "groups", data: seedGroups },
    { label: "groupLessons", count: seedGroupLessons.length, collection: "groupLessons", data: seedGroupLessons },
    { label: "answers", count: seedAnswers.length, collection: "answers", data: answerWithTimestamp },
  ]

  return (
    <div className="seed-page">
      <header className="seed-header">
        <h1>🔥 Seed Firestore</h1>
        <p>Push mock data into Firestore collections. Dùng Firebase Client SDK.</p>
      </header>

      <div className="seed-actions">
        <button
          type="button"
          className="seed-btn seed-btn-danger"
          onClick={() => handleSeedAll(true)}
          disabled={overall === "running"}
        >
          {overall === "running" ? "⏳ Đang xử lý..." : "🗑 Xóa sạch + Seed lại"}
        </button>
        <button
          type="button"
          className="seed-btn seed-btn-primary"
          onClick={() => handleSeedAll(false)}
          disabled={overall === "running"}
        >
          {overall === "running" ? "⏳ Đang seed..." : "🚀 Seed tất cả"}
        </button>
      </div>

      <div className="seed-cards">
        {tasks.map((t) => {
          const log = logs.find((l) => l.label === t.label)
          return (
            <div
              key={t.label}
              className={`seed-card ${log?.status === "done" ? "done" : ""} ${log?.status === "error" ? "error" : ""}`}
            >
              <div className="seed-card-head">
                <h3>{t.label}</h3>
                <span className="seed-badge">{t.count}</span>
              </div>
              <div className="seed-card-body">
                {log ? (
                  <div className={`seed-status ${log.status}`}>
                    {log.status === "running" && `Đang ghi ${log.count}/${t.count}...`}
                    {log.status === "done" && `✅ ${log.count} docs`}
                    {log.status === "error" && `❌ ${log.error}`}
                  </div>
                ) : (
                  <div className="seed-status idle">Chờ seed</div>
                )}
              </div>
              <button
                type="button"
                className="seed-btn seed-btn-sm"
                onClick={() =>
                  handleSeedCollection(t.collection, t.data as { id: string }[], t.label)
                }
                disabled={overall === "running"}
              >
                Seed riêng
              </button>
            </div>
          )
        })}
      </div>

      <div className="seed-info">
        <h3>Cấu trúc Firestore</h3>
        <pre>{`schools       — ${seedSchools.length} doc  (id: "school_1")\nlevels        — ${seedLevels.length} docs  (id: "level_1" → "level_5")\nroles         — ${seedRoles.length} docs  (id: "role_student", "role_elementary_teacher", ...)\nusers         — ${seedAllUsers.length} docs  (staff + auto-gen students)\nlessons       — ${seedLessons.length} docs  (id: "lesson_1" → "lesson_8")\nquizzes       — ${seedQuizzes.length} docs  (id: "quiz_lesson_1_1", ...)\nquestions     — ${seedQuestions.length} docs  (10 per lesson × 8 lessons)\nquizQuestions — ${seedQuizQuestions.length} docs  (bridge: quiz → question)\nclasses       — ${seedClasses.length} docs  (id: "class_1_1", "class_3_2", ...)\nclassLessons  — ${seedClassLessons.length} docs  (${seedClasses.length} classes × ${seedLessons.length} lessons)\ngroups        — ${seedGroups.length} docs   (20 per class)\ngroupLessons  — ${seedGroupLessons.length} docs  (${seedGroups.length} groups × ${seedLessons.length} lessons)\nanswers       — ${seedAnswers.length} docs   (sample leaderboard)`}</pre>
      </div>
    </div>
  )
}
