'use server'

import type { Role } from '@saas/auth'
import { revalidateTag } from 'next/cache'

import { removeMember } from '@/http/remove-member'
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
