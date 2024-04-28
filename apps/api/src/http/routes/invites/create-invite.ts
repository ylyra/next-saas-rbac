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
import { INVITES_ROUTE_PREFIX, INVITES_TAGS } from '.'

export async function invitesCreateInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      createRoute(INVITES_ROUTE_PREFIX),
      {
        schema: {
          tags: INVITES_TAGS,
          summary: 'Create an invite to an organization',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            organizationSlug: z.string(),
          }),
          body: z.object({
            email: z.string().email(),
            role: roleSchema,
          }),
          response: {
            201: z.object({
              inviteId: z.string().cuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug } = request.params
        const { membership, organization } =
          await request.getUserMembership(organizationSlug)

        const { cannot } = getUserPermissions(
          membership.userId,
          membership.role,
        )

        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(
            'You do not have permission to create invites for an organization',
          )
        }

        const { email, role } = request.body

        const [, domain] = email.split('@')

        if (
          domain === organization.domain &&
          organization.shouldAttachUsersByDomain
        ) {
          throw new BadRequestError(
            `Users with ${domain} domain will be attached to the organization automatically.`,
          )
        }

        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: organization.id,
            },
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError('Invite with this email already exists')
        }

        const memberWtihSameEmail = await prisma.member.findFirst({
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        })

        if (memberWtihSameEmail) {
          throw new BadRequestError(
            'User with this email is already a member of the organization',
          )
        }

        const invite = await prisma.invite.create({
          data: {
            email,
            role,
            organizationId: organization.id,
            authorId: membership.userId,
          },
        })

        reply.status(201).send({
          inviteId: invite.id,
        })
      },
    )
}
