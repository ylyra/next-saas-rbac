import { hash } from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { primsa } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'

import { AUTH_ROUTE_PREFIX, AUTH_TAGS } from '.'

export async function authCreateAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    createRoute(AUTH_ROUTE_PREFIX),
    {
      schema: {
        tags: AUTH_TAGS,
        summary: 'Create a new account with email and password',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(8),
        }),
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body

      const userWithSameEmail = await primsa.user.findUnique({
        where: {
          email,
        },
      })

      if (userWithSameEmail) {
        return reply.status(400).send({
          message: 'User with this email already exists',
        })
      }

      const [, domain] = email.split('@')

      const autoJoinOrganization = await primsa.organization.findFirst({
        where: {
          domain,
          shouldAttachUsersByDomain: true,
        },
      })

      const passwordHash = await hash(password, 6)

      await primsa.user.create({
        data: {
          email,
          name,
          passwordHash,

          member_on: autoJoinOrganization
            ? {
                create: {
                  organizationId: autoJoinOrganization.id,
                },
              }
            : undefined,
        },
      })

      return reply.status(201).send()
    },
  )
}
