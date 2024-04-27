import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { primsa } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'

import { AUTH_ROUTE_PREFIX, AUTH_TAGS } from '.'

export async function authGetProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
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
      },
    },
    async (request, reply) => {
      const { sub } = await request.jwtVerify<{ sub: string }>()

      const userWithSameEmail = await primsa.user.findUnique({
        where: {
          id: sub,
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
        },
      })

      if (!userWithSameEmail) {
        return reply.status(400).send({
          message: 'User not found',
        })
      }

      return reply.send({ user: userWithSameEmail })
    },
  )
}
