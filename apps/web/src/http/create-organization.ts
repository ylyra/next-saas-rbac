import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  shouldAttachUsersByDomain: boolean
  domain?: string | null
}

interface CreateOrganizationResponse {
  organizationId: string
  slug: string
}

export async function createOrganization({
  name,
  shouldAttachUsersByDomain,
  domain,
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
  const result = await api
    .post('organizations', {
      json: {
        name,
        shouldAttachUsersByDomain,
        domain,
      },
    })
    .json<CreateOrganizationResponse>()

  return result
}
