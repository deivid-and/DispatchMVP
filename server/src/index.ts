import Fastify from "fastify";
import cors from "@fastify/cors";
import { prisma } from "./db.js";
import boardRoutes from "./routes/board.js";
import loadsRoutes from "./routes/loads.js";

async function startServer() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: "http://localhost:5173" });
  await app.register(boardRoutes, { prefix: "/api" });
  await app.register(loadsRoutes, { prefix: "/api" });
  console.log("Routes registered");

  app.get("/health", async () => ({ ok: true }));

  app.get("/health/db", async () => {
    await prisma.$queryRaw`SELECT 1`; // connectivity check
    return { ok: true, db: true };
  });

  app.get("/api/test-data", async () => {
    const users = await prisma.user.findMany();
    const companies = await prisma.company.findMany();
    const drivers = await prisma.driver.findMany();
    const loads = await prisma.load.findMany();
    
    return {
      users: users.length,
      companies: companies.length,
      drivers: drivers.length,
      loads: loads.length,
      sample: {
        users: users.map(u => ({ id: u.id, name: u.name, role: u.role })),
        companies: companies.map(c => ({ id: c.id, name: c.name })),
        drivers: drivers.map(d => ({ id: d.id, name: d.name, trailerType: d.trailerType })),
        loads: loads.map(l => ({ id: l.id, loadNumber: l.loadNumber, status: l.status, rate: l.rate }))
      }
    };
  });

  const port = Number(process.env.PORT || 4000);
  await app.listen({ port, host: "0.0.0.0" });
}

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
