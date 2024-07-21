import type { Role } from '@saas/auth'

import { api } from './api-client'

interface GetPendingInvitesResponse {
  invites: {
    organization: {
      name: string
    }
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }[]
}

export async function getPendingInvites(): Promise<GetPendingInvitesResponse> {
  const result = await api
    .get(`pending-invites`, {
      next: {
        tags: [`pending-invites`],
      },
    })
    .json<GetPendingInvitesResponse>()
    .catch((error) => {
      console.error(error)
      return { invites: [] }
    })

  return result
}
