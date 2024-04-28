import { projectSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { PROJECTS_ROUTE_PREFIX, PROJECTS_TAGS } from '.'

export async function projectsUpdateeProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      createRoute(PROJECTS_ROUTE_PREFIX, 'projects', ':projectId'),
      {
        schema: {
          tags: PROJECTS_TAGS,
          summary: 'Delete a project in an organization',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            organizationSlug: z.string(),
            projectId: z.string().cuid(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
            avatarUrl: z.string().nullable(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug, projectId } = request.params
        const { membership, organization } =
          await request.getUserMembership(organizationSlug)

        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found')
        }

        const { cannot } = getUserPermissions(
          membership.userId,
          membership.role,
        )
        const authProject = projectSchema.parse(project)

        if (cannot('update', authProject)) {
          throw new UnauthorizedError(
            'You do not have permission to update this project',
          )
        }

        const { name, description, avatarUrl } = request.body

        await prisma.project.update({
          where: {
            id: projectId,
          },
          data: {
            name,
            description,
            avatarUrl,
          },
        })

        return reply.status(204).send()
      },
    )
}
