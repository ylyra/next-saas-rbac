import { api } from './api-client'

interface CreateProjectRequest {
  org: string
  name: string
  description: string
}

interface CreateProjectResponse {
  projectId: string
  slug: string
}

export async function createProject({
  org,
  name,
  description,
}: CreateProjectRequest): Promise<CreateProjectResponse> {
  const result = await api
    .post(`organizations/${org}/projects`, {
      json: {
        name,
        description,
      },
    })
    .json<CreateProjectResponse>()

  return result
}
