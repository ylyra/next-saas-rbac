import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AUTH_ROUTE_PREFIX } from ".";
import { createRoute } from "../../../utils/create-route";

export async function authCreateAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(createRoute(AUTH_ROUTE_PREFIX), {
    schema: {
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8)
      })
    }
  }, () => {
    return 'User created!'
  })
}