import { StudentClassesPage } from "@/features/elementary/classes/components/student-classes-page"

export async function generateStaticParams() {
  const ids = [
    "1-1", "1-2", "1-3",
    "2-1", "2-2", "2-3",
    "3-1", "3-2", "3-3",
    "4-1", "4-2",
    "5-1", "5-2", "5-3",
  ]
  return ids.map((id) => ({ id }))
}

export default async function ClassesRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StudentClassesPage classId={id} />
}
