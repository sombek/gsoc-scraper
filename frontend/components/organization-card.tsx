import Link from "next/link"
import Image from "next/image"
import type { Organization } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OrganizationCardProps {
  organization: Organization
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link href={`/organizations/${organization.id}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-md">
              <Image
                src={organization.logo || "/placeholder.svg"}
                alt={`${organization.name} logo`}
                fill
                className="object-contain"
              />
            </div>
            <CardTitle className="line-clamp-1">{organization.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <CardDescription className="line-clamp-2">{organization.description}</CardDescription>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-1">
            {organization.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {organization.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{organization.technologies.length - 3}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

