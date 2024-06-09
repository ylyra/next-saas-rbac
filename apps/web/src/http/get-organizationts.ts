import { api } from './api-client'

interface GetOrganizationsResponse {
  organizations: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrganizations(): Promise<GetOrganizationsResponse> {
  const result = await api
    .get('organizations')
    .json<GetOrganizationsResponse>()
    .catch((error) => {
      console.error(error)
      return { organizations: [] }
    })

  return result
}
