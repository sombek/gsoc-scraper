import { dataService } from "@/lib/data-service"
import { ClientOrganizationPage } from "@/components/client-organization-page"

interface OrganizationPageProps {
  params: {
    name: string
  }
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const organization = await dataService.getOrganizationById(params.name)

  return <ClientOrganizationPage organization={organization} />
}

