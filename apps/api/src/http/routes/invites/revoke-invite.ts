import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { INVITES_ROUTE_PREFIX, INVITES_TAGS } from '.'

export async function invitesRevokeInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      createRoute(INVITES_ROUTE_PREFIX, ':inviteId', 'revoke'),
      {
        schema: {
          tags: INVITES_TAGS,
          summary: 'Revoke an invite to an organization',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            organizationSlug: z.string(),
            inviteId: z.string().cuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug, inviteId } = request.params
        const { membership, organization } =
          await request.getUserMembership(organizationSlug)

        const { cannot } = getUserPermissions(
          membership.userId,
          membership.role,
        )

        if (cannot('delete', 'Invite')) {
          throw new UnauthorizedError(
            'You do not have permission to revoke invites',
          )
        }

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
            organizationId: organization.id,
          },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found or expired')
        }

        await prisma.invite.delete({
          where: {
            id: inviteId,
          },
        })

        reply.status(204).send()
      },
    )
}
