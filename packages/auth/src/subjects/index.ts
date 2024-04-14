import { MongoAbility } from '@casl/ability'
import { z } from 'zod'

import { billingSubject } from './billing'
import { inviteSubject } from './invite'
import { organizationSubject } from './organization'
import { projectSubject } from './project'
import { userSubject } from './user'

const allSchema = z.tuple([z.enum(['manage']), z.literal('all')])

export const appSubjects = z.union([
  userSubject,
  projectSubject,
  inviteSubject,
  billingSubject,
  organizationSubject,
  allSchema,
])

export type AppSubject = z.infer<typeof appSubjects>

export type AppAbility = MongoAbility<AppSubject>
