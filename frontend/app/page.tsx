import { dataService } from "@/lib/data-service"
import { ClientHome } from "@/components/client-home"

export default async function Home() {
  const organizations = await dataService.getOrganizations()

  return <ClientHome initialOrganizations={organizations} />
}

