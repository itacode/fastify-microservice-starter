import { FastifyInstance } from 'fastify';
import { build } from '../../helper';

let app: FastifyInstance;
beforeAll(async () => {
  app = await build();
});

afterAll(async () => {
  await app.close();
});

test('health is loaded', async () => {
  const res = await app.inject({
    url: '/health',
  });

  expect(res.payload).toBe('OK');
});
