/*
  Warnings:

  - You are about to drop the column `user_id` on the `ModelConfig` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ModerationRule` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ModelConfig" DROP CONSTRAINT "model_configs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ModerationRule" DROP CONSTRAINT "ModerationRule_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_userId_fkey";

-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "tones_user_id_fkey";

-- DropIndex
DROP INDEX "idx_model_configs_user_id";

-- DropIndex
DROP INDEX "idx_style_user_title";

-- DropIndex
DROP INDEX "idx_tones_user_id";

-- AlterTable
ALTER TABLE "ModelConfig" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "ModerationRule" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "Stage" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "Style" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "instructions";
