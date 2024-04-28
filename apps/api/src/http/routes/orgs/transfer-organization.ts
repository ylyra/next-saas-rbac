import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { ORGANIZATIONS_ROUTE_PREFIX, ORGANIZATIONS_TAGS } from '.'

export async function orgsTransferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      createRoute(ORGANIZATIONS_ROUTE_PREFIX, ':organizationSlug', 'transfer'),
      {
        schema: {
          tags: ORGANIZATIONS_TAGS,
          summary: 'Transfer organization ownership',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            organizationSlug: z.string(),
          }),
          body: z.object({
            transferToUserId: z.string().cuid(),
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

        if (cannot('transfer_ownership', authOrganization)) {
          throw new UnauthorizedError(
            'You do not have permission to transfer organization ownership',
          )
        }

        const { transferToUserId } = request.body

        const transferToMembership = await prisma.member.findUnique({
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: transferToUserId,
            },
          },
        })

        if (!transferToMembership) {
          throw new BadRequestError('User is not a member of the organization')
        }

        await prisma.$transaction([
          prisma.member.update({
            where: {
              organizationId_userId: {
                organizationId: organization.id,
                userId,
              },
            },
            data: {
              role: 'ADMIN',
            },
          }),

          prisma.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              ownerId: transferToUserId,
            },
          }),
        ])

        reply.status(204).send()
      },
    )
}
