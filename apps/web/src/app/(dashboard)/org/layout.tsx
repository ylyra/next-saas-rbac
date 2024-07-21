import type { PropsWithChildren, ReactNode } from 'react'

import { Header } from '@/components/header'
import { Tabs } from '@/components/tabs'

type Props = {
  sheet: ReactNode
}

export default function Layout({ children }: PropsWithChildren<Props>) {
  return (
    <div>
      <div className="pt-6">
        <Header />

        <Tabs />
      </div>

      <main className="container py-4">{children}</main>
    </div>
  )
}
