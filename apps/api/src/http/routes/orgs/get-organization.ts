import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { createRoute } from '@/utils/create-route'

import { ORGANIZATIONS_ROUTE_PREFIX, ORGANIZATIONS_TAGS } from '.'

export async function orgsGetOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      createRoute(ORGANIZATIONS_ROUTE_PREFIX, ':organizationSlug'),
      {
        schema: {
          tags: ORGANIZATIONS_TAGS,
          summary: 'Get an organization',
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
              organization: z.object({
                id: z.string().cuid(),
                name: z.string(),
                slug: z.string(),
                domain: z.string().nullable(),
                shouldAttachUsersByDomain: z.boolean(),
                avatarUrl: z.string().url().nullable(),
                ownerId: z.string().cuid(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { organizationSlug } = request.params

        const { organization } =
          await request.getUserMembership(organizationSlug)

        return {
          organization,
        }
      },
    )
}
