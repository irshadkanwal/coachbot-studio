-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "assistantId" UUID;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "stageAnalysis" TEXT;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
