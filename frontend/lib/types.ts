export type OrganizationProject = {
  project_name: string
  summary: string
  difficulty: string
}

export type Organization = {
  id: string
  name: string
  description: string
  gsoc_url: string
  ideas_url: string
  logo: string
  technologies: string[]
  topics: string[]
  projects: OrganizationProject[]
  jina_response?: string | null
}

