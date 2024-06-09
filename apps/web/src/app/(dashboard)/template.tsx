import { redirect } from 'next/navigation'
import type { PropsWithChildren } from 'react'

import { isAuthenticated } from '@/auth/auth'
import { Header } from '@/components/header'

export default function Template({ children }: PropsWithChildren) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="space-y-4 py-4">
      <Header />

      <main className="container">{children}</main>
    </div>
  )
}
