-- AlterTable
ALTER TABLE "AssistantMeta" ADD COLUMN     "revenueEnabled" BOOLEAN;

-- AlterTable
ALTER TABLE "PriceConfiguration" ADD COLUMN     "monthlyPriceId" TEXT NOT NULL DEFAULT 'price_1RigBRCuxcKrqxtTnTlsmuwP',
ADD COLUMN     "stripeProductId" TEXT NOT NULL DEFAULT 'prod_ScM6ilisNs7ZRj',
ADD COLUMN     "yearlyPriceId" TEXT;
