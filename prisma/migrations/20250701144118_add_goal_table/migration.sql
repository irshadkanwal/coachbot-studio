-- CreateEnum
CREATE TYPE "GoalFrequency" AS ENUM ('daily', 'weekly', 'monthly');

-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "goalTrack" BOOLEAN;

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "frequency" "GoalFrequency" NOT NULL,
    "repeatEvery" INTEGER NOT NULL,
    "monthlyRepeat" TEXT,
    "weeklyRepeat" TEXT[],
    "completionRule" JSONB NOT NULL,
    "categoryData" JSONB NOT NULL,
    "completed" BOOLEAN,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "assistantId" UUID NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
