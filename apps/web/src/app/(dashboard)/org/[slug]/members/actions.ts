'use server'

import { type Role, roleSchema } from '@saas/auth'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createInvite } from '@/http/create-invite'
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

const inviteSchema = z.object({
  email: z.string().email(),
  role: roleSchema,
})

export async function createInviteAction(data: FormData) {
  const result = inviteSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { email, role } = result.data
  const org = getCurrentOrg()

  try {
    if (!org) {
      throw new Error('No project found.')
    }

    const response = await createInvite({
      org,
      email,
      role,
    })

    revalidateTag(`${org}/invites`)

    return {
      success: true,
      message: 'Successfully saved project.',
      errors: null,
      data: response,
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }
  }

  return {
    success: false,
    message: 'An unexpected error occurred. Please try again later.',
    errors: null,
  }
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
