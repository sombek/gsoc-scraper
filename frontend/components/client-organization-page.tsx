"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import type { Organization } from "@/lib/types";

interface ClientOrganizationPageProps {
  organization: Organization | undefined;
}

export function ClientOrganizationPage({
  organization,
}: ClientOrganizationPageProps) {
  if (!organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="mb-6 flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Organizations
        </Link>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h1 className="mb-4 text-3xl font-bold">Organization Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            The organization you are looking for does not exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="mb-6 flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Organizations
      </Link>

      <div className="mb-8 flex flex-col items-start gap-6 md:flex-row">
        <div className="relative h-24 w-24 overflow-hidden rounded-lg md:h-32 md:w-32">
          <Image
            src={organization.logo || "/placeholder.svg"}
            alt={`${organization.name} logo`}
            fill
            className="object-contain"
          />
        </div>

        <div className="flex-1">
          <h1 className="mb-2 text-3xl font-bold">{organization.name}</h1>
          <p className="mb-4 text-muted-foreground">
            {organization.description}
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {organization.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {organization.topics.map((topic) => (
              <Badge key={topic} variant="outline">
                {topic}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild variant="outline" size="sm">
              <a
                href={organization.gsoc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                GSoC Page
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>

            <Button asChild variant="outline" size="sm">
              <a
                href={organization.ideas_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                Project Ideas
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-bold">Projects</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organization.projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            organizationId={organization.id}
            // gsocUrl={organization.gsoc_url}
            // ideasUrl={organization.ideas_url}
          />
        ))}
      </div>
    </div>
  );
}
