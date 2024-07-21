import type { Role } from '@saas/auth'

import { api } from './api-client'

interface GetMembersResponse {
  members: {
    userId: string
    id: string
    role: Role
    email: string
    name: string | null
    avatarUrl: string | null
  }[]
}

export async function getMembers(org: string): Promise<GetMembersResponse> {
  const result = await api
    .get(`organizations/${org}/members`, {
      next: {
        tags: [`${org}/members`],
      },
    })
    .json<GetMembersResponse>()

  return result
}
