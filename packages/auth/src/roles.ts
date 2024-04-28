import z from 'zod'

export const roleSchema = z.enum(['ADMIN', 'MEMBER', 'BILLING'])

export type Role = z.infer<typeof roleSchema>
