/*
  Warnings:

  - You are about to drop the column `communicationModes` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `goalTrack` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `onboarding` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `onboardingAnalyzer` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `tokensLimit` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `usageType` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `communicationModes` on the `AssistantConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `tokensLimit` on the `AssistantConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `usageType` on the `AssistantConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `assistantMetaId` on the `AssistantFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `assistantId` on the `ModelConfig` table. All the data in the column will be lost.
  - You are about to drop the column `assistantId` on the `ModerationRule` table. All the data in the column will be lost.
  - You are about to drop the column `assistantId` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `assistantId` on the `Style` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assistant" DROP CONSTRAINT "Assistant_templateId_fkey";

-- DropForeignKey
ALTER TABLE "AssistantFeedback" DROP CONSTRAINT "AssistantFeedback_assistantMetaId_fkey";

-- DropForeignKey
ALTER TABLE "ModelConfig" DROP CONSTRAINT "ModelConfig_assistantId_fkey";

-- DropForeignKey
ALTER TABLE "ModerationRule" DROP CONSTRAINT "ModerationRule_assistantId_fkey";

-- DropForeignKey
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_assistantId_fkey";

-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_assistantId_fkey";

-- DropIndex
DROP INDEX "idx_feedback_assistantMetaId";

-- DropIndex
DROP INDEX "idx_model_configs_assistantId";

-- DropIndex
DROP INDEX "idx_moderation_rule_assistantId";

-- DropIndex
DROP INDEX "idx_stage_assistantId";

-- DropIndex
DROP INDEX "idx_style_assistantId";

-- AlterTable
ALTER TABLE "Assistant" DROP COLUMN "communicationModes",
DROP COLUMN "goalTrack",
DROP COLUMN "instructions",
DROP COLUMN "mode",
DROP COLUMN "onboarding",
DROP COLUMN "onboardingAnalyzer",
DROP COLUMN "templateId",
DROP COLUMN "tokensLimit",
DROP COLUMN "usageType";

-- AlterTable
ALTER TABLE "AssistantConfiguration" DROP COLUMN "communicationModes",
DROP COLUMN "tokensLimit",
DROP COLUMN "usageType";

-- AlterTable
ALTER TABLE "AssistantFeedback" DROP COLUMN "assistantMetaId";

-- AlterTable
ALTER TABLE "ModelConfig" DROP COLUMN "assistantId";

-- AlterTable
ALTER TABLE "ModerationRule" DROP COLUMN "assistantId";

-- AlterTable
ALTER TABLE "Stage" DROP COLUMN "assistantId";

-- AlterTable
ALTER TABLE "Style" DROP COLUMN "assistantId";

-- CreateIndex
CREATE INDEX "idx_feedback_assistantId" ON "AssistantFeedback"("assistantId");

-- CreateIndex
CREATE INDEX "idx_model_configs_assistantConfigurationId" ON "ModelConfig"("assistantConfigurationId");

-- CreateIndex
CREATE INDEX "idx_moderation_rule_assistantConfigurationId" ON "ModerationRule"("assistantConfigurationId");

-- CreateIndex
CREATE INDEX "idx_stage_assistantConfigurationId" ON "Stage"("assistantConfigurationId");

-- CreateIndex
CREATE INDEX "idx_style_assistantConfigurationId" ON "Style"("assistantConfigurationId");
