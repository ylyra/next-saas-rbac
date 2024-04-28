import z from 'zod'

export const projectSchema = z.object({
  __typename: z.literal('Project').default('Project'),
  id: z.string().cuid(),
  ownerId: z.string().cuid(),
})

export type Project = z.infer<typeof projectSchema>
