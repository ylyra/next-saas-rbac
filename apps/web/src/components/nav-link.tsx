'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'

type NavLinkProps = ComponentProps<typeof Link>

export function NavLink(args: NavLinkProps) {
  const pathname = usePathname()
  const isCurrent = pathname === args.href.toString()

  return <Link {...args} data-current={isCurrent} />
}
