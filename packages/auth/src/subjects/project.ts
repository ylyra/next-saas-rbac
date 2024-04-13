import { z } from "zod"

export const projectSubject = z.tuple([
  z.enum(['get', 'create', 'update', 'delete', 'manage']),
  z.literal('Project')
])

export type ProjectSubject = z.infer<typeof projectSubject>