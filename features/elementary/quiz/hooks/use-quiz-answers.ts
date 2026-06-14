"use client"

import { useEffect, useState, useCallback } from "react"
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

  useEffect(() => {
    const q = query(
      collection(db, "answers"),
      where("quizId", "==", quizId)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const answers: QuizAnswer[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          questionId: doc.data().questionId,
          groupId: doc.data().groupId,
          quizId: doc.data().quizId,
          selectedOption: doc.data().selectedOption,
          isCorrect: doc.data().isCorrect,
          answeredAt: doc.data().answeredAt,
        }))
        setAllAnswers(answers)
        setLoading(false)
      },
      (err) => {
        console.warn("Firestore subscription error, using empty answers:", err)
        setAllAnswers([])
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [quizId])

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
