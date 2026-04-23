/*
  Warnings:

  - You are about to drop the column `answers` on the `Coach` table. All the data in the column will be lost.
  - Added the required column `assessment` to the `Coach` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coach" DROP COLUMN "answers",
ADD COLUMN     "assessment" JSONB NOT NULL;
