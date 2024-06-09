import { cookies } from 'next/headers'

export function GET(request: Request) {
  const url = new URL(request.url)
  const newUrl = new URL('/auth/sign-in', url)

  cookies().delete('@saas:token')

  return Response.redirect(newUrl.toString())
}
