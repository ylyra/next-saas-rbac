import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { MEMBERS_ROUTE_PREFIX, MEMBERS_TAGS } from '.'

export async function membersUpdateMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      createRoute(MEMBERS_ROUTE_PREFIX, ':memberId'),
      {
        schema: {
          tags: MEMBERS_TAGS,
          summary: 'Update member',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            organizationSlug: z.string(),
            memberId: z.string().cuid(),
          }),
          body: z.object({
            role: roleSchema,
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

        if (cannot('update', 'User')) {
          throw new UnauthorizedError(
            'You do not have permission to update members of an organization',
          )
        }

        const member = await prisma.member.findFirst({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        })

        if (!member) {
          throw new BadRequestError('Member not found')
        }

        if (membership.userId === member.userId) {
          throw new BadRequestError('You cannot update your own role')
        }

        const { role } = request.body

        if (organization.ownerId === member.userId && role !== 'ADMIN') {
          throw new BadRequestError('You cannot update the owner role')
        }

        await prisma.member.update({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
          data: {
            role,
          },
        })

        reply.status(204).send()
      },
    )
}
