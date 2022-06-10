import autoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import { FastifyPluginAsync } from 'fastify';
import multer from 'fastify-multer';
import openapiValidator from 'openapi-validator-middleware';
import { join } from 'path';
import apiRootRoutes from './api/root.routes';
import { loadEnv } from './common/env';

loadEnv();

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Set basic security headers.
  fastify.register(fastifyHelmet);

  fastify.register(fastifyCors);
  // Plugin to parse the multipart content-type.
  // Use multer instead of @fastify/multipart,
  // which causes openapi-validator-middleware `TypeError: files.push is not a function`
  fastify.register(multer.contentParser);

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(autoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
  });

  openapiValidator.init('src/openapi/my_service.oas.yml', {
    framework: 'fastify',
  });
  fastify.register(
    openapiValidator.validate({
      skiplist: [],
    })
  );
  fastify.setErrorHandler(async (err, req, reply) => {
    if (err instanceof openapiValidator.InputValidationError) {
      return reply.status(400).send({ more_info: JSON.stringify(err.errors) });
    }
    fastify.log.error(err);

    reply.status(500);
    reply.send();
  });

  // API routes
  fastify.register(apiRootRoutes);
};

export default app;
export { app };
