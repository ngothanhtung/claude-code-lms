import { AppSidebar } from "@/components/app-sidebar"
import { AppTopbar } from "@/components/app-topbar"

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="app">
      <AppSidebar />
      <div className="main">
        <AppTopbar />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
