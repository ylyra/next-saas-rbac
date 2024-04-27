import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'

import { BadRequestError } from '../_errors/bad-request-error'
import { AUTH_ROUTE_PREFIX, AUTH_TAGS } from '.'

export async function authGetProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      createRoute(AUTH_ROUTE_PREFIX, 'profile'),
      {
        schema: {
          tags: AUTH_TAGS,
          summary: 'Get the profile of the authenticated user',
          response: {
            200: z.object({
              user: z.object({
                id: z.string(),
                email: z.string().email(),
                name: z.string().nullable(),
                avatarUrl: z.string().nullable(),
              }),
            }),
            400: z.object({
              message: z.string(),
            }),
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const userWithSameEmail = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        })

        if (!userWithSameEmail) {
          throw new BadRequestError('User not found')
        }

        return reply.send({ user: userWithSameEmail })
      },
    )
}
