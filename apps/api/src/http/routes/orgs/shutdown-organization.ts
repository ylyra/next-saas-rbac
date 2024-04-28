import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'
import { ORGANIZATIONS_ROUTE_PREFIX, ORGANIZATIONS_TAGS } from '.'

export async function orgsShutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      createRoute(ORGANIZATIONS_ROUTE_PREFIX, ':organizationSlug'),
      {
        schema: {
          tags: ORGANIZATIONS_TAGS,
          summary: 'Shutdown organization',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            organizationSlug: z.string(),
          }),
          response: {
            204: z.null,
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(organizationSlug)

        const authOrganization = organizationSchema.parse(organization)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authOrganization)) {
          throw new UnauthorizedError(
            'You do not have permission to shutdown this organization',
          )
        }

        await prisma.organization.delete({
          where: {
            id: organization.id,
          },
        })

        reply.status(204).send()
      },
    )
}
