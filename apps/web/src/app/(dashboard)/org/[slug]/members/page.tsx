import { redirect } from 'next/navigation'

import { ability } from '@/auth/auth'

import { Invites } from './invites'
import { MembersList } from './members-list'

type Props = {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const permissions = await ability()

  if (permissions?.cannot('get', 'User')) {
    redirect(`/org/${params.slug}`)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>

      <div className="space-y-4">
        {permissions?.can('get', 'Invite') && <Invites />}
        {permissions?.can('get', 'User') && <MembersList />}
      </div>
    </div>
  )
}
