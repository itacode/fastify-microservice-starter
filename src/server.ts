import { loadEnv } from './common/env';
import Fastify from 'fastify';
import { app as appService } from './app';
import closeWithGrace = require('close-with-grace');

loadEnv();

// Instantiate Fastify with some config.
const app = Fastify({
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
app.listen(process.env.APP_PORT || 3000, process.env.APP_ADDRESS || '', (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
