import { FastifyPluginAsync } from 'fastify';
import healthRoutes from './health/health.routes';

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', async function () {
    return { root: true };
  });
  fastify.register(healthRoutes);
};

export default root;
