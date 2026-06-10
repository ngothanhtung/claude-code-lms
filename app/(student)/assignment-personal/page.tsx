import { PageHeader } from "@/components/page-header"
import { AssignmentStats } from "@/features/assignment-personal/components/assignment-stats"
import { AssignmentList } from "@/features/assignment-personal/components/assignment-list"

export default function AssignmentPersonalPage() {
  return (
    <div className="col-main col-span-full">
      <PageHeader
        title="Bài tập cá nhân"
        subtitle="Quản lý bài tập cá nhân theo từng môn học"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Bài tập cá nhân" },
        ]}
      />

      <div className="mb-6">
        <AssignmentStats />
      </div>

      <AssignmentList />
    </div>
  )
}
