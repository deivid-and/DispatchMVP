import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  // Users
  const admin = await db.user.upsert({
    where: { email: "admin@local" },
    update: {},
    create: { name: "Admin", email: "admin@local", role: "admin", commissionPct: "0.00" },
  });
  const manager = await db.user.upsert({
    where: { email: "manager@local" },
    update: {},
    create: { name: "Manager", email: "manager@local", role: "manager", commissionPct: "0.00" },
  });
  const dispatcher = await db.user.upsert({
    where: { email: "dispatcher@local" },
    update: {},
    create: { name: "Roger", email: "dispatcher@local", role: "dispatcher", commissionPct: "05.00" },
  });

  // Companies
  const jmjmn = await db.company.upsert({
    where: { name: "JMJNM" },
    update: {},
    create: { name: "JMJNM" },
  });
  const acme = await db.company.upsert({
    where: { name: "Acme Logistics" },
    update: {},
    create: { name: "Acme Logistics" },
  });

  // Drivers
  const dr1 = await db.driver.upsert({
    where: { id: "seed-dr1" },
    update: {},
    create: {
      id: "seed-dr1",
      name: "Alice Smith",
      phone: "+1 555-123-4567",
      trailerType: "dryvan",
      truckNumber: "TX1234",
      trailerNumber: "TR5678",
      dispatcherId: dispatcher.id,
      companyId: jmjmn.id,
    },
  });
  const dr2 = await db.driver.upsert({
    where: { id: "seed-dr2" },
    update: {},
    create: {
      id: "seed-dr2",
      name: "Bob Lee",
      phone: "+1 555-234-5678",
      trailerType: "reefer",
      truckNumber: "TX2345",
      trailerNumber: "TR6789",
      dispatcherId: dispatcher.id,
      companyId: jmjmn.id,
    },
  });

  // Loads (dates ISO; rpm is derived in UI)
  await db.load.upsert({
    where: { id: "seed-l1" },
    update: {},
    create: {
      id: "seed-l1",
      companyId: jmjmn.id,
      dispatcherId: dispatcher.id,
      driverId: dr1.id,
      brokerName: "CH Robinson",
      brokerMcNumber: "021866",
      loadNumber: "118020",
      pickupName: "JAYCO",
      pickupAddress: "1470 AVENUE T 1222",
      pickupCity: "Chicago", pickupState: "IL", pickupZip: "75050",
      pickupAt: new Date("2025-07-21T13:00:00Z"),
      deliveryAddress: "7701 B COMMERCE BLVD",
      deliveryCity: "Dallas", deliveryState: "TX", deliveryZip: "32404",
      deliveryAt: new Date("2025-07-21T18:00:00Z"),
      rate: "1200.00", miles: 600, deadhead: 140, status: "Ready",
    },
  });

  await db.load.upsert({
    where: { id: "seed-l2" },
    update: {},
    create: {
      id: "seed-l2",
      companyId: jmjmn.id,
      dispatcherId: dispatcher.id,
      driverId: dr1.id,
      brokerName: "TQL",
      loadNumber: "118021",
      pickupName: "ABC",
      pickupAddress: "123 Main St",
      pickupCity: "Dallas", pickupState: "TX", pickupZip: "75201",
      pickupAt: new Date("2025-07-22T09:00:00Z"),
      deliveryAddress: "456 Market St",
      deliveryCity: "Houston", deliveryState: "TX", deliveryZip: "77001",
      deliveryAt: new Date("2025-07-22T16:00:00Z"),
      rate: "1000.00", miles: 500, deadhead: 0, status: "Transit",
    },
  });

  await db.load.upsert({
    where: { id: "seed-l3" },
    update: {},
    create: {
      id: "seed-l3",
      companyId: jmjmn.id,
      dispatcherId: dispatcher.id,
      driverId: dr2.id,
      brokerName: "Landstar",
      loadNumber: "118023",
      pickupName: "DEF",
      pickupAddress: "111 River Rd",
      pickupCity: "St. Louis", pickupState: "MO", pickupZip: "63101",
      pickupAt: new Date("2025-07-21T08:00:00Z"),
      deliveryAddress: "222 Lake St",
      deliveryCity: "Chicago", deliveryState: "IL", deliveryZip: "60601",
      deliveryAt: new Date("2025-07-21T15:00:00Z"),
      rate: "900.00", miles: 400, deadhead: 0, status: "Transit",
    },
  });

  console.log("Seeded: users, companies, drivers, loads");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await db.$disconnect();
});
