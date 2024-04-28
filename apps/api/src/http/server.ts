import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { env } from '@saas/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authAuthenticateWithPassword } from './routes/auth/authenticate-with-password'
import { authCreateAccount } from './routes/auth/create-account'
import { authGetProfile } from './routes/auth/get-profile'
import { authRequestPasswordRecover } from './routes/auth/request-password-recover'
import { authResetPassword } from './routes/auth/reset-password'
import { orgsCreateOrganization } from './routes/orgs/create-organization'
import { orgsGetMembership } from './routes/orgs/get-membership'
import { orgsGetOrganization } from './routes/orgs/get-organization'
import { orgsGetOrganizations } from './routes/orgs/get-organizations'
import { orgsShutdownOrganization } from './routes/orgs/shutdown-organization'
import { orgsTransferOrganization } from './routes/orgs/transfer-organization'
import { orgsUpdateOrganization } from './routes/orgs/update-organization'
import { projectsCreateProject } from './routes/projects/create-project'
import { projectsDeleteProject } from './routes/projects/delete-project'
import { projectsGetProject } from './routes/projects/get-project'

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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyCors)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(authGetProfile)
app.register(authCreateAccount)
app.register(authAuthenticateWithPassword)
app.register(authRequestPasswordRecover)
app.register(authResetPassword)

app.register(orgsGetOrganizations)
app.register(orgsGetOrganization)
app.register(orgsGetMembership)
app.register(orgsCreateOrganization)
app.register(orgsUpdateOrganization)
app.register(orgsShutdownOrganization)
app.register(orgsTransferOrganization)

app.register(projectsGetProject)
app.register(projectsCreateProject)
app.register(projectsDeleteProject)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('Server is running on http://localhost:3333')
})
