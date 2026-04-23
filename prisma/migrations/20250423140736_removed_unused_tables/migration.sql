/*
  Warnings:

  - You are about to drop the `ChatLifeAreas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lightrag_doc_chunks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lightrag_doc_full` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lightrag_doc_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lightrag_llm_cache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lightrag_vdb_entity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lightrag_vdb_relation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatLifeAreas" DROP CONSTRAINT "ChatLifeAreas_chatId_fkey";

-- DropTable
DROP TABLE "ChatLifeAreas";

-- DropTable
DROP TABLE "lightrag_doc_chunks";

-- DropTable
DROP TABLE "lightrag_doc_full";

-- DropTable
DROP TABLE "lightrag_doc_status";

-- DropTable
DROP TABLE "lightrag_llm_cache";

-- DropTable
DROP TABLE "lightrag_vdb_entity";

-- DropTable
DROP TABLE "lightrag_vdb_relation";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "life_area";

-- CreateTable
CREATE TABLE "Preference" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "guidelines" TEXT NOT NULL,
    "toneOfVoice" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Preference_userId_key" ON "Preference"("userId");

-- CreateIndex
CREATE INDEX "idx_preference_user_id" ON "Preference"("userId");

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
