import { ability, getCurrentOrg } from '@/auth/auth'

import { NavLink } from './nav-link'
import { Button } from './ui/button'

export async function Tabs() {
  const currentOrg = getCurrentOrg()
  const permissions = await ability()

  const canUpdateOrg = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')

  const canGetMembers = permissions?.can('get', 'User')
  const canGetProjects = permissions?.can('get', 'Project')

  return (
    <div className="border-b py-4">
      <nav className="container flex items-center gap-2">
        {canGetProjects && (
          <Button
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
            asChild
          >
            <NavLink href={`/org/${currentOrg}`}>Projects</NavLink>
          </Button>
        )}

        {canGetMembers && (
          <Button
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
            asChild
          >
            <NavLink href={`/org/${currentOrg}/members`}>Members</NavLink>
          </Button>
        )}

        {(canGetBilling || canUpdateOrg) && (
          <Button
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
            asChild
          >
            <NavLink href={`/org/${currentOrg}/settings`}>
              Settings and Billing
            </NavLink>
          </Button>
        )}
      </nav>
    </div>
  )
}
