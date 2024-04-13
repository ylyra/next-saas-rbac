import { ability } from '@saas/auth'

const userCanInviteSomeone = ability.can('invite', 'User')
const userCanDeleteOtherUser = ability.can('delete', 'User')

const userCannotDeleteOtherUser = ability.cannot('delete', 'User')

console.log(userCanInviteSomeone) // true
console.log(userCanDeleteOtherUser) // false
console.log(userCannotDeleteOtherUser) // true