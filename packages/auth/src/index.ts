import { AbilityBuilder, CreateAbility, createMongoAbility } from '@casl/ability';
import { User } from './models/user';
import { permissions } from './permissions';
import { AppAbility } from './subjects';

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilitiesFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Undefined permissions for role ${user.role}`)
  }

  permissions[user.role](user, builder);

  const abilities = builder.build();

  return abilities;
}