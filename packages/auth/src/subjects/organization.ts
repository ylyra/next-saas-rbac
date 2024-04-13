import { z } from "zod"

export const organizationSubject = z.tuple([
  z.enum([
    'manage',
    'create',
    'update',
    'delete',
    'transfer_ownership',
  ]),
  z.literal('Organization')
])

export type OrganizationSubject = z.infer<typeof organizationSubject>