import autoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import { FastifyPluginAsync } from 'fastify';
import { join } from 'path';
import { loadEnv } from './common/env';

loadEnv();

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // Set basic security headers.
  fastify.register(fastifyHelmet);
  // Plugin to parse the multipart content-type.
  fastify.register(fastifyMultipart);

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(autoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
  });

  // This loads all plugins defined in api
  void fastify.register(autoLoad, {
    dir: join(__dirname, 'api'),
    options: opts,
  });
};

export default app;
export { app };
