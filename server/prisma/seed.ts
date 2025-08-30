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

  // Additional dispatchers for JMJNM
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

  // Generate 10 drivers for each extra dispatcher under JMJNM
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

  console.log("Seeded: users, companies, drivers (no loads)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await db.$disconnect();
});
