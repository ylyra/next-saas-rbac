'use server'

import type { Role } from '@saas/auth'
import { revalidateTag } from 'next/cache'

import { removeMember } from '@/http/remove-member'
import { revokeInvite } from '@/http/revoke-invite'
import { updateMember } from '@/http/update-member'

export async function removeMemberAction({
  memberId,
  org,
}: {
  org: string
  memberId: string
}) {
  await removeMember({
    org,
    memberId,
  })

  revalidateTag(`${org}/members`)
}

export async function updateMemberAction({
  memberId,
  role,
  org,
}: {
  org: string
  memberId: string
  role: Role
}) {
  await updateMember({
    org,
    memberId,
    role,
  })

  revalidateTag(`${org}/members`)
}

export async function revokeInviteAction({
  inviteId,
  org,
}: {
  inviteId: string
  org: string
}) {
  await revokeInvite({
    org,
    inviteId,
  })

  revalidateTag(`${org}/invites`)
}
