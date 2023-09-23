import fastify from 'fastify';
import { app as appService } from './app';

// Instantiate Fastify with some config.
const app = fastify({
  logger: {
    level: process.env.LOGGER_LEVEL,
  },
});

// Register your application as a normal plugin.
app.register(appService);

// Start listening.
app.listen(
  {
    port: Number(process.env.APP_PORT) || 3000,
    host: process.env.APP_HOST || 'localhost',
  },
  (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  }
);
