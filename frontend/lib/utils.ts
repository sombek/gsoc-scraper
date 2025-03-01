import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { OrganizationProject } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to get favorites from local storage
export const getFavorites = (): string[] => {
  if (typeof window === "undefined") return []

  const favorites = localStorage.getItem("favorites")
  return favorites ? JSON.parse(favorites) : []
}

// Function to add a project to favorites
export const addToFavorites = (projectId: string): void => {
  if (typeof window === "undefined") return

  const favorites = getFavorites()
  if (!favorites.includes(projectId)) {
    favorites.push(projectId)
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }
}

// Function to remove a project from favorites
export const removeFromFavorites = (projectId: string): void => {
  if (typeof window === "undefined") return

  const favorites = getFavorites()
  const updatedFavorites = favorites.filter((id) => id !== projectId)
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
}

// Function to check if a project is in favorites
export const isInFavorites = (projectId: string): boolean => {
  if (typeof window === "undefined") return false

  const favorites = getFavorites()
  return favorites.includes(projectId)
}

// Function to get all unique technologies from organizations
export const getAllTechnologies = (organizations: any[]): string[] => {
  const technologiesSet = new Set<string>()

  organizations.forEach((org) => {
    org.technologies.forEach((tech: string) => {
      technologiesSet.add(tech)
    })
  })

  return Array.from(technologiesSet).sort()
}

// Function to get all unique topics from organizations
export const getAllTopics = (organizations: any[]): string[] => {
  const topicsSet = new Set<string>()

  organizations.forEach((org) => {
    org.topics.forEach((topic: string) => {
      topicsSet.add(topic)
    })
  })

  return Array.from(topicsSet).sort()
}

// Function to get all unique difficulty levels from projects
export const getAllDifficulties = (organizations: any[]): string[] => {
  const difficultiesSet = new Set<string>()

  organizations.forEach((org) => {
    org.projects.forEach((project: OrganizationProject) => {
      difficultiesSet.add(project.difficulty)
    })
  })

  return Array.from(difficultiesSet).sort()
}

