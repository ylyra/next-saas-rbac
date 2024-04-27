import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'

import { ORGANIZATIONS_ROUTE_PREFIX, ORGANIZATIONS_TAGS } from '.'

export async function orgsGetOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      createRoute(ORGANIZATIONS_ROUTE_PREFIX),
      {
        schema: {
          tags: ORGANIZATIONS_TAGS,
          summary: 'Get organizations where the user is a member',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            organizationSlug: z.string(),
          }),
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string().cuid(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  role: roleSchema,
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const organizations = await prisma.organization.findMany({
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
        })

        const organizationsWithUserRole = organizations.map(
          ({ members, ...org }) => ({
            ...org,
            role: members[0].role,
          }),
        )

        return {
          organizations: organizationsWithUserRole,
        }
      },
    )
}
