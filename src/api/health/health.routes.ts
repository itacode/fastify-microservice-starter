import { FastifyPluginAsync } from 'fastify';

const health: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/health', async function () {
    return 'OK';
  });
};

export default health;
