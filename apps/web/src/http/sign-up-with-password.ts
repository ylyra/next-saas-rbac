import { api } from './api-client'

interface SignUpWithPasswordRequest {
  name: string
  email: string
  password: string
}

export async function signUpWithPassword({
  name,
  email,
  password,
}: SignUpWithPasswordRequest) {
  await api.post('auth/password', {
    json: {
      name,
      email,
      password,
    },
  })
}
