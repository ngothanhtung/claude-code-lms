import {
  collection,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
import { allGroups } from "@/features/elementary/groups/mock"

/* ───────────────────────────────────────────────────
   Mock question data — Elementary English Quiz
   ─────────────────────────────────────────────────── */

const MOCK_QUESTIONS = [
  {
    content: "What does 'Hello' mean in Vietnamese?",
    type: "quiz",
    options: [
      { content: "Tạm biệt", isCorrect: false },
      { content: "Xin chào", isCorrect: true },
      { content: "Cảm ơn", isCorrect: false },
      { content: "Xin lỗi", isCorrect: false },
    ],
  },
  {
    content: "Which one is a color?",
    type: "quiz",
    options: [
      { content: "Apple", isCorrect: false },
      { content: "Blue", isCorrect: true },
      { content: "Run", isCorrect: false },
      { content: "Happy", isCorrect: false },
    ],
  },
  {
    content: "Choose the correct word: 'I ___ a cat.'",
    type: "quiz",
    options: [
      { content: "has", isCorrect: false },
      { content: "am", isCorrect: false },
      { content: "have", isCorrect: true },
      { content: "is", isCorrect: false },
    ],
  },
  {
    content: "What is the opposite of 'big'?",
    type: "quiz",
    options: [
      { content: "Tall", isCorrect: false },
      { content: "Small", isCorrect: true },
      { content: "Fast", isCorrect: false },
      { content: "Hot", isCorrect: false },
    ],
  },
  {
    content: "How do you say 'con chó' in English?",
    type: "quiz",
    options: [
      { content: "Cat", isCorrect: false },
      { content: "Bird", isCorrect: false },
      { content: "Dog", isCorrect: true },
      { content: "Fish", isCorrect: false },
    ],
  },
  {
    content: "Which word means 'một' in English?",
    type: "quiz",
    options: [
      { content: "Three", isCorrect: false },
      { content: "Two", isCorrect: false },
      { content: "One", isCorrect: true },
      { content: "Four", isCorrect: false },
    ],
  },
  {
    content: "Choose the correct word: 'She ___ happy.'",
    type: "quiz",
    options: [
      { content: "are", isCorrect: false },
      { content: "is", isCorrect: true },
      { content: "am", isCorrect: false },
      { content: "be", isCorrect: false },
    ],
  },
  {
    content: "What does 'Thank you' mean in Vietnamese?",
    type: "quiz",
    options: [
      { content: "Xin lỗi", isCorrect: false },
      { content: "Không sao", isCorrect: false },
      { content: "Cảm ơn", isCorrect: true },
      { content: "Chào mừng", isCorrect: false },
    ],
  },
  {
    content: "Which one is a fruit?",
    type: "quiz",
    options: [
      { content: "Car", isCorrect: false },
      { content: "Banana", isCorrect: true },
      { content: "Chair", isCorrect: false },
      { content: "Book", isCorrect: false },
    ],
  },
  {
    content: "What is the plural of 'box'?",
    type: "quiz",
    options: [
      { content: "Boxs", isCorrect: false },
      { content: "Boxies", isCorrect: false },
      { content: "Boxes", isCorrect: true },
      { content: "Box", isCorrect: false },
    ],
  },
]

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

  const currentGroup = excludeGroupId
    ? allGroups.find((group) => group.id === excludeGroupId)
    : undefined
  const groups = allGroups
    .filter((group) => {
      if (group.id === excludeGroupId) {
        return false
      }

      return currentGroup ? group.classId === currentGroup.classId : true
    })
    .map((group) => group.id)
    .slice(0, 8)

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
        selectedIndex =
          wrongIndices[Math.floor(Math.random() * wrongIndices.length)]
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

/**
 * Clear ALL questions and answers — for full re-seed.
 * Call seedQuestions() + generateMockAnswers() after this.
 */
export async function clearAllQuizData(): Promise<void> {
  const [questionsSnap, answersSnap] = await Promise.all([
    getDocs(collection(db, "questions")),
    getDocs(collection(db, "answers")),
  ])

  const batch = writeBatch(db)
  for (const d of questionsSnap.docs) batch.delete(d.ref)
  for (const d of answersSnap.docs) batch.delete(d.ref)

  await batch.commit()
}
