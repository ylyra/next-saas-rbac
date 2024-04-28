import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'
import { MEMBERS_ROUTE_PREFIX, MEMBERS_TAGS } from '.'

export async function membersRemoveMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      createRoute(MEMBERS_ROUTE_PREFIX, ':memberId'),
      {
        schema: {
          tags: MEMBERS_TAGS,
          summary: 'Remove a member from an organization',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            organizationSlug: z.string(),
            memberId: z.string().cuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug, memberId } = request.params
        const { membership, organization } =
          await request.getUserMembership(organizationSlug)

        const { cannot } = getUserPermissions(
          membership.userId,
          membership.role,
        )

        if (cannot('delete', 'User')) {
          throw new UnauthorizedError(
            'You do not have permission to remove members from an organization',
          )
        }

        const members = await prisma.member.findMany({
          where: {
            organizationId: organization.id,
          },
        })

        if (members.length === 1) {
          throw new UnauthorizedError(
            'You cannot remove the last member from an organization',
          )
        }

        const member = members.find((m) => m.id === memberId)

        if (!member) {
          throw new UnauthorizedError('Member not found')
        }

        if (member.userId === membership.userId) {
          throw new UnauthorizedError('You cannot remove yourself')
        }

        if (organization.ownerId === member.userId) {
          throw new UnauthorizedError(
            'You cannot remove the organization owner',
          )
        }

        await prisma.member.delete({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        })

        reply.status(204).send()
      },
    )
}
