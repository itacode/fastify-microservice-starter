import { FastifyPluginAsync } from 'fastify';

const health: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/health', async function () {
    return 'OK';
  });

  fastify.get<{ Params: { int: number } }>(
    '/health/validator/:int',
    async function (request) {
      return request.params.int;
    }
  );
};

export default health;
