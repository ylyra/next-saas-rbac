import fastifyEnv from '@fastify/env'
import type { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

const configPlugin: FastifyPluginCallback = async (server, _, done) => {
  const fastifyEnvSchema = {
    type: 'object',
    required: [
      'PORT',
      'GITHUB_CLIENT_ID',
      'GITHUB_CLIENT_SECRET',
      'GITHUB_REDIRECT_URL',
    ],
    properties: {
      PORT: {
        type: 'string',
        default: 3333,
      },
      GITHUB_CLIENT_ID: {
        type: 'string',
      },
      GITHUB_CLIENT_SECRET: {
        type: 'string',
      },
      GITHUB_REDIRECT_URL: {
        type: 'string',
      },
    },
  }
  const fastifyenvOptions = {
    // decorate the Fastify server instance with `config` key
    // such as `fastify.config('PORT')
    confKey: 'config',
    // schema to validate
    schema: fastifyEnvSchema,
    // source for the configuration data
    data: process.env,
    // will read .env in root folder
    dotenv: true,
    // will remove the additional properties
    // from the data object which creates an
    // explicit schema
    removeAdditional: true,
  }

  return fastifyEnv(server, fastifyenvOptions, done)
}

const envFastity = fastifyPlugin(configPlugin)

export { envFastity }
