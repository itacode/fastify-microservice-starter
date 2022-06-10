import fastify from 'fastify';
import { app as appService } from './app';
import closeWithGrace = require('close-with-grace');

// Instantiate Fastify with some config.
const app = fastify({
  logger: {
    level: process.env.LOGGER_LEVEL,
  },
});

// Register your application as a normal plugin.
app.register(appService);

// delay is the number of milliseconds for the graceful close to finish.
const closeListeners = closeWithGrace(
  { delay: 500 },
  async function ({ err }: { err?: Error | undefined }) {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  }
);

app.addHook('onClose', async (instance, done) => {
  closeListeners.uninstall();
  done();
});

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
