import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

const SEAT_UNIT_PRICE = z.coerce.number().default(10)
const PROJECT_UNIT_PRICE = z.coerce.number().default(20)
export const env = createEnv({
  server: {
    SERVER_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string(),

    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GITHUB_REDIRECT_URL: z.string().url(),

    SEAT_UNIT_PRICE,
    PROJECT_UNIT_PRICE,
  },

  client: {
    NEXT_PUBLIC_SEAT_UNIT_PRICE: SEAT_UNIT_PRICE,
    NEXT_PUBLIC_PROJECT_UNIT_PRICE: PROJECT_UNIT_PRICE,
  },

  shared: {},

  runtimeEnv: {
    SERVER_PORT: process.env.SERVER_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URL: process.env.GITHUB_REDIRECT_URL,

    SEAT_UNIT_PRICE: process.env.SEAT_UNIT_PRICE,
    NEXT_PUBLIC_SEAT_UNIT_PRICE: process.env.NEXT_PUBLIC_SEAT_UNIT_PRICE,

    PROJECT_UNIT_PRICE: process.env.PROJECT_UNIT_PRICE,
    NEXT_PUBLIC_PROJECT_UNIT_PRICE: process.env.NEXT_PUBLIC_PROJECT_UNIT_PRICE,
  },

  emptyStringAsUndefined: true,
})
