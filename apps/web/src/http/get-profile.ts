import { api } from './api-client'

interface GetProfilebResponse {
  user: {
    id: string
    email: string
    name: string | null
    avatarUrl: string | null
  }
}

export async function getProfile(): Promise<GetProfilebResponse> {
  const result = await api.get('auth/profile').json<GetProfilebResponse>()

  return result
}
