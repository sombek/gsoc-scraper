"use client";

import type React from "react";

import type { OrganizationProject } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/hooks";

interface ProjectCardProps {
  project: OrganizationProject;
  organizationId: string;
  showOrganizationName?: boolean;
  organizationName?: string;
}

export function ProjectCard({
  project,
  organizationId,
  showOrganizationName = false,
  organizationName = "",
}: ProjectCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(project.id + "-" + organizationId);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(project.id, organizationId);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1">
              {project.project_name}
            </CardTitle>
            {showOrganizationName && organizationName && (
              <CardDescription className="line-clamp-1">
                <a
                  href={`/organizations/${organizationId}`}
                  target="_blank"
                  className="text-blue-600"
                >
                  {organizationName}
                </a>
              </CardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleFavoriteClick}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-5 w-5 ${
                isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <CardDescription className="">{project.summary}</CardDescription>
      </CardContent>
      <CardFooter>
        <Badge
          variant={
            project.difficulty === "Easy"
              ? "success"
              : project.difficulty === "Medium"
              ? "warning"
              : "destructive"
          }
          className="text-xs"
        >
          {project.difficulty}
        </Badge>
      </CardFooter>
    </Card>
  );
}
