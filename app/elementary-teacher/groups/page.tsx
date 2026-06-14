import { GroupsPage } from "@/features/elementary/groups/components/groups-page"

export default async function GroupsRoute({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>
}) {
  const params = await searchParams
  return <GroupsPage classId={params.class} />
}
