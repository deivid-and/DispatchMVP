-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('admin', 'manager', 'dispatcher');

-- CreateEnum
CREATE TYPE "public"."TrailerType" AS ENUM ('dryvan', 'reefer', 'flatbed', 'stepdeck');

-- CreateEnum
CREATE TYPE "public"."LoadStatus" AS ENUM ('Ready', 'Transit', 'HT', 'Late', 'Delivered', 'Canceled');

-- CreateEnum
CREATE TYPE "public"."SettlementStatus" AS ENUM ('open', 'finalized', 'paid');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "commissionPct" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Driver" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "trailerType" "public"."TrailerType" NOT NULL,
    "truckNumber" TEXT,
    "trailerNumber" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "dispatcherId" TEXT NOT NULL,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Load" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "dispatcherId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "brokerName" TEXT,
    "brokerMcNumber" TEXT,
    "loadNumber" TEXT,
    "pickupName" TEXT,
    "pickupAddress" TEXT,
    "pickupCity" TEXT NOT NULL,
    "pickupState" TEXT NOT NULL,
    "pickupZip" TEXT,
    "pickupAt" TIMESTAMP(3),
    "deliveryAddress" TEXT,
    "deliveryCity" TEXT NOT NULL,
    "deliveryState" TEXT NOT NULL,
    "deliveryZip" TEXT,
    "deliveryAt" TIMESTAMP(3),
    "rate" DECIMAL(12,2) NOT NULL,
    "miles" INTEGER NOT NULL,
    "deadhead" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."LoadStatus" NOT NULL DEFAULT 'Ready',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Load_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LoadFile" (
    "id" TEXT NOT NULL,
    "loadId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoadFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DispatcherSettlement" (
    "id" TEXT NOT NULL,
    "dispatcherId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "gross" DECIMAL(12,2) NOT NULL,
    "commissionPct" DECIMAL(5,2) NOT NULL,
    "payoutAmount" DECIMAL(12,2) NOT NULL,
    "status" "public"."SettlementStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DispatcherSettlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "public"."Company"("name");

-- CreateIndex
CREATE INDEX "Load_dispatcherId_deliveryAt_idx" ON "public"."Load"("dispatcherId", "deliveryAt");

-- CreateIndex
CREATE INDEX "Load_driverId_deliveryAt_idx" ON "public"."Load"("driverId", "deliveryAt");

-- CreateIndex
CREATE INDEX "Load_companyId_idx" ON "public"."Load"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_company_loadnumber" ON "public"."Load"("companyId", "loadNumber");

-- CreateIndex
CREATE INDEX "DispatcherSettlement_dispatcherId_periodStart_periodEnd_idx" ON "public"."DispatcherSettlement"("dispatcherId", "periodStart", "periodEnd");

-- AddForeignKey
ALTER TABLE "public"."Driver" ADD CONSTRAINT "Driver_dispatcherId_fkey" FOREIGN KEY ("dispatcherId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Driver" ADD CONSTRAINT "Driver_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Load" ADD CONSTRAINT "Load_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Load" ADD CONSTRAINT "Load_dispatcherId_fkey" FOREIGN KEY ("dispatcherId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Load" ADD CONSTRAINT "Load_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LoadFile" ADD CONSTRAINT "LoadFile_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "public"."Load"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DispatcherSettlement" ADD CONSTRAINT "DispatcherSettlement_dispatcherId_fkey" FOREIGN KEY ("dispatcherId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
