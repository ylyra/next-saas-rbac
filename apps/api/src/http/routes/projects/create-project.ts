import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import slugify from 'slugify'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'
import { PROJECTS_ROUTE_PREFIX, PROJECTS_TAGS } from '.'

export async function projectsCreateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      createRoute(PROJECTS_ROUTE_PREFIX, 'projects'),
      {
        schema: {
          tags: PROJECTS_TAGS,
          summary: 'Create a new project in an organization',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            organizationSlug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          response: {
            201: z.object({
              projectId: z.string().cuid(),
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

        if (cannot('create', 'Project')) {
          throw new UnauthorizedError(
            'You do not have permission to create a project',
          )
        }

        const { name, description } = request.body

        const project = await prisma.project.create({
          data: {
            name,
            slug: slugify(name, { lower: true }),
            description,
            organizationId: organization.id,
            ownerId: membership.userId,
          },
        })

        reply.status(201).send({
          projectId: project.id,
        })
      },
    )
}
