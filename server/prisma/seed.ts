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

  // Additional dispatchers for JMJMN
  const extraDispatchers = [] as { id: string; name: string }[];
  for (let i = 1; i <= 5; i++) {
    const email = `dispatcher${i}@local`;
    const d = await db.user.upsert({
      where: { email },
      update: {},
      create: { name: `Dispatcher ${i}`, email, role: "dispatcher", commissionPct: "05.00" },
    });
    extraDispatchers.push({ id: d.id, name: d.name });
  }

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

  // Generate 10 drivers for each extra dispatcher under JMJMN
  const trailerTypes = ["dryvan", "reefer", "flatbed", "stepdeck"] as const;
  const rand = (n: number) => Math.floor(Math.random() * n);
  const makeId = (prefix: string, i: number, j: number) => `seed-${prefix}-${i}-${j}`;
  const cityStatePairs = [
    { city: "Chicago", state: "IL" },
    { city: "Dallas", state: "TX" },
    { city: "Houston", state: "TX" },
    { city: "St. Louis", state: "MO" },
    { city: "Kansas City", state: "MO" },
    { city: "Denver", state: "CO" },
    { city: "Salt Lake City", state: "UT" },
    { city: "Seattle", state: "WA" },
    { city: "Portland", state: "OR" },
    { city: "Boise", state: "ID" },
  ];

  const newDrivers: { id: string; name: string; dispatcherId: string }[] = [];
  for (let i = 1; i <= extraDispatchers.length; i++) {
    const disp = extraDispatchers[i - 1];
    for (let j = 1; j <= 10; j++) {
      const id = makeId("dr", i, j);
      const name = `Driver ${i}-${j}`;
      const d = await db.driver.upsert({
        where: { id },
        update: {},
        create: {
          id,
          name,
          phone: `+1 555-${1000 + i}${(100 + j).toString().padStart(3, '0')}`,
          trailerType: trailerTypes[rand(trailerTypes.length)] as any,
          truckNumber: `TX${i}${j}`,
          trailerNumber: `TR${i}${j}`,
          dispatcherId: disp.id,
          companyId: jmjmn.id,
        },
      });
      newDrivers.push({ id: d.id, name, dispatcherId: disp.id });
    }
  }

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

  // Generate loads for new drivers in target week 2025-07-21..2025-07-23
  let loadSeq = 200000;
  for (const nd of newDrivers) {
    const numLoads = 2; // Mon and Tue for visibility
    for (let k = 0; k < numLoads; k++) {
      const puIdx = rand(cityStatePairs.length);
      let deIdx = rand(cityStatePairs.length);
      if (deIdx === puIdx) deIdx = (deIdx + 1) % cityStatePairs.length;
      const pu = cityStatePairs[puIdx];
      const de = cityStatePairs[deIdx];
      const day = k === 0 ? "2025-07-21" : "2025-07-22";
      const id = `seed-gen-${nd.id}-${k}`;
      await db.load.upsert({
        where: { id },
        update: {},
        create: {
          id,
          companyId: jmjmn.id,
          dispatcherId: nd.dispatcherId,
          driverId: nd.id,
          brokerName: ["TQL", "Coyote", "CH Robinson", "Landstar"][rand(4)],
          loadNumber: String(loadSeq++),
          pickupName: "Warehouse",
          pickupAddress: "100 Main St",
          pickupCity: pu.city, pickupState: pu.state, pickupZip: "00000",
          pickupAt: new Date(`${day}T08:00:00Z`),
          deliveryAddress: "200 Market Rd",
          deliveryCity: de.city, deliveryState: de.state, deliveryZip: "00000",
          deliveryAt: new Date(`${day}T17:00:00Z`),
          rate: String(800 + rand(1200) + 200), miles: 300 + rand(900), deadhead: rand(150), status: ["Ready", "Transit", "HT"][rand(3)] as any,
        },
      });
    }
  }

  console.log("Seeded: users, companies, drivers, loads (including generated)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await db.$disconnect();
});
