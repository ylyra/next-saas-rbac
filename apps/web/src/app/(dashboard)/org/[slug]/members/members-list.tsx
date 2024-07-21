import { organizationSchema } from '@saas/auth'
import { ArrowLeftRight, Crown, UserMinus } from 'lucide-react'

import { ability, getCurrentMembership, getCurrentOrg } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getMembers } from '@/http/get-members'
import { getOrganization } from '@/http/get-organization'
import { getInitials } from '@/utils/get-initials'

import { removeMemberAction } from './actions'
import { UpdateMemberRoleSelect } from './update-member-role-select'

export async function MembersList() {
  const permissions = await ability()
  const currentOrg = getCurrentOrg()

  const [{ members }, membership, { organization }] = await Promise.all([
    getMembers(currentOrg!),
    getCurrentMembership(),
    getOrganization(currentOrg!),
  ])

  const authOrganization = organizationSchema.parse(organization)

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell
                  className="py-2.5"
                  style={{
                    width: 48,
                  }}
                >
                  <Avatar>
                    {member.avatarUrl && (
                      <AvatarImage
                        src={member.avatarUrl}
                        alt=""
                        width={32}
                        height={32}
                        className="aspect-square size-full"
                      />
                    )}
                    <AvatarFallback>
                      {getInitials(member.name ?? '')}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                <TableCell className="py-2.5">
                  <div className="flex flex-col">
                    <span className="inline-flex items-center gap-2 font-medium">
                      {member.name}{' '}
                      {member.userId === membership?.userId && (
                        <span className="text-xs text-muted-foreground">
                          (You)
                        </span>
                      )}
                      {organization.ownerId === member.userId && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Crown className="size-3" />
                          Owner
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    {permissions?.can(
                      'transfer_ownership',
                      authOrganization,
                    ) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={
                          member.userId === organization.ownerId ||
                          member.userId === membership?.userId
                        }
                      >
                        <ArrowLeftRight className="mr-2 size-4" />
                        Transfer Ownership
                      </Button>
                    )}

                    <UpdateMemberRoleSelect
                      memberId={member.id}
                      org={currentOrg!}
                      disabled={
                        member.userId === organization.ownerId ||
                        member.userId === membership?.userId ||
                        permissions?.cannot('update', 'User')
                      }
                      value={member.role}
                    />

                    {permissions?.can('delete', 'User') && (
                      <form
                        action={removeMemberAction.bind(null, {
                          memberId: member.id,
                          org: currentOrg!,
                        })}
                      >
                        <Button
                          size="sm"
                          variant="destructive"
                          type="submit"
                          disabled={
                            member.userId === organization.ownerId ||
                            member.userId === membership?.userId
                          }
                        >
                          <UserMinus className="mr-2 size-4" />
                          Remove
                        </Button>
                      </form>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
