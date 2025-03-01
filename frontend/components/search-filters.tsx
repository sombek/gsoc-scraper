"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, Heart } from "lucide-react"
import { getAllTechnologies, getAllTopics, getAllDifficulties } from "@/lib/utils"
import type { Organization } from "@/lib/types"

interface SearchFiltersProps {
  organizations: Organization[]
  onFilterChange: (filters: {
    search: string
    technologies: string[]
    topics: string[]
    difficulties: string[]
    showFavorites: boolean
  }) => void
}

export function SearchFilters({ organizations, onFilterChange }: SearchFiltersProps) {
  const [search, setSearch] = useState("")
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [showFavorites, setShowFavorites] = useState(false)

  const allTechnologies = getAllTechnologies(organizations)
  const allTopics = getAllTopics(organizations)
  const allDifficulties = getAllDifficulties(organizations)

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search organizations and projects..."
          className="pl-8"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            onFilterChange({
              search: e.target.value,
              technologies: selectedTechnologies,
              topics: selectedTopics,
              difficulties: selectedDifficulties,
              showFavorites,
            })
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="mr-2 h-4 w-4" />
              Technologies
              {selectedTechnologies.length > 0 && ` (${selectedTechnologies.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
            {allTechnologies.map((tech) => (
              <DropdownMenuCheckboxItem
                key={tech}
                checked={selectedTechnologies.includes(tech)}
                onCheckedChange={(checked) => {
                  const newTechnologies = checked
                    ? [...selectedTechnologies, tech]
                    : selectedTechnologies.filter((t) => t !== tech)

                  setSelectedTechnologies(newTechnologies)
                  onFilterChange({
                    search,
                    technologies: newTechnologies,
                    topics: selectedTopics,
                    difficulties: selectedDifficulties,
                    showFavorites,
                  })
                }}
              >
                {tech}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="mr-2 h-4 w-4" />
              Topics
              {selectedTopics.length > 0 && ` (${selectedTopics.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
            {allTopics.map((topic) => (
              <DropdownMenuCheckboxItem
                key={topic}
                checked={selectedTopics.includes(topic)}
                onCheckedChange={(checked) => {
                  const newTopics = checked ? [...selectedTopics, topic] : selectedTopics.filter((t) => t !== topic)

                  setSelectedTopics(newTopics)
                  onFilterChange({
                    search,
                    technologies: selectedTechnologies,
                    topics: newTopics,
                    difficulties: selectedDifficulties,
                    showFavorites,
                  })
                }}
              >
                {topic}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="mr-2 h-4 w-4" />
              Difficulty
              {selectedDifficulties.length > 0 && ` (${selectedDifficulties.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {allDifficulties.map((difficulty) => (
              <DropdownMenuCheckboxItem
                key={difficulty}
                checked={selectedDifficulties.includes(difficulty)}
                onCheckedChange={(checked) => {
                  const newDifficulties = checked
                    ? [...selectedDifficulties, difficulty]
                    : selectedDifficulties.filter((d) => d !== difficulty)

                  setSelectedDifficulties(newDifficulties)
                  onFilterChange({
                    search,
                    technologies: selectedTechnologies,
                    topics: selectedTopics,
                    difficulties: newDifficulties,
                    showFavorites,
                  })
                }}
              >
                {difficulty}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={showFavorites ? "default" : "outline"}
          size="sm"
          className="h-8"
          onClick={() => {
            const newShowFavorites = !showFavorites
            setShowFavorites(newShowFavorites)
            onFilterChange({
              search,
              technologies: selectedTechnologies,
              topics: selectedTopics,
              difficulties: selectedDifficulties,
              showFavorites: newShowFavorites,
            })
          }}
        >
          <Heart className={`mr-2 h-4 w-4 ${showFavorites ? "fill-primary-foreground" : ""}`} />
          Show Favorites
        </Button>
      </div>
    </div>
  )
}

