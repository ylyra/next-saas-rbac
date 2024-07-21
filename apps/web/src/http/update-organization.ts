import { api } from './api-client'

interface UpdateOrganizationRequest {
  org: string
  name: string
  shouldAttachUsersByDomain: boolean
  domain?: string | null
}

interface UpdateOrganizationResponse {
  organizationId: string
  slug: string
}

export async function updateOrganization({
  org,
  name,
  shouldAttachUsersByDomain,
  domain,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
  const result = await api
    .put(`organizations/${org}`, {
      json: {
        name,
        shouldAttachUsersByDomain,
        domain,
      },
    })
    .json<UpdateOrganizationResponse>()

  return result
}
