import { FastifyInstance } from 'fastify';
import { build } from '../helper';

let app: FastifyInstance;
beforeAll(async () => {
  app = await build();
});

afterAll(async () => {
  await app.close();
});

test('health_check is loaded', async () => {
  const res = await app.inject({
    url: '/health_check',
  });

  expect(res.payload).toBe('OK');
});
