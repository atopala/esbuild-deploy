import Fastify, { FastifyInstance } from "fastify";
import * as db from "./database.js";

// Create fastify instance with logging enabled
const server: FastifyInstance = Fastify({
   logger: true,
});

// Define a basic route
server.get("/", async () => {
   const persons = db.getPersons();
   return {
      label: "cjs example",
      persons,
   };
});

db.init();

// Start the server
const start = async () => {
   try {
      // Listen on all interfaces (0.0.0.0) on port 3000
      await server.listen({ port: 3000, host: "0.0.0.0" });
   } catch (err) {
      server.log.error(err);
      process.exit(1);
   }
};

start();
