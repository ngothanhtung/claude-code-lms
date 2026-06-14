"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface UseQuizTimerReturn {
  timeRemaining: number
  isWarning: boolean
  isRunning: boolean
  start: () => void
  stop: () => void
  reset: (seconds: number) => void
}

export function useQuizTimer(
  initialSeconds: number,
  onTimeUp: () => void
): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTimeUpRef = useRef(onTimeUp)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const reset = useCallback(
    (seconds: number) => {
      stop()
      setTimeRemaining(seconds)
    },
    [stop]
  )

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          stop()
          onTimeUpRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, stop])

  return {
    timeRemaining,
    isWarning: timeRemaining <= 60 && timeRemaining > 0,
    isRunning,
    start,
    stop,
    reset,
  }
}
