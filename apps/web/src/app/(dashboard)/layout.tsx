import { redirect } from 'next/navigation'
import type { PropsWithChildren } from 'react'

import { isAuthenticated } from '@/auth/auth'

export default function Layout({ children }: PropsWithChildren) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return <>{children}</>
}
