import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (isAuthenticated()) {
    redirect('/')
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4">
      {children}
    </main>
  )
}
