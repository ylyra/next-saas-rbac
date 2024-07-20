import { api } from './api-client'

interface GetProjectsResponse {
  projects: {
    description: string
    id: string
    name: string
    slug: string
    ownerId: string
    organizationId: string
    createdAt: string
    owner: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
    avatarUrl: string | null
  }[]
}

export async function getProjects(org: string): Promise<GetProjectsResponse> {
  const result = await api
    .get(`organizations/${org}/projects`)
    .json<GetProjectsResponse>()
    .catch((error) => {
      console.error(error)
      return { projects: [] }
    })

  return result
}
