import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import indexRoute from "./routes/indexRoute.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fastifyStatic from "@fastify/static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.__filename = __filename;
global.__dirname = __dirname;

const { JWT_SECRET } = process.env;

export const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "static"),
  prefix: "/static/",
});
fastify.register(fastifyJwt, {
  secret: JWT_SECRET,
});

fastify.register(fastifyMultipart);

fastify.register(indexRoute, { prefix: "/api" });

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
