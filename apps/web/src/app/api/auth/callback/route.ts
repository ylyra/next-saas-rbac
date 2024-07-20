import { HTTPError } from 'ky'
import { cookies } from 'next/headers'

import { signInWithGithub } from '@/http/sign-in-with-github'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return Response.json(
      {
        error: 'No code provided',
      },
      {
        status: 400,
      },
    )
  }

  try {
    const { token } = await signInWithGithub({
      code,
    })

    const cookieStore = cookies()

    cookieStore.set('@saas:token', token, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return Response.json({
        error: message,
      })
    }

    return Response.json({
      error: 'An unexpected error occurred. Please try again later.',
    })
  }

  const newUrl = new URL('/', url)
  return Response.redirect(newUrl.toString())
}
