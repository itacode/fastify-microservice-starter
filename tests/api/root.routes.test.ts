import { FastifyInstance } from 'fastify';
import { build } from '../helper';

let app: FastifyInstance;
beforeAll(async () => {
  app = await build();
});

afterAll(async () => {
  await app.close();
});

test('default root route', async () => {
  const res = await app.inject({ url: '/' });
  expect(JSON.parse(res.payload)).toEqual({ root: true });
});
