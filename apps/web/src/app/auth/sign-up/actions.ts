'use server'

import { HTTPError } from 'ky'
import z from 'zod'

import { signUpWithPassword } from '@/http/sign-up-with-password'

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .trim()
      .refine(
        (value) => value.split(' ').length > 1,
        'Please enter your full name',
      ),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirm_password: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        path: ['confirm_password'],
        message: 'Passwords do not match',
        code: 'custom',
      })
    }
  })

export async function signUpWithEmailAndPassword(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = result.data

  try {
    await signUpWithPassword({
      name,
      email,
      password,
    })
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
    message: null,
    errors: null,
  }
}
