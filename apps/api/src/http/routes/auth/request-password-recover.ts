import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'

import { AUTH_ROUTE_PREFIX, AUTH_TAGS } from '.'

export async function authRequestPasswordRecover(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      createRoute(AUTH_ROUTE_PREFIX, 'password', 'recover'),
      {
        schema: {
          tags: AUTH_TAGS,
          summary: 'Request a password recovery email',
          body: z.object({
            email: z.string().email(),
          }),
          response: {
            200: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { email } = request.body

        const userFromEmail = await prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (!userFromEmail) {
          return reply.status(200).send()
        }

        const { id: code } = await prisma.token.create({
          data: {
            type: 'PASSWORD_RECOVER',
            userId: userFromEmail.id,
          },
        })

        // send e-mail with password recovery link
        console.log('Recover password token: ', code)

        return reply.status(200).send()
      },
    )
}
