-- CreateTable
CREATE TABLE "Coach" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "knowledge" TEXT[],
    "assessment" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);
