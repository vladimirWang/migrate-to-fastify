// Import the framework and instantiate it
import Fastify from "fastify";
import { userLogin } from "./routes/userRoute.js";

const fastify = Fastify({
  logger: true,
});

// // Declare a route
// fastify.get("/", async function handler(request, reply) {
//   return { hello: "world" };
// });

fastify.register(
  (app, opts, done) => {
    app.post("/user/login", userLogin);
    done();
  },
  { prefix: "/api" }
);

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
