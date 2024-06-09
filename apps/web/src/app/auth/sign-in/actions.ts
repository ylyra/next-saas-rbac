'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import z from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email: String(email),
      password: String(password),
    })

    const cookieStore = cookies()

    cookieStore.set('@saas:token', token, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      httpOnly: true,
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
}
