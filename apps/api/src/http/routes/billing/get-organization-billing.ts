import { env } from '@saas/env'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createRoute } from '@/utils/create-route'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BILLING_ROUTE_PREFIX, BILLING_TAGS } from '.'

export async function billingGetOrganizationBilling(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      createRoute(BILLING_ROUTE_PREFIX),
      {
        schema: {
          tags: BILLING_TAGS,
          summary: 'Get billing information for an organization',
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
              billing: z.object({
                seats: z.object({
                  amount: z.number(),
                  unite: z.number(),
                  price: z.number(),
                }),
                projects: z.object({
                  amount: z.number(),
                  unite: z.number(),
                  price: z.number(),
                }),
                total: z.number(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { organizationSlug } = request.params
        const { membership, organization } =
          await request.getUserMembership(organizationSlug)

        const { cannot } = getUserPermissions(
          membership.userId,
          membership.role,
        )

        if (cannot('get', 'Billing')) {
          throw new UnauthorizedError(
            'You do not have permission to get billing information for this organization',
          )
        }

        const [
          amountOfMembersForOrganization,
          amountOfProjectsForOrganization,
        ] = await Promise.all([
          prisma.member.count({
            where: {
              organizationId: organization.id,
              role: {
                not: 'BILLING',
              },
            },
          }),

          prisma.project.count({
            where: {
              organizationId: organization.id,
            },
          }),
        ])

        const totalPriceAmountOfSeats =
          amountOfMembersForOrganization * env.NEXT_PUBLIC_SEAT_UNIT_PRICE
        const totalPriceAmountOfProjects =
          amountOfProjectsForOrganization * env.NEXT_PUBLIC_PROJECT_UNIT_PRICE

        return {
          billing: {
            seats: {
              amount: amountOfMembersForOrganization ?? 0,
              unite: env.NEXT_PUBLIC_SEAT_UNIT_PRICE,
              price: totalPriceAmountOfSeats,
            },
            projects: {
              amount: amountOfProjectsForOrganization ?? 0,
              unite: env.NEXT_PUBLIC_PROJECT_UNIT_PRICE,
              price: totalPriceAmountOfProjects,
            },
            total: totalPriceAmountOfSeats + totalPriceAmountOfProjects,
          },
        }
      },
    )
}
