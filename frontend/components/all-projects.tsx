"use client"

import { useState, useEffect } from "react"
import type { Organization, OrganizationProject } from "@/lib/types"
import { ProjectCard } from "./project-card"
import { VirtualGrid } from "./virtual-grid"
import { useFavorites } from "@/lib/hooks"

interface AllProjectsProps {
  organizations: Organization[]
  filters: {
    search: string
    technologies: string[]
    topics: string[]
    difficulties: string[]
    showFavorites: boolean
  }
}

interface ProjectWithOrg extends OrganizationProject {
  organizationId: string
  organizationName: string
}

export function AllProjects({ organizations, filters }: AllProjectsProps) {
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithOrg[]>([])
  const { favorites } = useFavorites()

  useEffect(() => {
    // Extract all projects from organizations
    let projects: ProjectWithOrg[] = []

    organizations.forEach((org) => {
      const orgProjects = org.projects.map((project) => ({
        ...project,
        organizationId: org.id,
        organizationName: org.name,
      }))

      projects = [...projects, ...orgProjects]
    })

    // Apply filters
    let filtered = projects

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.project_name.toLowerCase().includes(searchLower) ||
          project.summary.toLowerCase().includes(searchLower) ||
          project.organizationName.toLowerCase().includes(searchLower),
      )
    }

    // Filter by technologies
    if (filters.technologies.length > 0) {
      filtered = filtered.filter((project) => {
        const org = organizations.find((o) => o.id === project.organizationId)
        if (!org) return false

        return filters.technologies.some((tech) => org.technologies.includes(tech))
      })
    }

    // Filter by topics
    if (filters.topics.length > 0) {
      filtered = filtered.filter((project) => {
        const org = organizations.find((o) => o.id === project.organizationId)
        if (!org) return false

        return filters.topics.some((topic) => org.topics.includes(topic))
      })
    }

    // Filter by difficulties
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter((project) => filters.difficulties.includes(project.difficulty))
    }

    // Filter by favorites
    if (filters.showFavorites) {
      filtered = filtered.filter((project) => favorites.includes(project.id))
    }

    setFilteredProjects(filtered)
  }, [organizations, filters, favorites])

  return (
    <div className="h-[600px] w-full">
      <VirtualGrid
        items={filteredProjects}
        renderItem={(project) => (
          <ProjectCard
            project={project}
            organizationId={project.organizationId}
            showOrganizationName={true}
            organizationName={project.organizationName}
          />
        )}
        columnCount={3}
      />
    </div>
  )
}

