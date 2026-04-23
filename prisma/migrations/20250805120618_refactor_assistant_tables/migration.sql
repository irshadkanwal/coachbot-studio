-- AlterTable
ALTER TABLE "AssistantFeedback" ADD COLUMN     "assistantId" UUID;

-- AlterTable
ALTER TABLE "AssistantMeta" ADD COLUMN     "communicationModes" "CommunicationMode"[] DEFAULT ARRAY['text_to_text', 'speech_to_text']::"CommunicationMode"[],
ADD COLUMN     "goalTrack" BOOLEAN,
ADD COLUMN     "tokensLimit" INTEGER,
ADD COLUMN     "usageType" "AssistantUsageType" DEFAULT 'unique';

-- AddForeignKey
ALTER TABLE "AssistantFeedback" ADD CONSTRAINT "AssistantFeedback_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
