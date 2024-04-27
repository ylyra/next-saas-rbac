import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { envFastity } from '@/lib/env'

import { errorHandler } from './error-handler'
import { authAuthenticateWithPassword } from './routes/auth/authenticate-with-password'
import { authCreateAccount } from './routes/auth/create-account'
import { authGetProfile } from './routes/auth/get-profile'
import { authRequestPasswordRecover } from './routes/auth/request-password-recover'
import { authResetPassword } from './routes/auth/reset-password'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js Saas',
      description: 'Full-stack Saas app with multi-tenant & RBAC',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyCors)
app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
})
app.register(envFastity)

app.register(authGetProfile)
app.register(authCreateAccount)
app.register(authAuthenticateWithPassword)
app.register(authRequestPasswordRecover)
app.register(authResetPassword)

app.listen({ port: 3333 }).then(() => {
  console.log('Server is running on http://localhost:3333')
})
