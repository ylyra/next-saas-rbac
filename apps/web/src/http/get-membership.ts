import type { Role } from '@saas/auth'

import { api } from './api-client'

interface GetMembershipResponse {
  membership: {
    id: string
    role: Role
    organizationId: string
    userId: string
  } | null
}

export async function getMembership(
  org: string,
): Promise<GetMembershipResponse> {
  const result = await api
    .get(`organizations/${org}/membership`)
    .json<GetMembershipResponse>()
    .catch((error) => {
      console.error('Error getting membership', error)
      return { membership: null }
    })

  return result
}
