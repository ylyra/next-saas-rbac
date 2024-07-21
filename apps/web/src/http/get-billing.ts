import { api } from './api-client'

interface GetBillingResponse {
  billing: {
    seats: {
      amount: number
      unite: number
      price: number
    }
    projects: {
      amount: number
      unite: number
      price: number
    }
    total: number
  }
}

export async function getBilling(org: string): Promise<GetBillingResponse> {
  const result = await api
    .get(`organizations/${org}/billing`)
    .json<GetBillingResponse>()

  return result
}
