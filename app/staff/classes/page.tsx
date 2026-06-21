import { PageHeader } from "@/components/page-header"
import { allClasses, summary } from "@/features/staff/classes/mock"
import { ClassesTable } from "@/features/staff/classes/components/classes-table"

export default function StaffClassesPage() {
  return (
    <div className="col-main col-span-full">
      <PageHeader
        title="Quản lý lớp học"
        subtitle="Danh sách các lớp học dành cho người lớn"
      >
        <span className="text-sm font-semibold text-muted-foreground">
          Tổng: {summary.total}
        </span>
        <span className="text-sm font-semibold text-success">
          Hoạt động: {summary.active}
        </span>
        <span className="text-sm font-semibold text-warning">
          Tạm dừng: {summary.paused}
        </span>
      </PageHeader>
      <ClassesTable classes={allClasses} summary={summary} />
    </div>
  )
}
