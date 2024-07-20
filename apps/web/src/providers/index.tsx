'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

import { queryClient } from '@/lib/react-query'

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider enableSystem disableTransitionOnChange attribute="class">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
