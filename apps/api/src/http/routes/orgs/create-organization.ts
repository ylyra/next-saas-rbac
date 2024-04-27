import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import slugify from 'slugify'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'

import { BadRequestError } from '../_errors/bad-request-error'
import { ORGANIZATIONS_ROUTE_PREFIX, ORGANIZATIONS_TAGS } from '.'

export async function orgsCreateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      createRoute(ORGANIZATIONS_ROUTE_PREFIX),
      {
        schema: {
          tags: ORGANIZATIONS_TAGS,
          summary: 'Create a new organization',
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional().default(false),
          }),
          response: {
            200: z.object({
              organizationId: z.string().cuid(),
              slug: z.string(),
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

        const { name, domain, shouldAttachUsersByDomain } = request.body

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: {
              domain,
            },
          })

          if (organizationByDomain) {
            throw new BadRequestError(
              'Another organization with the same domain already exists',
            )
          }
        }

        const slug = slugify(name, { lower: true })
        const organization = await prisma.organization.create({
          data: {
            name,
            slug,
            domain,
            shouldAttachUsersByDomain,
            ownerId: userId,
            members: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
        })

        reply.status(201).send({
          organizationId: organization.id,
          slug,
        })
      },
    )
}
