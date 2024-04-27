import { compare } from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { primsa } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'

import { AUTH_ROUTE_PREFIX, AUTH_TAGS } from '.'

export async function authAuthenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    createRoute(AUTH_ROUTE_PREFIX, 'password'),
    {
      schema: {
        tags: AUTH_TAGS,
        summary: 'Authenticate with email and password',
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userWithSameEmail = await primsa.user.findUnique({
        where: {
          email,
        },
      })

      if (!userWithSameEmail) {
        return reply.status(400).send({
          message: 'Invalid Credentials',
        })
      }

      if (!userWithSameEmail.passwordHash) {
        return reply.status(400).send({
          message:
            'User does not have a password, please sign in with social login',
        })
      }

      const isPasswordCorrect = await compare(
        password,
        userWithSameEmail.passwordHash,
      )

      if (!isPasswordCorrect) {
        return reply.status(400).send({
          message: 'Invalid Credentials',
        })
      }

      const token = await reply.jwtSign(
        {
          sub: userWithSameEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.send({
        token,
      })
    },
  )
}
