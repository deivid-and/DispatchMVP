import type { FastifyInstance } from "fastify";
import { prisma } from "../db.js";
import { z } from "zod";

const GetQuery = z.object({
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // yyyy-mm-dd
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  companyId: z.string().optional(),
});

const PostBody = z.object({
  driverId: z.string().min(1),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // yyyy-mm-dd
  type: z.enum(["red", "orange", "brown", "dark", "purple"]).optional(),
  note: z.string().optional(),
  loadId: z.string().optional(),
  companyId: z.string().optional(),
});

export default async function flagsRoutes(app: FastifyInstance) {
  // GET flags for a date range
  app.get("/flags", async (req, reply) => {
    const parsed = GetQuery.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: "Invalid query", details: parsed.error.flatten() });
    const { start, end, companyId } = parsed.data;

    const startDt = new Date(`${start}T00:00:00.000Z`);
    const endDt = new Date(`${end}T23:59:59.999Z`);

    const flags = await prisma.cellFlag.findMany({
      where: {
        day: { gte: startDt, lte: endDt },
        ...(companyId ? { companyId } : {}),
      },
      include: {
        driver: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true } },
        updater: { select: { id: true, name: true } },
      },
    });

    // Group flags by driverId+day for easy lookup
    const flagsByDriverDay: Record<string, any> = {};
    flags.forEach(flag => {
      const key = `${flag.driverId}-${flag.day.toISOString().slice(0, 10)}`;
      flagsByDriverDay[key] = {
        id: flag.id,
        type: flag.type,
        note: flag.note,
        loadId: flag.loadId,
        companyId: flag.companyId,
        createdAt: flag.createdAt,
        updatedAt: flag.updatedAt,
        driver: flag.driver,
        creator: flag.creator,
        updater: flag.updater,
      };
    });

    return { flags: flagsByDriverDay };
  });

  // POST/UPSERT flag
  app.post("/flags", async (req, reply) => {
    const parsed = PostBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    const { driverId, day, type, note, loadId, companyId } = parsed.data;

    // For now, use a mock user ID (in real app, get from auth)
    const mockUserId = "seed-dispatcher";

    if (!type) {
      // Delete flag if type is not provided
      await prisma.cellFlag.deleteMany({
        where: { driverId, day: new Date(`${day}T00:00:00.000Z`) },
      });
      return reply.code(200).send({ message: "Flag cleared" });
    }

    const flag = await prisma.cellFlag.upsert({
      where: {
        driverId_day: { driverId, day: new Date(`${day}T00:00:00.000Z`) },
      },
      update: {
        type,
        note,
        loadId,
        companyId,
        updatedBy: mockUserId,
        updatedAt: new Date(),
      },
      create: {
        driverId,
        day: new Date(`${day}T00:00:00.000Z`),
        type,
        note,
        loadId,
        companyId,
        createdBy: mockUserId,
        updatedBy: mockUserId,
      },
      include: {
        driver: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true } },
        updater: { select: { id: true, name: true } },
      },
    });

    return reply.code(201).send(flag);
  });
}
