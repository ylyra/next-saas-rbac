import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
} from '@casl/ability'

import { User } from './models/user'
import { permissions } from './permissions'
import { AppAbility } from './subjects'

export * from './models/organization'
export * from './models/project'
export * from './models/user'

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilitiesFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Undefined permissions for role ${user.role}`)
  }

  permissions[user.role](user, builder)

  const abilities = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  return abilities
}
