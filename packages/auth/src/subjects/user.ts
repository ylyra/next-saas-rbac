import { z } from 'zod'

export const userSubject = z.tuple([
  z.enum(['get', 'update', 'delete', 'manage']),
  z.literal('User'),
])

export type UserSubject = z.infer<typeof userSubject>
