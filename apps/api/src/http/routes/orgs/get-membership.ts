import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { createRoute } from '@/utils/create-route'

import { ORGANIZATIONS_ROUTE_PREFIX, ORGANIZATIONS_TAGS } from '.'

export async function orgsGetMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      createRoute(
        ORGANIZATIONS_ROUTE_PREFIX,
        ':organizationSlug',
        'membership',
      ),
      {
        schema: {
          tags: ORGANIZATIONS_TAGS,
          summary: 'Get the current user membership in an organization',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            organizationSlug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string().cuid(),
                role: roleSchema,
                organizationId: z.string().cuid(),
                userId: z.string().cuid(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { organizationSlug } = request.params

        const { membership } = await request.getUserMembership(organizationSlug)

        return {
          membership: {
            id: membership.id,
            role: membership.role,
            organizationId: membership.organizationId,
            userId: membership.userId,
          },
        }
      },
    )
}
