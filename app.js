import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import indexRoute from "./routes/indexRoute.js";

const { JWT_SECRET } = process.env;

export const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyJwt, {
  secret: JWT_SECRET,
});

fastify.register(indexRoute, { prefix: "/api" });

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
