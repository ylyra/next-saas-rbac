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

  MEMBER() {
    // can('invite', 'User')
  },

  BILLING() {}
}