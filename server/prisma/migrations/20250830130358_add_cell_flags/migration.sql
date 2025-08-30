-- CreateEnum
CREATE TYPE "public"."FlagType" AS ENUM ('red', 'orange', 'brown', 'dark', 'purple');

-- CreateTable
CREATE TABLE "public"."CellFlag" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "companyId" TEXT,
    "loadId" TEXT,
    "type" "public"."FlagType" NOT NULL,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CellFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CellFlag_driverId_day_idx" ON "public"."CellFlag"("driverId", "day");

-- CreateIndex
CREATE INDEX "CellFlag_companyId_day_idx" ON "public"."CellFlag"("companyId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "CellFlag_driverId_day_key" ON "public"."CellFlag"("driverId", "day");

-- AddForeignKey
ALTER TABLE "public"."CellFlag" ADD CONSTRAINT "CellFlag_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CellFlag" ADD CONSTRAINT "CellFlag_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CellFlag" ADD CONSTRAINT "CellFlag_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "public"."Load"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CellFlag" ADD CONSTRAINT "CellFlag_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CellFlag" ADD CONSTRAINT "CellFlag_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
