'use client'
import type { Role } from '@saas/auth'
import type { ComponentProps } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { updateMemberAction } from './actions'

type Props = ComponentProps<typeof Select> & {
  memberId: string
  org: string
}

export function UpdateMemberRoleSelect({ memberId, org, ...props }: Props) {
  async function updateMemberRole(role: Role) {
    await updateMemberAction({
      memberId,
      org,
      role,
    })
  }

  return (
    <Select
      {...props}
      onValueChange={(value) => updateMemberRole(value as Role)}
    >
      <SelectTrigger className="h-8 w-32">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="MEMBER">Member</SelectItem>
        <SelectItem value="BILLING">Billing</SelectItem>
      </SelectContent>
    </Select>
  )
}
