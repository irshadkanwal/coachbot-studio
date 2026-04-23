/*
  Warnings:

  - You are about to drop the column `instructions` on the `ModerationRule` table. All the data in the column will be lost.
  - You are about to drop the column `severity` on the `ModerationRule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ModerationRule" DROP COLUMN "instructions",
DROP COLUMN "severity",
ADD COLUMN     "allow_category" TEXT,
ADD COLUMN     "score" DECIMAL(3,2);
