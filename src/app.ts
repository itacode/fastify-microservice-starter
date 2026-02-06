import autoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import { FastifyPluginAsync, FastifyError } from 'fastify';
import multipart from '@fastify/multipart';
import { join } from 'path';
import apiRootRoutes from './api/root.routes';
import { loadEnv } from './common/env';

loadEnv();

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // Set basic security headers.
  fastify.register(fastifyHelmet);

  fastify.register(fastifyCors);

  // Register @fastify/multipart with attachFieldsToBody: true
  // This parses files and puts them in req.body
  fastify.register(multipart, { attachFieldsToBody: true });

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(autoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
  });

  fastify.setErrorHandler((err: FastifyError, req, reply) => {
    const statusCode = err.statusCode || 500;
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Log 5xx errors as 'error' and 4xx as 'info' to reduce noise
    if (statusCode >= 500) {
      req.log.error(err);
    } else {
      req.log.info(err);
    }

    reply.status(statusCode).send({
      statusCode,
      error: err.name,
      message:
        statusCode === 500 && !isDevelopment
          ? 'Internal Server Error'
          : err.message,
      ...(err.validation && { validation: err.validation }),
      ...(isDevelopment && { stack: err.stack }),
    });
  });

  // API routes
  fastify.register(apiRootRoutes);
};

export default app;
export { app };
