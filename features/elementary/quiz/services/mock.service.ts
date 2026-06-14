import {
  collection,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"

/* ───────────────────────────────────────────────────
   Mock question data — Vietnamese elementary school
   ─────────────────────────────────────────────────── */

const MOCK_QUESTIONS = [
  {
    content: "Từ nào sau đây là từ đồng nghĩa với 'vui'?",
    type: "quiz",
    options: [
      { content: "Buồn", isCorrect: false },
      { content: "Hạnh phúc", isCorrect: true },
      { content: "Mệt mỏi", isCorrect: false },
      { content: "Tức giận", isCorrect: false },
    ],
  },
  {
    content: "Hình nào sau đây là hình tròn?",
    type: "quiz",
    options: [
      { content: "Hình vuông", isCorrect: false },
      { content: "Hình tam giác", isCorrect: false },
      { content: "Hình tròn", isCorrect: true },
      { content: "Hình chữ nhật", isCorrect: false },
    ],
  },
  {
    content: "Con vật nào sau đây biết bay?",
    type: "quiz",
    options: [
      { content: "Con chó", isCorrect: false },
      { content: "Con mèo", isCorrect: false },
      { content: "Con chim", isCorrect: true },
      { content: "Con cá", isCorrect: false },
    ],
  },
  {
    content: "1 + 1 = ?",
    type: "quiz",
    options: [
      { content: "1", isCorrect: false },
      { content: "2", isCorrect: true },
      { content: "3", isCorrect: false },
      { content: "4", isCorrect: false },
    ],
  },
  {
    content: "Màu của bầu trời là gì?",
    type: "quiz",
    options: [
      { content: "Xanh lá", isCorrect: false },
      { content: "Đỏ", isCorrect: false },
      { content: "Vàng", isCorrect: false },
      { content: "Xanh dương", isCorrect: true },
    ],
  },
  {
    content: "Nước nào có hình dáng giống chữ S?",
    type: "quiz",
    options: [
      { content: "Trung Quốc", isCorrect: false },
      { content: "Việt Nam", isCorrect: true },
      { content: "Nhật Bản", isCorrect: false },
      { content: "Hàn Quốc", isCorrect: false },
    ],
  },
  {
    content: "Mùa nào có tuyết rơi ở miền Bắc?",
    type: "quiz",
    options: [
      { content: "Mùa xuân", isCorrect: false },
      { content: "Mùa hạ", isCorrect: false },
      { content: "Mùa đông", isCorrect: true },
      { content: "Mùa thu", isCorrect: false },
    ],
  },
  {
    content: "Từ trái nghĩa với 'nóng' là gì?",
    type: "quiz",
    options: [
      { content: "Lạnh", isCorrect: true },
      { content: "Nắng", isCorrect: false },
      { content: "Khô", isCorrect: false },
      { content: "Ẩm", isCorrect: false },
    ],
  },
  {
    content: "Cái nào dùng để viết trên bảng?",
    type: "quiz",
    options: [
      { content: "Giấy", isCorrect: false },
      { content: "Bút chì", isCorrect: false },
      { content: "Phấn", isCorrect: true },
      { content: "Cọ vẽ", isCorrect: false },
    ],
  },
  {
    content: "3 + 4 = ?",
    type: "quiz",
    options: [
      { content: "5", isCorrect: false },
      { content: "6", isCorrect: false },
      { content: "7", isCorrect: true },
      { content: "8", isCorrect: false },
    ],
  },
]

const MOCK_GROUPS = ["g-1-1-01", "g-1-1-02", "g-1-1-03", "g-1-1-04"]

/* ───────────────────────────────────────────────────
   Seed questions into Firestore `questions` collection
   ─────────────────────────────────────────────────── */

/**
 * Writes all mock questions to the `questions` collection in Firestore.
 * Skips if questions already exist.
 * Returns the number of documents written.
 */
export async function seedQuestions(): Promise<number> {
  const existing = await getDocs(collection(db, "questions"))
  if (!existing.empty) {
    return 0 // already seeded
  }

  const batch = writeBatch(db)

  for (const question of MOCK_QUESTIONS) {
    const ref = doc(collection(db, "questions"))
    batch.set(ref, {
      ...question,
      createdAt: serverTimestamp(),
    })
  }

  await batch.commit()
  return MOCK_QUESTIONS.length
}

/* ───────────────────────────────────────────────────
   Generate mock answers for leaderboard simulation
   ─────────────────────────────────────────────────── */

/**
 * Generates mock answers for other groups in a quiz session.
 * Skips `excludeGroupId` so the current group's answers are never fabricated.
 * Each group answers all 10 questions with randomized correct/wrong mix.
 * Writes to the `answers` collection in Firestore.
 *
 * @param quizId - The quiz identifier to tag answers with
 * @param options.correctRate - Percentage of questions answered correctly per group (0–1)
 * @param options.excludeGroupId - Group ID to skip (the one currently playing)
 */
export async function generateMockAnswers(
  quizId: string,
  options?: { correctRate?: number; excludeGroupId?: string }
): Promise<number> {
  const correctRate = options?.correctRate ?? 0.7
  const excludeGroupId = options?.excludeGroupId

  // Load actual questions from Firestore to reference their IDs
  const snapshot = await getDocs(collection(db, "questions"))
  if (snapshot.empty) return 0

  const questions = snapshot.docs.map((d) => ({
    id: d.id,
    options: d.data().options as { content: string; isCorrect: boolean }[],
  }))

  const batch = writeBatch(db)
  let count = 0
  const now = Date.now()

  const groups = MOCK_GROUPS.filter((g) => g !== excludeGroupId)

  for (const [groupIdx, groupId] of groups.entries()) {
    // Each group starts slightly offset for time tiebreak
    const groupOffset = groupIdx * 15_000

    for (const question of questions) {
      const isCorrect = Math.random() < correctRate

      let selectedIndex: number
      if (isCorrect) {
        // Pick the correct option
        selectedIndex = question.options.findIndex((o) => o.isCorrect)
      } else {
        // Pick a random wrong option
        const wrongIndices = question.options
          .map((o, i) => ({ ...o, idx: i }))
          .filter((o) => !o.isCorrect)
          .map((o) => o.idx)
        selectedIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)]
      }

      const ref = doc(collection(db, "answers"))
      batch.set(ref, {
        questionId: question.id,
        groupId,
        quizId,
        selectedOption: selectedIndex,
        isCorrect,
        answeredAt: new Date(now + groupOffset + count * 8_000),
        createdAt: serverTimestamp(),
      })

      count++
    }
  }

  await batch.commit()
  return count
}

/* ───────────────────────────────────────────────────
   Combined seed: questions + sample answers
   ─────────────────────────────────────────────────── */

/**
 * Full seed: writes questions (if empty) then generates mock answers.
 * Returns counts of what was written.
 */
export async function seedQuizData(
  quizId: string
): Promise<{ questions: number; answers: number }> {
  const qCount = await seedQuestions()
  const aCount = await generateMockAnswers(quizId)
  return { questions: qCount, answers: aCount }
}

/**
 * Clear all answers for a specific quiz (useful for re-testing).
 */
export async function clearQuizAnswers(quizId: string): Promise<void> {
  const q = collection(db, "answers")
  const snapshot = await getDocs(q)
  const batch = writeBatch(db)

  for (const d of snapshot.docs) {
    if (d.data().quizId === quizId) {
      batch.delete(d.ref)
    }
  }

  await batch.commit()
}
