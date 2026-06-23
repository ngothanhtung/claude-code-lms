import { StudentClassesPage } from "@/features/elementary/classes/components/student-classes-page"

export default async function ClassesRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StudentClassesPage classId={id} />
}
