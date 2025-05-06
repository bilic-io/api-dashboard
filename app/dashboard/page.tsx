import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ApiKeyStats } from "@/components/api-key-stats"
import { ApiKeysList } from "@/components/api-keys-list"
import { CreateApiKeyButton } from "@/components/create-api-key-button"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="API Keys" text="Create and manage your API keys.">
        <CreateApiKeyButton />
      </DashboardHeader>
      <div className="grid gap-4 md:gap-8">
        <ApiKeyStats />
        <ApiKeysList />
      </div>
    </DashboardShell>
  )
}
