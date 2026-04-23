-- CreateEnum
CREATE TYPE "AssistantAccessMode" AS ENUM ('full_access', 'high_level', 'confidential');

-- DropIndex
DROP INDEX "AssistantFeedback_assistantMetaId_key";

-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "accessMode" "AssistantAccessMode" NOT NULL DEFAULT 'full_access';

-- AlterTable
ALTER TABLE "AssistantConfiguration" ALTER COLUMN "usageType" SET DEFAULT 'unique';
