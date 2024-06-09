import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getProfile } from '@/http/get-profile'

export function isAuthenticated() {
  const cookieStore = cookies()

  return cookieStore.has('@saas:token')
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
