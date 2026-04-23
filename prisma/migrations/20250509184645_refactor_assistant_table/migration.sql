-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('free', 'premium');

-- DropForeignKey
ALTER TABLE "Assistant" DROP CONSTRAINT "Assistant_templateId_fkey";

-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "templateId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ModelConfig" ADD COLUMN     "assistantConfigurationId" UUID;

-- AlterTable
ALTER TABLE "ModerationRule" ADD COLUMN     "assistantConfigurationId" UUID;

-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "assistantConfigurationId" UUID;

-- AlterTable
ALTER TABLE "Style" ADD COLUMN     "assistantConfigurationId" UUID;

-- CreateTable
CREATE TABLE "PriceConfiguration" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "assistantMetaId" UUID NOT NULL,
    "amount" DOUBLE PRECISION,
    "monthly" DOUBLE PRECISION NOT NULL,
    "yearly" DOUBLE PRECISION,
    "currency" TEXT NOT NULL,
    "trialDays" INTEGER,

    CONSTRAINT "PriceConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssistantFeedback" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "assistantMetaId" UUID NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT,
    "userName" TEXT,

    CONSTRAINT "AssistantFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssistantMeta" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "topics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "visibility" "Visibility" NOT NULL DEFAULT 'public',
    "accessLevel" "AccessLevel" NOT NULL DEFAULT 'free',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "assistantId" UUID NOT NULL,

    CONSTRAINT "AssistantMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssistantConfiguration" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "instructions" TEXT,
    "onboarding" TEXT,
    "onboardingAnalyzer" TEXT,
    "tokensLimit" INTEGER,
    "usageType" "AssistantUsageType",
    "communicationModes" "CommunicationMode"[] DEFAULT ARRAY['text_to_text', 'speech_to_text']::"CommunicationMode"[],
    "assistantId" UUID NOT NULL,
    "templateId" UUID,

    CONSTRAINT "AssistantConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceConfiguration_assistantMetaId_key" ON "PriceConfiguration"("assistantMetaId");

-- CreateIndex
CREATE INDEX "idx_price_assistantMetaId" ON "PriceConfiguration"("assistantMetaId");

-- CreateIndex
CREATE UNIQUE INDEX "AssistantFeedback_assistantMetaId_key" ON "AssistantFeedback"("assistantMetaId");

-- CreateIndex
CREATE INDEX "idx_feedback_assistantMetaId" ON "AssistantFeedback"("assistantMetaId");

-- CreateIndex
CREATE UNIQUE INDEX "AssistantMeta_assistantId_key" ON "AssistantMeta"("assistantId");

-- CreateIndex
CREATE INDEX "idx_assistant_meta_visibility" ON "AssistantMeta"("visibility");

-- CreateIndex
CREATE INDEX "idx_meta_assistantId" ON "AssistantMeta"("assistantId");

-- CreateIndex
CREATE UNIQUE INDEX "AssistantConfiguration_assistantId_key" ON "AssistantConfiguration"("assistantId");

-- CreateIndex
CREATE INDEX "idx_configuration_assistantId" ON "AssistantConfiguration"("assistantId");

-- CreateIndex
CREATE INDEX "idx_assistant_status" ON "Assistant"("status");

-- AddForeignKey
ALTER TABLE "ModelConfig" ADD CONSTRAINT "ModelConfig_assistantConfigurationId_fkey" FOREIGN KEY ("assistantConfigurationId") REFERENCES "AssistantConfiguration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationRule" ADD CONSTRAINT "ModerationRule_assistantConfigurationId_fkey" FOREIGN KEY ("assistantConfigurationId") REFERENCES "AssistantConfiguration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_assistantConfigurationId_fkey" FOREIGN KEY ("assistantConfigurationId") REFERENCES "AssistantConfiguration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_assistantConfigurationId_fkey" FOREIGN KEY ("assistantConfigurationId") REFERENCES "AssistantConfiguration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceConfiguration" ADD CONSTRAINT "PriceConfiguration_assistantMetaId_fkey" FOREIGN KEY ("assistantMetaId") REFERENCES "AssistantMeta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantFeedback" ADD CONSTRAINT "AssistantFeedback_assistantMetaId_fkey" FOREIGN KEY ("assistantMetaId") REFERENCES "AssistantMeta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantMeta" ADD CONSTRAINT "AssistantMeta_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantConfiguration" ADD CONSTRAINT "AssistantConfiguration_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantConfiguration" ADD CONSTRAINT "AssistantConfiguration_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assistant" ADD CONSTRAINT "Assistant_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
