/*
  Warnings:

  - You are about to drop the column `templateId` on the `ModerationRule` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `Template` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ModerationRule" DROP CONSTRAINT "ModerationRule_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_templateId_fkey";

-- AlterTable
ALTER TABLE "ModerationRule" DROP COLUMN "templateId";

-- AlterTable
ALTER TABLE "Style" DROP COLUMN "templateId";

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "instructions";
