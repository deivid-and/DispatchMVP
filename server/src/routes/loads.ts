import type { FastifyInstance } from "fastify";
import { prisma } from "../db.js";
import { z } from "zod";

const Body = z.object({
  companyId: z.string().min(1),
  dispatcherId: z.string().min(1),
  driverId: z.string().min(1),

  loadNumber: z.string().optional(),
  brokerName: z.string().optional(),
  brokerMcNumber: z.string().optional(),

  pickupCity: z.string().min(1),
  pickupState: z.string().min(2).max(2),
  pickupAddress: z.string().optional(),
  pickupZip: z.string().optional(),
  pickupAt: z.string().datetime().optional(), // ISO

  deliveryCity: z.string().min(1),
  deliveryState: z.string().min(2).max(2),
  deliveryAddress: z.string().optional(),
  deliveryZip: z.string().optional(),
  deliveryAt: z.string().datetime().optional(), // ISO

  rate: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  miles: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  deadhead: z.union([z.number(), z.string()]).optional().transform((v) => (v == null ? 0 : Number(v))),
  status: z.enum(["Ready", "Transit", "HT", "Late", "Delivered", "Canceled"]).optional().default("Ready"),
});

export default async function loadsRoutes(app: FastifyInstance) {
  app.post("/loads", async (req, reply) => {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    const b = parsed.data;

    const load = await prisma.load.create({
      data: {
        companyId: b.companyId,
        dispatcherId: b.dispatcherId,
        driverId: b.driverId,
        loadNumber: b.loadNumber,
        brokerName: b.brokerName,
        brokerMcNumber: b.brokerMcNumber,
        pickupCity: b.pickupCity,
        pickupState: b.pickupState,
        pickupAddress: b.pickupAddress,
        pickupZip: b.pickupZip,
        pickupAt: b.pickupAt ? new Date(b.pickupAt) : null,
        deliveryCity: b.deliveryCity,
        deliveryState: b.deliveryState,
        deliveryAddress: b.deliveryAddress,
        deliveryZip: b.deliveryZip,
        deliveryAt: b.deliveryAt ? new Date(b.deliveryAt) : null,
        rate: b.rate,
        miles: b.miles,
        deadhead: b.deadhead ?? 0,
        status: b.status,
      },
      include: { driver: true, dispatcher: true, company: true },
    });

    const rate = Number(load.rate);
    const rpm = load.miles ? rate / load.miles : 0;

    return reply.code(201).send({
      id: load.id,
      companyId: load.companyId,
      dispatcherId: load.dispatcherId,
      driverId: load.driverId,
      deliveryDate: load.deliveryAt ? load.deliveryAt.toISOString().slice(0, 10) : null,
      deliveryCity: load.deliveryCity, deliveryState: load.deliveryState,
      pickupCity: load.pickupCity, pickupState: load.pickupState,
      loadNumber: load.loadNumber, brokerName: load.brokerName,
      status: load.status,
      rate, miles: load.miles, deadhead: load.deadhead, rpm: Number(rpm.toFixed(2)),
      driver: { id: load.driver.id, name: load.driver.name },
      dispatcher: { id: load.dispatcher.id, name: load.dispatcher.name },
      company: { id: load.company.id, name: load.company.name },
    });
  });
}
