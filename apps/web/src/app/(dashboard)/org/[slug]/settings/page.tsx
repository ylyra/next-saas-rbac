import { redirect } from 'next/navigation'

import { ability } from '@/auth/auth'
import OrganizationForm from '@/components/organization-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getOrganization } from '@/http/get-organization'

import { ShutdownOrganizationButton } from './shutdown-organization-button'

type Props = {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const permissions = await ability()
  const canUpdateOrg = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')
  const canShutdownOrg = permissions?.can('delete', 'Organization')

  if (!canUpdateOrg && !canGetBilling) {
    redirect(`/org/${params.slug}`)
  }

  const { organization } = await getOrganization(params.slug)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        {canUpdateOrg && (
          <Card>
            <CardHeader>
              <CardTitle>Organization settings</CardTitle>
              <CardDescription>
                Manage your organization settings.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <OrganizationForm initialData={organization} />
            </CardContent>
          </Card>
        )}

        {canGetBilling && (
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Manage your billing settings.</CardDescription>
            </CardHeader>

            <CardContent>
              <p>Coming soon...</p>
            </CardContent>
          </Card>
        )}

        {canShutdownOrg && (
          <Card>
            <CardHeader>
              <CardTitle>Shutdown Organization</CardTitle>
              <CardDescription>
                This will delete all data associated with this organization. You
                can't undo this action.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ShutdownOrganizationButton />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
