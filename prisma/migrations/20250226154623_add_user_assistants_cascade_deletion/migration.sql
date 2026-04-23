-- DropForeignKey
ALTER TABLE "Assistant" DROP CONSTRAINT "Assistant_userId_fkey";

-- DropForeignKey
ALTER TABLE "ModelConfig" DROP CONSTRAINT "ModelConfig_assistantId_fkey";

-- DropForeignKey
ALTER TABLE "ModelConfig" DROP CONSTRAINT "ModelConfig_templateId_fkey";

-- DropForeignKey
ALTER TABLE "ModerationRule" DROP CONSTRAINT "ModerationRule_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_templateId_fkey";

-- AddForeignKey
ALTER TABLE "ModelConfig" ADD CONSTRAINT "ModelConfig_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelConfig" ADD CONSTRAINT "ModelConfig_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationRule" ADD CONSTRAINT "ModerationRule_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assistant" ADD CONSTRAINT "Assistant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
