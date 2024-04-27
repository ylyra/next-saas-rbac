import { z } from 'zod'

import { roleSchema } from '../roles'

const userSchema = z.object({
  id: z.string().cuid(),
  role: roleSchema,
})

export type User = z.infer<typeof userSchema>
