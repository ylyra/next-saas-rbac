import { XOctagon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { revokeInviteAction } from './actions'

type Props = {
  inviteId: string
  org: string
}

export function RevokeInviteButton({ inviteId, org }: Props) {
  return (
    <form
      action={revokeInviteAction.bind(null, {
        inviteId,
        org,
      })}
    >
      <Button size="sm" variant="destructive" type="submit">
        <XOctagon className="mr-2 size-4" />
        Revoke invite
      </Button>
    </form>
  )
}
