import { AbilityBuilder } from "@casl/ability"
import { User } from "./models/user"
import { Role } from "./roles"
import { AppAbility } from "./subjects"

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(_, { can }) {
    can('manage', 'all')
  },

  MEMBER(user, {can}) {
    can(['create', 'get'], 'Project')
    can(['update', 'delete'], 'Project', {
      ownerId: {
        $eq: user.id
      }
    })
    // can('invite', 'User')
  },

  BILLING() {}
}