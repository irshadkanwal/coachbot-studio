-- CreateEnum
CREATE TYPE "AssistantUsageType" AS ENUM ('general', 'unique');

-- CreateEnum
CREATE TYPE "CommunicationMode" AS ENUM ('text_to_text', 'speech_to_text', 'voice_to_voice', 'video_avatar');

-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "communicationModes" "CommunicationMode"[] DEFAULT ARRAY['text_to_text', 'speech_to_text']::"CommunicationMode"[],
ADD COLUMN     "tokensLimit" INTEGER,
ADD COLUMN     "usageType" "AssistantUsageType";
