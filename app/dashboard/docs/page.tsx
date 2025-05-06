import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ApiDocumentation } from "@/components/api-documentation"

export default function DocsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="API Documentation" text="Test and explore available API endpoints." />
      <ApiDocumentation />
    </DashboardShell>
  )
}
