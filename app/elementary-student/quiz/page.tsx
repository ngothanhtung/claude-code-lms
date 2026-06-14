import { QuizPage } from "@/features/elementary/quiz/components/quiz-page"

export default async function QuizRoute({
  searchParams,
}: {
  searchParams: Promise<{ group?: string; class?: string }>
}) {
  const params = await searchParams
  return <QuizPage groupId={params.group} classId={params.class} />
}
