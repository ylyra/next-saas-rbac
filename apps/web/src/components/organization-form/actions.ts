'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createOrganization } from '@/http/create-organization'
import { updateOrganization } from '@/http/update-organization'

const organizationSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters long').trim(),
    domain: z
      .string()
      .trim()
      .nullish()
      .transform((value) => (value === '' ? null : value))
      .refine((value) => {
        console.log(value)

        if (value) {
          return /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(value)
        }

        return true
      }, 'Invalid domain'),

    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain && !data.domain) {
        return false
      }

      return true
    },
    {
      message: 'Domain is required when attaching users by domain',
      path: ['domain'],
    },
  )
export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function createOrganizationAction(data: FormData) {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { name, shouldAttachUsersByDomain, domain } = result.data

  try {
    await createOrganization({
      name,
      shouldAttachUsersByDomain,
      domain,
    })

    revalidateTag('organizations')
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved organization.',
    errors: null,
  }
}

export async function updateOrganizationAction(data: FormData) {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { name, shouldAttachUsersByDomain, domain } = result.data

  try {
    const currentOrg = getCurrentOrg()

    if (!currentOrg) {
      throw new Error('No organization found')
    }

    await updateOrganization({
      org: currentOrg,
      name,
      shouldAttachUsersByDomain,
      domain,
    })

    revalidateTag('organizations')
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved organization.',
    errors: null,
  }
}
