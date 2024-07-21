import { redirect } from 'next/navigation'

import { ability } from '@/auth/auth'

type Props = {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const permissions = await ability()

  if (permissions?.cannot('get', 'Project')) {
    redirect(`/org/${params.slug}`)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
    </div>
  )
}
