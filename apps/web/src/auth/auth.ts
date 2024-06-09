import { defineAbilitiesFor } from '@saas/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'

export function isAuthenticated() {
  const cookieStore = cookies()

  return cookieStore.has('@saas:token')
}

export function getCurrentOrg() {
  const cookieStore = cookies()
  return cookieStore.get('@saas:org')?.value || null
}

export async function getCurrentMembership() {
  const currentOrg = getCurrentOrg()

  if (!currentOrg) {
    return null
  }

  const { membership } = await getMembership(currentOrg)

  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  const ability = defineAbilitiesFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}

export async function auth() {
  try {
    const { user } = await getProfile()

    return user
  } catch (error) {
    console.log(error)
  }

  redirect('/auth/sign-out')
}
