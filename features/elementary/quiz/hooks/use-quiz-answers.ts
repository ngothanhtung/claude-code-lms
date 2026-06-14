"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"
import type { QuizAnswer } from "../types/quiz.types"
import { generateMockAnswers } from "../services/mock.service"

interface UseQuizAnswersReturn {
  allAnswers: QuizAnswer[]
  groupAnswers: QuizAnswer[]
  submitAnswer: (
    questionId: string,
    selectedIndex: number,
    isCorrect: boolean
  ) => Promise<void>
  loading: boolean
}

export function useQuizAnswers(
  quizId: string,
  groupId: string
): UseQuizAnswersReturn {
  const [allAnswers, setAllAnswers] = useState<QuizAnswer[]>([])
  const [loading, setLoading] = useState(true)
  const seededRef = useRef(false)

  useEffect(() => {
    const q = query(
      collection(db, "answers"),
      where("quizId", "==", quizId)
    )

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const answers: QuizAnswer[] = snapshot.docs.map((d) => ({
          id: d.id,
          questionId: d.data().questionId,
          groupId: d.data().groupId,
          quizId: d.data().quizId,
          selectedOption: d.data().selectedOption,
          isCorrect: d.data().isCorrect,
          answeredAt: d.data().answeredAt,
        }))
        setAllAnswers(answers)
        setLoading(false)

        // Auto-seed mock answers for OTHER groups on first load (dev only)
        if (!seededRef.current && answers.length === 0) {
          seededRef.current = true
          try {
            await generateMockAnswers(quizId, { excludeGroupId: groupId })
          } catch (err) {
            console.warn("Failed to seed mock answers:", err)
          }
        }
      },
      (err) => {
        console.error("Firestore subscription error:", err)
        setAllAnswers([])
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [quizId, groupId])

  const groupAnswers = allAnswers.filter((a) => a.groupId === groupId)

  const submitAnswer = useCallback(
    async (
      questionId: string,
      selectedIndex: number,
      isCorrect: boolean
    ): Promise<void> => {
      try {
        await addDoc(collection(db, "answers"), {
          questionId,
          groupId,
          quizId,
          selectedOption: selectedIndex,
          isCorrect,
          answeredAt: serverTimestamp(),
        })
      } catch (err) {
        console.error("Failed to submit answer:", err)
        throw err
      }
    },
    [quizId, groupId]
  )

  return { allAnswers, groupAnswers, submitAnswer, loading }
}
