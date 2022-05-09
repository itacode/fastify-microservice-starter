import { FastifyInstance } from 'fastify';
import { build } from '../helper';

let app: FastifyInstance;
beforeAll(async () => {
  app = await build();
});

afterAll(async () => {
  await app.close();
});

test('example is loaded', async () => {
  const res = await app.inject({
    url: '/example',
  });

  expect(res.payload).toBe('this is an example');
});
