/*
  Warnings:

  - You are about to drop the column `coach_name` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `creted_by` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `step10_a` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `step1_a` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `step2_a` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `step3_a` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `step4_a` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `step5_a` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `step6_a` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `step7_a` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `step8_a` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `step9_a` on the `Coach` table. All the data in the column will be lost.
  - Added the required column `answers` to the `Coach` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Coach` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Coach` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coach" DROP COLUMN "coach_name",
DROP COLUMN "creted_by",
DROP COLUMN "step10_a",
DROP COLUMN "step1_a",
DROP COLUMN "step2_a",
DROP COLUMN "step3_a",
DROP COLUMN "step4_a",
DROP COLUMN "step5_a",
DROP COLUMN "step6_a",
DROP COLUMN "step7_a",
DROP COLUMN "step8_a",
DROP COLUMN "step9_a",
ADD COLUMN     "answers" JSONB NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "knowledge" TEXT[],
ADD COLUMN     "name" TEXT NOT NULL;
