import { redirect } from 'next/navigation'

import { ability } from '@/auth/auth'

type Props = {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const permissions = await ability()

  if (
    permissions?.cannot('get', 'Project') &&
    permissions?.can('get', 'Billing')
  ) {
    redirect(`/org/${params.slug}/settings`)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Projects</h1>
    </div>
  )
}
