import fastify from 'fastify';
import { loadEnv } from './common/env';
import { app as appService } from './app';

// Load environment variables before app instantiation
loadEnv();

// Instantiate Fastify with some config.
const app = fastify({ logger: { level: process.env.LOGGER_LEVEL } });

// Register your application as a normal plugin.
app.register(appService);

// Start listening.
const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.APP_PORT) || 3000,
      host: process.env.APP_HOST || '0.0.0.0',
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
