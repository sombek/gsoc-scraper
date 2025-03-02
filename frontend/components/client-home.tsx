"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationCard } from "@/components/organization-card";
import { SearchFilters } from "@/components/search-filters";
import { VirtualGrid } from "@/components/virtual-grid";
import { AllProjects } from "@/components/all-projects";
import type { Organization } from "@/lib/types";

interface ClientHomeProps {
  initialOrganizations: Organization[];
}

export function ClientHome({ initialOrganizations }: ClientHomeProps) {
  const [organizations] = useState<Organization[]>(initialOrganizations);
  const [filteredOrganizations, setFilteredOrganizations] =
    useState<Organization[]>(initialOrganizations);
  const [filters, setFilters] = useState({
    search: "",
    technologies: [] as string[],
    topics: [] as string[],
    difficulties: [] as string[],
    showFavorites: false,
  });
  const [activeTab, setActiveTab] = useState("organizations");

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);

    // Apply filters to organizations
    let filtered = organizations;

    // Filter by search term
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(searchLower) ||
          org.description.toLowerCase().includes(searchLower) ||
          org.projects.some(
            (project) =>
              project.project_name.toLowerCase().includes(searchLower) ||
              project.summary.toLowerCase().includes(searchLower)
          )
      );
    }

    // Filter by technologies
    if (newFilters.technologies.length > 0) {
      filtered = filtered.filter((org) =>
        newFilters.technologies.some((tech) => org.technologies.includes(tech))
      );
    }

    // Filter by topics
    if (newFilters.topics.length > 0) {
      filtered = filtered.filter((org) =>
        newFilters.topics.some((topic) => org.topics.includes(topic))
      );
    }

    setFilteredOrganizations(filtered);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-4xl font-bold">Google Summer Of Code 2025</h1>
      <h2 className="mb-6 text-3xl">Organizations & Projects Explorer</h2>
      <p className="mb-6 text-gray-600">
        Explore all organizations and projects participating in Google Summer of
        Code 2025. Scraped from the official GSoC website. And summarized for
        you using LLM.
      </p>
      <p className="mb-6 text-gray-600">
        For more about me visit my website{" "}
        <a
          href="https://abdullah-h.com"
          target="_blank"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Abdullah Hashim
        </a>
      </p>

      <SearchFilters
        organizations={organizations}
        onFilterChange={handleFilterChange}
      />

      <Tabs
        defaultValue="organizations"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="h-[calc(100vh-300px)]">
          <VirtualGrid
            items={filteredOrganizations}
            renderItem={(org) => <OrganizationCard organization={org} />}
            columnCount={3}
          />
        </TabsContent>

        <TabsContent value="projects" className="h-[calc(100vh-300px)]">
          <AllProjects organizations={organizations} filters={filters} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
