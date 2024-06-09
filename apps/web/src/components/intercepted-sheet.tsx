'use client'

import type { DialogProps } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'

import { Sheet } from './ui/sheet'

export function InterceptedSheet({
  onOpenChange,
  defaultOpen = true,
  ...args
}: DialogProps) {
  const router = useRouter()
  return (
    <Sheet
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        if (!open) {
          router.back()
        }
        onOpenChange?.(open)
      }}
      {...args}
    />
  )
}
