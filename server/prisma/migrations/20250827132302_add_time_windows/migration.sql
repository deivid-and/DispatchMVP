-- AlterTable
ALTER TABLE "public"."Load" ADD COLUMN     "deliveryWindowEnd" TEXT,
ADD COLUMN     "deliveryWindowStart" TEXT,
ADD COLUMN     "pickupWindowEnd" TEXT,
ADD COLUMN     "pickupWindowStart" TEXT;
