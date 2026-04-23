/*
  Warnings:

  - The primary key for the `Coach` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Coach` table. All the data in the column will be lost.
  - The required column `coach_id` was added to the `Coach` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Coach" DROP CONSTRAINT "Coach_pkey",
DROP COLUMN "id",
ADD COLUMN     "coach_id" TEXT NOT NULL,
ADD CONSTRAINT "Coach_pkey" PRIMARY KEY ("coach_id");
