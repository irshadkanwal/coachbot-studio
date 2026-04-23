-- AlterTable
ALTER TABLE "ModelConfig" ADD COLUMN     "assistantId" UUID,
ADD COLUMN     "templateId" UUID,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ModerationRule" ADD COLUMN     "assistantId" UUID,
ADD COLUMN     "templateId" UUID;

-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "assistantId" UUID,
ADD COLUMN     "templateId" UUID,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Style" ADD COLUMN     "assistantId" UUID,
ADD COLUMN     "templateId" UUID,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Assistant" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "instructions" TEXT,
    "templateId" UUID NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Assistant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "instructions" TEXT,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_assistant_userId" ON "Assistant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Template_name_key" ON "Template"("name");

-- CreateIndex
CREATE INDEX "idx_model_configs_assistantId" ON "ModelConfig"("assistantId");

-- CreateIndex
CREATE INDEX "idx_moderation_rule_assistantId" ON "ModerationRule"("assistantId");

-- CreateIndex
CREATE INDEX "idx_stage_assistantId" ON "Stage"("assistantId");

-- CreateIndex
CREATE INDEX "idx_style_assistantId" ON "Style"("assistantId");

-- AddForeignKey
ALTER TABLE "ModelConfig" ADD CONSTRAINT "ModelConfig_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelConfig" ADD CONSTRAINT "ModelConfig_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationRule" ADD CONSTRAINT "ModerationRule_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationRule" ADD CONSTRAINT "ModerationRule_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assistant" ADD CONSTRAINT "Assistant_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assistant" ADD CONSTRAINT "Assistant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
