import { redirect } from 'next/navigation'
import type { PropsWithChildren, ReactNode } from 'react'

import { isAuthenticated } from '@/auth/auth'

type Props = {
  sheet: ReactNode
}

export default function Template({
  children,
  sheet,
}: PropsWithChildren<Props>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}
