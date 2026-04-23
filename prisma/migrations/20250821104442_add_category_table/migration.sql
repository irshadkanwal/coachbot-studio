/*
  Warnings:

  - You are about to drop the column `categoryData` on the `Goal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssistantMeta" ADD COLUMN     "goalVision" BOOLEAN;

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "categoryData",
ADD COLUMN     "categoryId" UUID;

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isDefault" BOOLEAN,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "assistantId" UUID,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_category_assistantId" ON "Category"("assistantId");

-- CreateIndex
CREATE INDEX "idx_category_name_assistant" ON "Category"("name", "assistantId");

-- CreateIndex
CREATE INDEX "idx_category_isDefault" ON "Category"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_assistantId_key" ON "Category"("name", "assistantId");

-- CreateIndex
CREATE INDEX "idx_goal_assistantId" ON "Goal"("assistantId");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
