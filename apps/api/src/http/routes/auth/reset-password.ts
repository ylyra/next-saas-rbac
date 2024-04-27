import { hash } from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'

import { UnauthorizedError } from '../_errors/unauthorized-error'
import { AUTH_ROUTE_PREFIX, AUTH_TAGS } from '.'

export async function authResetPassword(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      createRoute(AUTH_ROUTE_PREFIX, 'password', 'reset'),
      {
        schema: {
          tags: AUTH_TAGS,
          summary: 'Reset the password of a user',
          body: z.object({
            code: z.string(),
            password: z.string().min(8),
          }),
          response: {
            204: z.null(),
            401: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { code, password } = request.body

        const tokenFromCode = await prisma.token.findUnique({
          where: {
            id: code,
          },
        })

        if (!tokenFromCode) {
          throw new UnauthorizedError('Invalid token')
        }

        const passwordHash = await hash(password, 6)

        await prisma.user.update({
          where: {
            id: tokenFromCode.userId,
          },
          data: {
            passwordHash,
          },
        })

        return reply.status(204).send()
      },
    )
}
