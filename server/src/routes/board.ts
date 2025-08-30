import type { FastifyInstance } from "fastify";
import { prisma } from "../db.js";
import { z } from "zod";

const Q = z.object({
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // yyyy-mm-dd
  end:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  companyId: z.string().optional(),
  dispatcherId: z.string().optional(),
});

export default async function boardRoutes(app: FastifyInstance) {
  app.get("/board", async (req, reply) => {
    const parsed = Q.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: "Invalid query", details: parsed.error.flatten() });
    const { start, end, companyId, dispatcherId } = parsed.data;

    const startDt = new Date(`${start}T00:00:00.000Z`);
    const endDt   = new Date(`${end}T23:59:59.999Z`);

    const loads = await prisma.load.findMany({
      where: {
        deliveryAt: { gte: startDt, lte: endDt },
        ...(companyId ? { companyId } : {}),
        ...(dispatcherId ? { dispatcherId } : {}),
      },
      include: { driver: true, dispatcher: true, company: true },
      orderBy: [{ deliveryAt: "asc" }],
    });

    // Get flags for the same date range
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

    const out = loads.map(l => {
      const rate = Number(l.rate);
      const rpm = l.miles ? rate / l.miles : 0;
      return {
        id: l.id,
        companyId: l.companyId,
        dispatcherId: l.dispatcherId,
        driverId: l.driverId,
        deliveryDate: l.deliveryAt ? l.deliveryAt.toISOString().slice(0,10) : null,
        deliveryCity: l.deliveryCity, deliveryState: l.deliveryState,
        pickupCity: l.pickupCity, pickupState: l.pickupState,
        loadNumber: l.loadNumber, brokerName: l.brokerName,
        status: l.status,
        rate, miles: l.miles, deadhead: l.deadhead, rpm: Number(rpm.toFixed(2)),
        driver: { id: l.driver.id, name: l.driver.name },
        dispatcher: { id: l.dispatcher.id, name: l.dispatcher.name },
        company: { id: l.company.id, name: l.company.name },
      };
    });

    return { 
      range: { start, end }, 
      count: out.length, 
      loads: out,
      flags: flagsByDriverDay
    };
  });
}
