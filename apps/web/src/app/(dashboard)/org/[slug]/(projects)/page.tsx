import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ability } from '@/auth/auth'
import { Button } from '@/components/ui/button'

import { ProjectsList } from './projects-list'

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

  if (
    permissions?.cannot('get', 'Project') &&
    permissions?.can('get', 'User')
  ) {
    redirect(`/org/${params.slug}/members`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Projects</h1>

        {permissions?.can('create', 'Project') && (
          <Button asChild size="sm">
            <Link href={`/org/${params.slug}/create-project`}>
              <Plus className="mr-2 size-4" />
              Create project
            </Link>
          </Button>
        )}
      </div>

      {permissions?.can('get', 'Project') ? (
        <ProjectsList org={params.slug} />
      ) : (
        <p className="text-sm text-muted-foreground">
          You are not allowed to view projects.
        </p>
      )}
    </div>
  )
}
