import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'
import { PROJECTS_ROUTE_PREFIX, PROJECTS_TAGS } from '.'

export async function projectsGetProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      createRoute(PROJECTS_ROUTE_PREFIX, 'projects', ':projectSlug'),
      {
        schema: {
          tags: PROJECTS_TAGS,
          summary: 'Get a project within an organization',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            organizationSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            200: z.object({
              project: z.object({
                id: z.string().cuid(),
                name: z.string(),
                description: z.string(),
                slug: z.string(),
                avatarUrl: z.string().nullable(),
                ownerId: z.string().cuid(),
                organizationId: z.string().cuid(),

                owner: z.object({
                  id: z.string().cuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().nullable(),
                }),
              }),
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

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(
            'You do not have permission to see this project',
          )
        }

        const project = await prisma.project.findFirst({
          where: {
            organizationId: organization.id,
            slug: request.params.projectSlug,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            ownerId: true,
            description: true,
            avatarUrl: true,
            organizationId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        })

        if (!project) {
          throw new UnauthorizedError('Project not found')
        }

        reply.status(201).send({
          project,
        })
      },
    )
}
