import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { INVITES_TAGS } from '.'

export async function invitesGetInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        tags: INVITES_TAGS,
        summary: 'Get invite',
        params: z.object({
          inviteId: z.string().cuid(),
        }),
        response: {
          200: z.object({
            invite: z.object({
              id: z.string().cuid(),
              email: z.string().email(),
              role: roleSchema,
              createdAt: z.date(),
              organization: z.object({
                name: z.string(),
              }),
              author: z
                .object({
                  id: z.string().cuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().nullable(),
                })
                .nullable(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { inviteId } = request.params

      const invite = await prisma.invite.findUnique({
        where: {
          id: inviteId,
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          organization: {
            select: {
              name: true,
            },
          },
        },
      })

      if (!invite) {
        throw new BadRequestError('Invite not found')
      }

      return {
        invite,
      }
    },
  )
}
