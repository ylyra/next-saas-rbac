import { redirect } from 'next/navigation'

import { ability } from '@/auth/auth'
import ProjectForm from '@/components/project-form'

type Props = {
  params: {
    org: string
  }
}

export default async function Page({ params }: Props) {
  const permissions = await ability()

  if (permissions?.cannot('create', 'Project')) {
    redirect(`/org/${params.org}`)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create Project</h1>

      <ProjectForm />
    </div>
  )
}
