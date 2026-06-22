import { GroupsPage } from "@/features/elementary/groups/components/groups-page"

export default async function GroupsRoute({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  return <GroupsPage classId={classId} />
}
